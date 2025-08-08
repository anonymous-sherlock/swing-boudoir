import { useState, useEffect } from 'react';
import hotGirlSummer from '../assets/hot-girl-summer.jpg';
import workoutWarrior from '../assets/workout-warrior.jpg';
import bigGameCompetition from '../assets/big-game-competition.jpg';

export interface Competition {
  id: string;
  title: string;
  description: string;
  prize: string;
  endDate: string;
  participants: number;
  status: 'active' | 'inactive' | 'completed';
  coverImage?: string;
  category?: string;
}

export interface ModelRegistration {
  id: string;
  competitionId: string;
  modelId: string;
  modelName: string;
  registrationDate: string;
  status: 'active' | 'withdrawn';
  votes: number;
  ranking: number;
}

export const useCompetitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [modelRegistrations, setModelRegistrations] = useState<ModelRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load competitions from localStorage
  useEffect(() => {
    const loadCompetitions = () => {
      try {
        const stored = localStorage.getItem('competitions');
        if (stored) {
          setCompetitions(JSON.parse(stored));
        } else {
          // Initialize with default competitions
          const defaultCompetitions: Competition[] = [
            {
              id: 'comp_1',
              title: 'Summer Beauty Contest',
              description: 'Show off your summer style and win amazing prizes!',
              prize: '$5,000',
              endDate: '2024-08-15',
              participants: 156,
              status: 'active',
              coverImage: hotGirlSummer,
              category: 'Beauty'
            },
            {
              id: 'comp_2',
              title: 'Fitness Model Challenge',
              description: 'Celebrate health and fitness with our fitness model competition',
              prize: '$3,500',
              endDate: '2024-09-01',
              participants: 89,
              status: 'active',
              coverImage: workoutWarrior,
              category: 'Fitness'
            },
            {
              id: 'comp_3',
              title: 'Big Game Competition',
              description: 'The ultimate modeling competition with massive prizes',
              prize: '$10,000',
              endDate: '2024-10-15',
              participants: 234,
              status: 'active',
              coverImage: bigGameCompetition,
              category: 'Premium'
            }
          ];
          setCompetitions(defaultCompetitions);
          localStorage.setItem('competitions', JSON.stringify(defaultCompetitions));
        }
      } catch (error) {
        console.error('Error loading competitions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  // Load model registrations from localStorage
  useEffect(() => {
    const loadModelRegistrations = () => {
      try {
        console.log('=== LOADING MODEL REGISTRATIONS ===');
        const stored = localStorage.getItem('modelRegistrations');
        console.log('Raw stored registrations:', stored);
        
        if (stored) {
          const registrations = JSON.parse(stored);
          console.log('Parsed registrations:', registrations);
          setModelRegistrations(registrations);
        } else {
          console.log('No stored registrations found, initializing empty array');
          setModelRegistrations([]);
          localStorage.setItem('modelRegistrations', JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error loading model registrations:', error);
        setModelRegistrations([]);
      }
    };

    loadModelRegistrations();
  }, [forceUpdate]);

  // Listen for storage events to update in real-time
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'competitions') {
        try {
          const newCompetitions = event.newValue ? JSON.parse(event.newValue) : [];
          setCompetitions(newCompetitions);
        } catch (error) {
          console.error('Error parsing competitions from storage event:', error);
        }
      }
      
      if (event.key === 'modelRegistrations') {
        try {
          const newRegistrations = event.newValue ? JSON.parse(event.newValue) : [];
          setModelRegistrations(newRegistrations);
        } catch (error) {
          console.error('Error parsing model registrations from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getActiveCompetitions = () => {
    return competitions.filter(comp => comp.status === 'active');
  };

  const getComingSoonCompetitions = () => {
    return competitions.filter(comp => comp.status === 'inactive');
  };

  const getCompletedCompetitions = () => {
    return competitions.filter(comp => comp.status === 'completed');
  };

  const getModelRegistrations = (modelId: string) => {
    console.log('Getting registrations for model:', modelId);
    console.log('All registrations:', modelRegistrations);
    const userRegistrations = modelRegistrations.filter(reg => reg.modelId === modelId);
    console.log('User registrations:', userRegistrations);
    return userRegistrations;
  };

  const isUserRegistered = (modelId: string, competitionId: string) => {
    return modelRegistrations.some(reg => 
      reg.modelId === modelId && 
      reg.competitionId === competitionId && 
      reg.status === 'active'
    );
  };

  const registerForCompetition = (modelId: string, competitionId: string) => {
    const competition = competitions.find(comp => comp.id === competitionId);
    if (!competition) {
      console.error('Competition not found:', competitionId);
      return { success: false, error: 'Competition not found' };
    }

    // Check if already registered
    if (isUserRegistered(modelId, competitionId)) {
      console.error('User already registered for this competition');
      return { success: false, error: 'Already registered for this competition' };
    }

    const newRegistration: ModelRegistration = {
      id: `reg_${Date.now()}`,
      competitionId,
      modelId,
      modelName: 'User', // This should be updated with actual user name
      registrationDate: new Date().toISOString(),
      status: 'active',
      votes: 0,
      ranking: 0
    };

    const updatedRegistrations = [...modelRegistrations, newRegistration];
    setModelRegistrations(updatedRegistrations);
    localStorage.setItem('modelRegistrations', JSON.stringify(updatedRegistrations));

    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'modelRegistrations',
      newValue: JSON.stringify(updatedRegistrations)
    }));

    console.log('Registration successful:', newRegistration);
    return { success: true, registration: newRegistration };
  };

  const withdrawFromCompetition = (modelId: string, competitionId: string) => {
    const updatedRegistrations = modelRegistrations.map(reg => 
      reg.modelId === modelId && reg.competitionId === competitionId
        ? { ...reg, status: 'withdrawn' as const }
        : reg
    );

    setModelRegistrations(updatedRegistrations);
    localStorage.setItem('modelRegistrations', JSON.stringify(updatedRegistrations));

    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'modelRegistrations',
      newValue: JSON.stringify(updatedRegistrations)
    }));

    return { success: true };
  };

  const updateModelStats = (competitionId: string, modelId: string, votes: number, ranking: number) => {
    const updatedRegistrations = modelRegistrations.map(reg => 
      reg.competitionId === competitionId && reg.modelId === modelId
        ? { ...reg, votes, ranking }
        : reg
    );

    setModelRegistrations(updatedRegistrations);
    localStorage.setItem('modelRegistrations', JSON.stringify(updatedRegistrations));

    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'modelRegistrations',
      newValue: JSON.stringify(updatedRegistrations)
    }));
  };

  const getCompetitionParticipants = (competitionId: string) => {
    return modelRegistrations.filter(reg => 
      reg.competitionId === competitionId && reg.status === 'active'
    );
  };

  const getCompetitionRankings = (competitionId: string) => {
    const participants = getCompetitionParticipants(competitionId);
    return participants.sort((a, b) => b.votes - a.votes);
  };

  return {
    competitions,
    modelRegistrations,
    isLoading,
    getActiveCompetitions,
    getComingSoonCompetitions,
    getCompletedCompetitions,
    getModelRegistrations,
    isUserRegistered,
    registerForCompetition,
    withdrawFromCompetition,
    updateModelStats,
    getCompetitionParticipants,
    getCompetitionRankings,
    forceUpdate: () => setForceUpdate(prev => prev + 1)
  };
}; 