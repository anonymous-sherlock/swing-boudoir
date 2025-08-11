import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Trophy, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { competitionApi } from '@/lib/api';

interface ContestProposal {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  location?: string;
  awards: Array<{ name: string; icon: string }>;
}

const defaultProposal: ContestProposal = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  prizePool: 0,
  location: '',
  awards: [{ name: '', icon: '🏆' }]
};

export const AddContestForm: React.FC = () => {
  const [proposal, setProposal] = useState<ContestProposal>(defaultProposal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAwardName, setNewAwardName] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContestProposal, value: string | number) => {
    setProposal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAwardChange = (index: number, field: 'name' | 'icon', value: string) => {
    const updatedAwards = [...proposal.awards];
    updatedAwards[index] = { ...updatedAwards[index], [field]: value };
    setProposal(prev => ({ ...prev, awards: updatedAwards }));
  };

  const addAward = () => {
    if (newAwardName.trim()) {
      setProposal(prev => ({
        ...prev,
        awards: [...prev.awards, { name: newAwardName.trim(), icon: '🏆' }]
      }));
      setNewAwardName('');
    }
  };

  const removeAward = (index: number) => {
    if (proposal.awards.length > 1) {
      const updatedAwards = proposal.awards.filter((_, i) => i !== index);
      setProposal(prev => ({ ...prev, awards: updatedAwards }));
    }
  };

  const resetForm = () => {
    setProposal(defaultProposal);
  };

  const validateForm = (): string | null => {
    if (!proposal.name.trim()) return 'Contest name is required';
    if (!proposal.description.trim()) return 'Description is required';
    if (!proposal.startDate) return 'Start date is required';
    if (!proposal.endDate) return 'End date is required';
    if (proposal.prizePool <= 0) return 'Prize pool must be greater than 0';
    if (proposal.awards.some(award => !award.name.trim())) return 'All awards must have names';
    if (new Date(proposal.startDate) >= new Date(proposal.endDate)) {
      return 'End date must be after start date';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API submission
      const contestData = {
        name: proposal.name,
        description: proposal.description,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        prizePool: proposal.prizePool,
        awards: proposal.awards
      };

      // Submit to API
      const response = await competitionApi.create(contestData);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your contest proposal has been submitted successfully!",
        });
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to submit proposal');
      }
    } catch (error) {
      console.error('Error submitting contest proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit contest proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Submit Contest Proposal</CardTitle>
        <p className="text-muted-foreground">
          Have an idea for a great contest? Submit your proposal here!
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contest Name *</Label>
              <Input
                id="name"
                value={proposal.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Hot Girl Summer 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={proposal.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your contest idea, rules, and what participants can expect..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Dates and Prize */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={proposal.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={proposal.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool (USD) *</Label>
              <Input
                id="prizePool"
                type="number"
                min="1"
                value={proposal.prizePool}
                onChange={(e) => handleInputChange('prizePool', parseInt(e.target.value) || 0)}
                placeholder="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={proposal.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Miami, FL"
              />
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-4">
            <Label>Awards *</Label>
            <div className="space-y-3">
              {proposal.awards.map((award, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={award.icon}
                    onChange={(e) => handleAwardChange(index, 'icon', e.target.value)}
                    className="w-16 text-center"
                    placeholder="🏆"
                    maxLength={2}
                  />
                  <Input
                    value={award.name}
                    onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                    placeholder="Best Performance"
                    className="flex-1"
                  />
                  {proposal.awards.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAward(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex space-x-2">
                <Input
                  value={newAwardName}
                  onChange={(e) => setNewAwardName(e.target.value)}
                  placeholder="Add a new award..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
                />
                <Button type="button" variant="outline" onClick={addAward}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddContestForm;
