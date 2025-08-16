import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Users, DollarSign, MessageSquare, AlertCircle } from "lucide-react";
import { api, apiRequest } from '@/lib/api';

interface Vote {
  id: string;
  voterId: string;
  voterName: string;
  profileId: string;
  votes: number;
  comment?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VoteStats {
  totalVotes: number;
  freeVotes: number;
  premiumVotes: number;
  totalVoters: number;
  averageVotesPerVoter: number;
}

export function Votes() {
  const { user } = useAuth();
  const [topVoters, setTopVoters] = useState<Vote[]>([]);
  const [recentVotes, setRecentVotes] = useState<Vote[]>([]);
  const [premiumVotes, setPremiumVotes] = useState<Vote[]>([]);
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [error, setError] = useState<string | null>(null);


  const fetchVoteData = async () => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      
      // Fetch vote statistics
      const statsResponse = await api.get(`/api/v1/votes/stats?profileId=${user?.profileId}`);

      if (!statsResponse.success) {
        throw new Error('Failed to fetch vote statistics');
      } 

      if (statsResponse.success) {
        const statsData = await statsResponse.data;
        setVoteStats(statsData as VoteStats);
      }

      // Fetch top voters
      const topVotersResponse = await apiRequest(`/api/v1/votes/top-voters?profileId=${user?.id}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (topVotersResponse.success) {
        const topVotersData = await topVotersResponse.data as { votes?: Vote[] };
        setTopVoters(topVotersData.votes || []);
      }

      // Fetch recent votes
      const recentVotesResponse = await api.get(`/api/v1/votes/recent?profileId=${user?.id}&limit=20`);

      if (recentVotesResponse.success) {
        const recentVotesData = await recentVotesResponse.data;
        setRecentVotes(recentVotesData.votes || []);
      } 

      if (recentVotesResponse.success) {
        const recentVotesData = await recentVotesResponse.data;
        setRecentVotes(recentVotesData.votes || []);
      }

      // Fetch premium votes
      const premiumVotesResponse = await fetch(`/api/v1/votes/premium?profileId=${user?.id}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (premiumVotesResponse.ok) {
        const premiumVotesData = await premiumVotesResponse.json();
        setPremiumVotes(premiumVotesData.votes || []);
      }

    } catch (error) {
      console.error('Error fetching vote data:', error);
      setError('Failed to load vote data');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return `${Math.floor(diffInMinutes / 10080)}w ago`;
  };

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
        <h1 className="text-2xl font-bold text-foreground">Votes</h1>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading votes</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={fetchVoteData} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Votes</h1>

      {/* Vote Statistics */}
      {voteStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">{voteStats.totalVotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Free Votes</p>
                  <p className="text-2xl font-bold">{voteStats.freeVotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Premium Votes</p>
                  <p className="text-2xl font-bold">{voteStats.premiumVotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Voters</p>
                  <p className="text-2xl font-bold">{voteStats.totalVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voter Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Voter Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top 10 Voters */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top 10 Voters</h3>
              {topVoters.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No votes yet</h3>
                  <p className="text-muted-foreground">
                    Share your profile to start receiving votes!
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voter</TableHead>
                      <TableHead>Number of Votes</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topVoters.map((vote) => (
                      <TableRow key={vote.id}>
                        <TableCell className="font-medium">
                          {vote.isPremium ? `${vote.voterName} (Premium)` : vote.voterName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={vote.isPremium ? "default" : "secondary"}>
                            {vote.votes}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vote.comment ? (
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              {vote.comment}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatTime(vote.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Note about free votes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Free votes shown below may include both legitimate and fraudulent votes.
              </p>
            </div>

            {/* Last 20 Votes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Last 20 Votes</h3>
              {recentVotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent votes</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voter</TableHead>
                      <TableHead>Number of Votes</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentVotes.slice(0, 20).map((vote) => (
                      <TableRow key={vote.id}>
                        <TableCell className="font-medium">
                          {vote.isPremium ? `${vote.voterName} (Premium)` : vote.voterName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={vote.isPremium ? "default" : "outline"}>
                            {vote.votes}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vote.comment ? (
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              {vote.comment}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatTime(vote.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Votes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Last 50 Premium Votes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {premiumVotes.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No premium votes yet</h3>
              <p className="text-muted-foreground">
                Premium votes will appear here when supporters purchase vote packages.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voter</TableHead>
                  <TableHead>Number of Votes</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {premiumVotes.map((vote) => (
                  <TableRow key={vote.id}>
                    <TableCell className="font-medium">{vote.voterName}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{vote.votes}</Badge>
                    </TableCell>
                    <TableCell>
                      {vote.comment ? (
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {vote.comment}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTime(vote.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}