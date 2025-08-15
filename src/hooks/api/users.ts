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
    isActive: z.boolean().default(true),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const UserInsertSchema = UserSchema.pick({
    email: true,
    username: true,
    name: true,
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
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// API functions
const createUser = async (userData: CreateUserData): Promise<User> => {
    const response = await fetch("http://localhost:9999/api/v1/users", {
        method: "POST",
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
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
    return response.data;
};

const getUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

const updateUser = async ({ id, data }: { id: string; data: UpdateUserData }): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};

const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

// React Query hooks
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            // Invalidate and refetch users list
            queryClient.invalidateQueries({ queryKey: ["users"] });

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
