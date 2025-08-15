import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export interface VoteMultiplier {
    id: string
    multiplierTimes: number
    isActive: boolean
    startTime: string | null
    endTime: string | null
    createdAt: string | null
    updatedAt: string | null
}

export interface VoteMultiplierResponse {
    data: VoteMultiplier[]
    pagination: {
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
        nextPage: number | null
        previousPage: number | null
    }
}

export interface CreateVoteMultiplierData {
    multiplierTimes: number
    isActive: boolean
    startTime: string | null
    endTime: string | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateVoteMultiplierData extends CreateVoteMultiplierData { }

// Query keys
const VOTE_MULTIPLIERS_KEYS = {
    all: ['vote-multipliers'] as const,
    lists: () => [...VOTE_MULTIPLIERS_KEYS.all, 'list'] as const,
    list: (filters: string) => [...VOTE_MULTIPLIERS_KEYS.lists(), { filters }] as const,
    details: () => [...VOTE_MULTIPLIERS_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...VOTE_MULTIPLIERS_KEYS.details(), id] as const,
    active: () => [...VOTE_MULTIPLIERS_KEYS.all, 'active'] as const,
}

// API functions
const fetchVoteMultipliers = async (): Promise<VoteMultiplier[]> => {
    const response = await api.get<VoteMultiplierResponse>('/vote-multiplier-periods')

    if (response.success) {
        return response.data.data
    } else {
        throw new Error(response.error || 'Failed to fetch vote multipliers')
    }
}

const createVoteMultiplier = async (data: CreateVoteMultiplierData): Promise<VoteMultiplier> => {
    const response = await api.post<VoteMultiplier>('/vote-multiplier-periods', data)

    if (response.success) {
        return response.data
    } else {
        throw new Error(response.error || 'Failed to create vote multiplier')
    }
}

const updateVoteMultiplier = async ({ id, data }: { id: string; data: UpdateVoteMultiplierData }): Promise<VoteMultiplier> => {
    const response = await api.put<VoteMultiplier>(`/vote-multiplier-periods/${id}`, data)

    if (response.success) {
        return response.data
    } else {
        throw new Error(response.error || 'Failed to update vote multiplier')
    }
}

const deleteVoteMultiplier = async (id: string): Promise<void> => {
    const response = await api.delete(`/vote-multiplier-periods/${id}`)

    if (!response.success) {
        throw new Error(response.error || 'Failed to delete vote multiplier')
    }
}

const fetchActiveVoteMultiplier = async (): Promise<VoteMultiplier | null> => {
    const response = await api.get<VoteMultiplier>('/vote-multiplier-periods/active')

    if (response.success) {
        return response.data
    } else {
        return null
    }
}

export function useVoteMultipliers() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Query for fetching all vote multipliers
    const {
        data: voteMultipliers = [],
        isLoading: loading,
        error,
        refetch: refetchVoteMultipliers,
    } = useQuery({
        queryKey: VOTE_MULTIPLIERS_KEYS.lists(),
        queryFn: fetchVoteMultipliers,
    })

    // Mutation for creating vote multiplier
    const createMutation = useMutation({
        mutationFn: createVoteMultiplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VOTE_MULTIPLIERS_KEYS.lists() })
            toast({
                title: "Success",
                description: "Vote multiplier created successfully",
            })
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create vote multiplier",
                variant: "destructive",
            })
        },
    })

    // Mutation for updating vote multiplier
    const updateMutation = useMutation({
        mutationFn: updateVoteMultiplier,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VOTE_MULTIPLIERS_KEYS.lists() })
            queryClient.invalidateQueries({ queryKey: VOTE_MULTIPLIERS_KEYS.detail(variables.id) })
            toast({
                title: "Success",
                description: "Vote multiplier updated successfully",
            })
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update vote multiplier",
                variant: "destructive",
            })
        },
    })

    // Mutation for deleting vote multiplier
    const deleteMutation = useMutation({
        mutationFn: deleteVoteMultiplier,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VOTE_MULTIPLIERS_KEYS.lists() })
            toast({
                title: "Success",
                description: "Vote multiplier deleted successfully",
            })
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete vote multiplier",
                variant: "destructive",
            })
        },
    })

    // Query for fetching active vote multiplier
    const {
        data: activeVoteMultiplier,
        isLoading: loadingActive,
    } = useQuery({
        queryKey: VOTE_MULTIPLIERS_KEYS.active(),
        queryFn: fetchActiveVoteMultiplier,
    })

    return {
        voteMultipliers,
        loading,
        error: error?.message || null,
        fetchVoteMultipliers: refetchVoteMultipliers,
        createVoteMultiplier: createMutation.mutateAsync,
        updateVoteMultiplier: (id: string, data: UpdateVoteMultiplierData) => updateMutation.mutateAsync({ id, data }),
        deleteVoteMultiplier: deleteMutation.mutateAsync,
        getActiveVoteMultiplier: () => Promise.resolve({ success: true, data: activeVoteMultiplier }),
        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
