import { api } from '@/lib/api';
import { formatCurrency } from '@/utils/format';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  Trophy, 
  Users, 
  Vote, 
  DollarSign, 
  UserCheck, 
  Gift, 
  CreditCard, 
  PlayCircle, 
  CheckCircle, 
  UserPlus, 
  TrendingUp 
} from 'lucide-react';

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

  const stats: { label: string; value: number|string; subtext: string; icon: React.ReactNode; href: string }[] = [
    {
      label: 'Total Competitions',
      value: dashboardResponse.totalCompetitions,
      subtext: 'All competitions created',
      icon: <Trophy className="h-8 w-8 text-blue-600" />,
      href: '/admin/contests',
    },
    {
      label: 'Total Users',
      value: dashboardResponse.totalUsers,
      subtext: 'Registered platform users',
      icon: <Users className="h-8 w-8 text-green-600" />,
      href: '/admin/users',
    },
    { 
      label: 'Total Votes', 
      value: dashboardResponse.totalVotes, 
      subtext: 'All votes cast',
      icon: <Vote className="h-8 w-8 text-purple-600" />,
      href: '/admin/votes',
    },
    // {
    //   label: 'Total Prize Pool',
    //   value: formatCurrency(dashboardResponse.totalPrizePool, 'USD'),
    //   subtext: 'Prize money in USD',
    //   icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    // },
    {
      label: 'Total Onboarded Users',
      value: dashboardResponse.totalOnboardedUsers,
      subtext: 'Users who completed onboarding',
      icon: <UserCheck className="h-8 w-8 text-emerald-600" />,
      href: '/admin/profiles',
    },
    { 
      label: 'Free Votes', 
      value: dashboardResponse.freeVotes, 
      subtext: 'Votes from free credits',
      icon: <Gift className="h-8 w-8 text-pink-600" />,
      href: '/admin/votes',
    },
    {
      label: 'Paid Votes',
      value: dashboardResponse.paidVotes,
      subtext: 'Votes purchased by users',
      icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
      href: '/admin/votes',
    },
    {
      label: 'Active Competitions',
      value: dashboardResponse.activeCompetitions,
      subtext: 'Currently running contests',
      icon: <PlayCircle className="h-8 w-8 text-red-600" />,
      href: '/admin/contests',
    },
    // {
    //   label: 'Completed Competitions',
    //   value: dashboardResponse.completedCompetitions,
    //   subtext: 'Finished competitions',
    //   icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    // },
    {
      label: 'Total Participants',
      value: dashboardResponse.totalParticipants,
      subtext: 'All unique participants',
      icon: <UserPlus className="h-8 w-8 text-orange-600" />,
      href: '/admin/profiles',
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(dashboardResponse.totalRevenue, 'USD'), 
      subtext: 'Revenue in USD',
      icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
      href: '/admin/analytics',
    },
  ];

  return (
    <div className="space-y-6 min-w-0 overflow-x-auto">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to the Swing Boudoir admin panel. quick insights for contests, users, and more.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {stats.map(stat => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-muted/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center min-w-0 hover:bg-muted/70 cursor-pointer"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <p className="text-2xl font-bold truncate">{stat.value}</p>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-bold truncate">{stat.label}</h3>
                <span className="text-xs text-muted-foreground truncate block">{stat.subtext}</span>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0 ml-2">
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
