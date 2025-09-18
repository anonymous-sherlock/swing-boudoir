import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";

// Import types from your server's database schema
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    username: z.string().max(100),
    displayUsername: z.string().nullable(),
    name: z.string(),
    role: z.enum(["USER", "ADMIN", "MODERATOR"]),
    type: z.enum(["MODEL", "VOTER"]),
    isActive: z.boolean().default(true),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const UserInsertSchema = UserSchema.pick({
    email: true,
    username: true,
    name: true,
    role: true,
    type: true,
}).extend({
    password: z.string()
});

// Use the imported types
export type CreateUserData = z.infer<typeof UserInsertSchema>;
export type User = z.infer<typeof UserSchema>;

// Create UpdateUserData type based on the schema
export type UpdateUserData = Partial<Omit<CreateUserData, 'password'>> & {
    isActive?: boolean;
};

// API response type for paginated users
export interface UsersResponse {
    data: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// API functions
const createUser = async (userData: CreateUserData): Promise<User> => {
    const response = await api.post("/users", userData);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data;
};

const getUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}): Promise<UsersResponse> => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = queryParams.toString() ? `/users?${queryParams.toString()}` : '/users';
    const response = await api.get(endpoint);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as UsersResponse;
};

const getUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as User;
};

const getUserByEmail = async (email: string): Promise<User> => {
    const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as User;
};

const getUserByUsername = async (username: string): Promise<User> => {
    const response = await api.get(`/users/username/${encodeURIComponent(username)}`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as User;
};

const updateUser = async ({ id, data }: { id: string; data: UpdateUserData }): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as User;
};

const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as { message: string };
};

const changeUserType = async ({ id, type }: { id: string; type: "MODEL" | "VOTER" }): Promise<User> => {
    const response = await api.patch(`/users/${id}/type`, { type });
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as User;
};

type UserProfile = Record<string, unknown>;

const getUserProfile = async (id: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${id}/profile`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as UserProfile;
};

const updateNullUsernames = async (): Promise<{ message: string; updatedCount: number; users: Array<{ id: string; email: string; oldUsername: string | null; newUsername: string; }> }> => {
    const response = await api.post(`/users/update-null-usernames`);
    if (!response.success) {
        throw new Error(response.error);
    }
    return response.data as { message: string; updatedCount: number; users: Array<{ id: string; email: string; oldUsername: string | null; newUsername: string; }>; };
};

const createVoterProfile = async (id: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${id}/voter/profile/create`);
    if (!response.success) {
        throw new Error(response.error);
    }
    // Backend may return extra fields (user, profile). We only type the message here.
    return response.data as { message: string };
};

// React Query hooks
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            // Invalidate and refetch users list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["users-admin-list"] });

            // Optionally add the new user to the cache
            queryClient.setQueryData(["users"], (oldData: unknown) => {
                if (oldData && typeof oldData === 'object' && 'pages' in oldData) {
                    const paginatedData = oldData as { pages: Array<{ data: User[] }> };
                    if (Array.isArray(paginatedData.pages)) {
                        return {
                            ...oldData,
                            pages: paginatedData.pages.map((page, index) => {
                                if (index === 0) {
                                    return {
                                        ...page,
                                        data: [data, ...page.data],
                                    };
                                }
                                return page;
                            }),
                        };
                    }
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Failed to create user:", error);
        },
    });
};

export const useGetUsers = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetUserByEmail = (email: string) => {
    return useQuery({
        queryKey: ["users", "email", email],
        queryFn: () => getUserByEmail(email),
        enabled: !!email,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useGetUserByUsername = (username: string) => {
    return useQuery({
        queryKey: ["users", "username", username],
        queryFn: () => getUserByUsername(username),
        enabled: !!username,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useGetUserProfile = (id: string) => {
    return useQuery({
        queryKey: ["users", id, "profile"],
        queryFn: () => getUserProfile(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data, variables) => {
            // Update the specific user in cache
            queryClient.setQueryData(["users", variables.id], data);

            // Invalidate users list to refetch
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to update user:", error);
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: (data, id) => {
            // Remove the deleted user from cache
            queryClient.removeQueries({ queryKey: ["users", id] });

            // Invalidate users list to refetch
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to delete user:", error);
        },
    });
};

export const useChangeUserType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changeUserType,
        onSuccess: (data, variables) => {
            // Update the specific user in cache
            queryClient.setQueryData(["users", variables.id], data);

            // Invalidate users list to refetch
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["users-admin-list"] });
        },
        onError: (error) => {
            console.error("Failed to change user type:", error);
        },
    });
};

// Utility hook for user search
export const useSearchUsers = (searchTerm: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["users", "search", searchTerm],
        queryFn: () => getUsers({ search: searchTerm, limit: 50 }),
        enabled: enabled && searchTerm.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes for search results
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for bulk operations
export const useBulkUpdateUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ ids, data }: { ids: string[]; data: UpdateUserData }) => {
            const promises = ids.map(id => updateUser({ id, data }));
            return Promise.all(promises);
        },
        onSuccess: (data, variables) => {
            // Update each user in cache
            variables.ids.forEach((id, index) => {
                queryClient.setQueryData(["users", id], data[index]);
            });

            // Invalidate users list
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to bulk update users:", error);
        },
    });
};

export const useBulkDeleteUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const promises = ids.map(id => deleteUser(id));
            return Promise.all(promises);
        },
        onSuccess: (data, ids) => {
            // Remove deleted users from cache
            ids.forEach(id => {
                queryClient.removeQueries({ queryKey: ["users", id] });
            });

            // Invalidate users list
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to bulk delete users:", error);
        },
    });
};

export const useUpdateNullUsernames = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateNullUsernames,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to update null usernames:", error);
        },
    });
};

export const useCreateVoterProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVoterProfile,
        onSuccess: (_data, id) => {
            // Invalidate caches related to this user
            queryClient.invalidateQueries({ queryKey: ["users", id] });
            queryClient.invalidateQueries({ queryKey: ["users", id, "profile"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["users-admin-list"] });
        },
        onError: (error) => {
            console.error("Failed to create voter profile:", error);
        },
    });
};
