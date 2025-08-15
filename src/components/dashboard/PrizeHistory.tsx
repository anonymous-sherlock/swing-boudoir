import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Gift, Award } from "lucide-react";

// Mock data for prize history
const mockPrizeHistory = [
  {
    id: 1,
    title: "Hot Girl Summer - Barbados Level 1 Round Winner",
    date: "07/29/2024",
    prize: "HGS Barbados Level 1 Prize Box",
    status: "delivered",
    description: "Congratulations! You won the first level of the Hot Girl Summer - Barbados competition.",
    value: "$2,500",
    type: "round_winner"
  },
  {
    id: 2,
    title: "Big Game Competition - Top 10 Finalist",
    date: "06/15/2024",
    prize: "Big Game Finalist Package",
    status: "shipped",
    description: "You made it to the top 10 finalists in the Big Game Competition!",
    value: "$1,000",
    type: "finalist"
  },
  {
    id: 3,
    title: "Workout Warrior - Monthly Challenge Winner",
    date: "05/30/2024",
    prize: "Fitness Equipment Bundle",
    status: "delivered",
    description: "Winner of the May monthly challenge in Workout Warrior competition.",
    value: "$750",
    type: "monthly_winner"
  }
];

const mockUpcomingPrizes = [
  {
    id: 4,
    title: "Hot Girl Summer - Barbados Level 2",
    expectedDate: "12/31/2024",
    prize: "HGS Barbados Level 2 Grand Prize",
    status: "pending",
    description: "Currently competing for the Level 2 grand prize.",
    estimatedValue: "$25,000",
    currentRanking: 3,
    requirement: "Top 3 finish required"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>;
    case "shipped":
      return <Badge className="bg-blue-500">Shipped</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    case "processing":
      return <Badge className="bg-yellow-500">Processing</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "round_winner":
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case "finalist":
      return <Award className="h-5 w-5 text-purple-500" />;
    case "monthly_winner":
      return <Gift className="h-5 w-5 text-blue-500" />;
    default:
      return <Trophy className="h-5 w-5 text-primary" />;
  }
};

export function PrizeHistory() {
  const totalPrizeValue = mockPrizeHistory.reduce((sum, prize) => {
    const value = parseInt(prize.value.replace(/[,$]/g, ''));
    return sum + value;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Prize History</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Prize Value</p>
          <p className="text-xl font-bold text-primary">${totalPrizeValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Prize Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Prizes Won</p>
                <p className="text-2xl font-bold">{mockPrizeHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Delivered Prizes</p>
                <p className="text-2xl font-bold">
                  {mockPrizeHistory.filter(p => p.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Prizes</p>
                <p className="text-2xl font-bold">{mockUpcomingPrizes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prize History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Prize History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockPrizeHistory.length > 0 ? (
            <div className="space-y-4">
              {mockPrizeHistory.map((prize) => (
                <div key={prize.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(prize.type)}
                      <div>
                        <h3 className="font-semibold text-lg">{prize.title}</h3>
                        <p className="text-muted-foreground">{prize.description}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(prize.status)}
                      <p className="text-sm font-semibold text-primary">{prize.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-muted/50 rounded p-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Date: {prize.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Gift className="mr-1 h-4 w-4" />
                      Prize: {prize.prize}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Prizes Won Yet</h3>
              <p className="text-muted-foreground">
                Keep participating in competitions to win amazing prizes!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming/Pending Prizes */}
      {mockUpcomingPrizes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Upcoming Prize Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingPrizes.map((prize) => (
                <div key={prize.id} className="border rounded-lg p-4 space-y-3 bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{prize.title}</h3>
                        <p className="text-muted-foreground">{prize.description}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(prize.status)}
                      <p className="text-sm font-semibold text-primary">{prize.estimatedValue}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-background rounded p-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      Expected: {prize.expectedDate}
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="mr-1 h-4 w-4 text-muted-foreground" />
                      Current Rank: #{prize.currentRanking}
                    </div>
                    <div className="flex items-center text-sm">
                      <Trophy className="mr-1 h-4 w-4 text-muted-foreground" />
                      {prize.requirement}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}