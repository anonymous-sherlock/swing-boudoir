import React from 'react';
import { AddContestForm } from '@/components/AddContestForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

export const AddContest: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Submit Contest Proposal</h1>
            <p className="text-muted-foreground mt-2">
              Share your contest idea with the community
            </p>
          </div>
        </div>

        {/* Form */}
        <AddContestForm />
      </div>
    </div>
  );
};

export default AddContest;
