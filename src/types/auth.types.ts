
export type User_Role = "USER" | "MODERATOR" | "ADMIN";
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  username: string;
  displayUsername?: string;
  role: User_Role
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileId?: string
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  role: User_Role
  profileId?: string
}

export interface SignUpWithEmailRequest {
  name: string
  email: string
  password: string
  username: string
  image?: string | undefined
  callbackURL?: string | null
  rememberMe?: boolean | undefined
}

export interface SignInWithEmailRequest {
  email: string,
  password: string,
}

export interface SignInWithEmailResponse {
  redirect: boolean
  token: string
  url: string | null
  user: User
}

export interface GetSessionResponse {
  user: User
  session: Session
}
