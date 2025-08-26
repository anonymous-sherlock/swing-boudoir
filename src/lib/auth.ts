/**
 * Authentication Utilities for Swing Boudoir Showcase
 * 
 * This module handles:
 * - Manual email/password authentication
 * - JWT token management and validation
 * - API authentication headers
 * - User session management
 * 
 * @author Swing Boudoir Development Team
 * @version 1.0.0
 */

import { API_CONFIG } from "@/lib/config";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: API_CONFIG.AUTH_BASE_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                // User profile fields
                role: { type: ["USER", "ADMIN", "MODERATOR"], },
                profileId: { type: "string", required: false },

            },
            session: {
                role: { type: ["USER", "ADMIN", "MODERATOR"], },
                profileId: { type: "string", required: false },
            }
        }),
    ],
})
export const AUTH_TOKEN_KEY = "b-auth-swing"


export const { signIn, signUp, signOut, useSession, deleteUser, changePassword, listSessions } = authClient;