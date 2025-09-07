import { ContestAnalytics } from '@/hooks/api/useContests';
import { api } from '@/lib/api';
import Index from '@/pages/Index';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
  loader: async () => {
    const response = await api.get<ContestAnalytics>(`/api/v1/analytics/contests`)
    if (!response.success) {
      return {
        "total": 0,
        "active": 0,
        "upcoming": 0,
        "prizePool": 0
      }
    }
    return response.data
  },
});
