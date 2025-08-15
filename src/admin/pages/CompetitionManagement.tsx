import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Camera, 
  Trophy, 
  Users,
  Save,
  Globe
} from 'lucide-react';

import CompetitionCard from '@/components/CompetitionCard';

interface Competition {
  id: string;
  title: string;
  image: string;
  prize: string;
  endDate: string;
  location?: string;
  perks: string[];
  description: string;
  status: 'active' | 'coming-soon' | 'ended';
  createdAt: string;
  updatedAt: string;
}

interface CompetitionFormData {
  title: string;
  image: string;
  prize: string;
  endDate: string;
  location: string;
  perks: string[];
  description: string;
  status: 'active' | 'coming-soon' | 'ended';
}

const defaultFormData: CompetitionFormData = {
  title: '',
  image: '',
  prize: '',
  endDate: '',
  location: '',
  perks: [],
  description: '',
  status: 'coming-soon'
};

export const CompetitionManagement: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [formData, setFormData] = useState<CompetitionFormData>(defaultFormData);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPerk, setNewPerk] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load competitions from localStorage
  useEffect(() => {
    const storedCompetitions = localStorage.getItem('competitions');
    if (storedCompetitions) {
      setCompetitions(JSON.parse(storedCompetitions));
    }
  }, []);

  // Save competitions to localStorage
  const saveCompetitions = (newCompetitions: Competition[]) => {
    localStorage.setItem('competitions', JSON.stringify(newCompetitions));
    setCompetitions(newCompetitions);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'competitions',
      newValue: JSON.stringify(newCompetitions)
    }));
  };

  const handleInputChange = (field: keyof CompetitionFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPerk = () => {
    if (newPerk.trim()) {
      handleInputChange('perks', [...formData.perks, newPerk.trim()]);
      setNewPerk('');
    }
  };

  const removePerk = (index: number) => {
    const updatedPerks = formData.perks.filter((_, i) => i !== index);
    handleInputChange('perks', updatedPerks);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const competitionData: Competition = {
        id: editingId || `comp_${Date.now()}`,
        ...formData,
        createdAt: editingId ? competitions.find(c => c.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedCompetitions: Competition[];

      if (editingId) {
        // Update existing competition
        updatedCompetitions = competitions.map(comp => 
          comp.id === editingId ? competitionData : comp
        );
      } else {
        // Create new competition
        updatedCompetitions = [...competitions, competitionData];
      }

      // Save to localStorage
      saveCompetitions(updatedCompetitions);

      // TODO: API call when backend is ready
      // const response = await fetch('/api/contest', {
      //   method: editingId ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(competitionData)
      // });

      resetForm();
    } catch (error) {
      console.error('Error saving competition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (competition: Competition) => {
    setFormData({
      title: competition.title,
      image: competition.image,
      prize: competition.prize,
      endDate: competition.endDate,
      location: competition.location || '',
      perks: competition.perks,
      description: competition.description,
      status: competition.status
    });
    setEditingId(competition.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      const updatedCompetitions = competitions.filter(comp => comp.id !== id);
      saveCompetitions(updatedCompetitions);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'coming-soon': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Competition Management</h1>
          <p className="text-muted-foreground">
            Create and manage competitions for your platform
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Create Competition
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Competitions</TabsTrigger>
          <TabsTrigger value="create" onClick={() => setIsCreating(true)}>
            {editingId ? 'Edit Competition' : 'Create New'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Competitions List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => (
              <Card key={competition.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{competition.title}</CardTitle>
                    <Badge className={getStatusColor(competition.status)}>
                      {competition.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-medium">{competition.prize}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ends: {competition.endDate}</span>
                  </div>
                  {competition.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{competition.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span>{competition.perks.length} perks</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(competition)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(competition.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {competitions.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Competitions Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first competition to get started
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Competition
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Edit Competition' : 'Create New Competition'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Competition Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Hot Girl Summer 2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prize">Prize *</Label>
                      <Input
                        id="prize"
                        value={formData.prize}
                        onChange={(e) => handleInputChange('prize', e.target.value)}
                        placeholder="$10,000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Miami, FL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL *</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the competition, rules, and what participants can expect..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Perks */}
                  <div className="space-y-2">
                    <Label>Perks & Benefits</Label>
                    <div className="space-y-2">
                      {formData.perks.map((perk, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={perk}
                            onChange={(e) => {
                              const updatedPerks = [...formData.perks];
                              updatedPerks[index] = e.target.value;
                              handleInputChange('perks', updatedPerks);
                            }}
                            placeholder="Free photoshoot session"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePerk(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          value={newPerk}
                          onChange={(e) => setNewPerk(e.target.value)}
                          placeholder="Add a new perk..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerk())}
                        />
                        <Button type="button" variant="outline" onClick={addPerk}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'coming-soon' | 'ended')}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                      title="Select competition status"
                    >
                      <option value="coming-soon">Coming Soon</option>
                      <option value="active">Active</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : (editingId ? 'Update Competition' : 'Create Competition')}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      {isCreating && formData.title && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompetitionCard
              id="preview"
              title={formData.title}
              image={formData.image || '/placeholder.svg'}
              prize={formData.prize}
              endDate={formData.endDate}
              location={formData.location}
              perks={formData.perks}
              description={formData.description}
              status={formData.status}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 