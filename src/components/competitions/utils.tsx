import { Badge } from "@/components/ui/badge";
import { Contest } from "@/hooks/api/useContests";

export const getStatusBadge = (contest: Contest) => {
  // Map API status to display status
  const status = contest.status;
  switch (status) {
    case "ACTIVE":
    case "VOTING":
    case "JUDGING":
      return <Badge className="bg-green-500">Active</Badge>;
    case "COMPLETED":
    case "BOOKED":
      return <Badge variant="secondary">Completed</Badge>;
    case "PUBLISHED":
    case "DRAFT":
      return <Badge variant="outline">Upcoming</Badge>;
    case "CANCELLED":
    case "SUSPENDED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "text-green-600";
    case "VOTING":
      return "text-blue-600";
    case "JUDGING":
      return "text-yellow-600";
    case "COMPLETED":
      return "text-gray-600";
    case "DRAFT":
      return "text-gray-500";
    case "PUBLISHED":
      return "text-green-600";
    case "BOOKED":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

// Helper function to determine competition status
export const getCompetitionStatus = (contest: Contest) => {
  const now = new Date();
  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);

  if (contest.status === "COMPLETED" || now > endDate) {
    return "ended";
  } else if (now >= startDate && now <= endDate) {
    return "active";
  } else {
    return "coming-soon";
  }
};

export const formatPrize = (prize: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(prize);
};
