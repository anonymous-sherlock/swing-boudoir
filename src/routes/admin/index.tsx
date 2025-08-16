import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  component: () => <Page />,
  loader: async () => {
    const response = await api.get('/api/v1/analytics/dashboard');

    return response.data as DashboardAnalytics;
  },
});

type DashboardAnalytics = {
  totalCompetitions: number;
  totalUsers: number;
  totalVotes: number;
  totalPrizePool: number;
  totalOnboardedUsers: number;
  freeVotes: number;
  paidVotes: number;
  activeCompetitions: number;
  completedCompetitions: number;
  totalParticipants: number;
  totalRevenue: number;
};

export default function Page() {
  const dashboardResponse = Route.useLoaderData();

  const stats: { label: string; value: number; subtext: string }[] = [
    {
      label: 'Total Competitions',
      value: dashboardResponse.totalCompetitions,
      subtext: 'All competitions created',
    },
    {
      label: 'Total Users',
      value: dashboardResponse.totalUsers,
      subtext: 'Registered platform users',
    },
    { label: 'Total Votes', value: dashboardResponse.totalVotes, subtext: 'All votes cast' },
    {
      label: 'Total Prize Pool',
      value: dashboardResponse.totalPrizePool,
      subtext: 'Prize money in USD',
    },
    {
      label: 'Total Onboarded Users',
      value: dashboardResponse.totalOnboardedUsers,
      subtext: 'Users who completed onboarding',
    },
    { label: 'Free Votes', value: dashboardResponse.freeVotes, subtext: 'Votes from free credits' },
    {
      label: 'Paid Votes',
      value: dashboardResponse.paidVotes,
      subtext: 'Votes purchased by users',
    },
    {
      label: 'Active Competitions',
      value: dashboardResponse.activeCompetitions,
      subtext: 'Currently running contests',
    },
    {
      label: 'Completed Competitions',
      value: dashboardResponse.completedCompetitions,
      subtext: 'Finished competitions',
    },
    {
      label: 'Total Participants',
      value: dashboardResponse.totalParticipants,
      subtext: 'All unique participants',
    },
    { label: 'Total Revenue', value: dashboardResponse.totalRevenue, subtext: 'Revenue in USD' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Swing Boudior admin panel. Manage competitions, users, and settings.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-muted/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">{stat.label}</h3>
              <span className="text-xs text-muted-foreground">{stat.subtext}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
