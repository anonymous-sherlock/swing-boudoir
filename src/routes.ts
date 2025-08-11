export const authRoutes = ["/sign-in", "/sign-up", "/auth/error", "/sign-in/reset-password", "/sign-in/reset-password/step-2", "/api/trpc/user.add"];

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/competitions",
  "/winners", 
  "/rules",
  "/faq",
  "/contact",
  "/admin/login",
  "/admin/register"
];

/**
 * Route patterns that should be treated as public
 * These use pattern matching (e.g., /auth/:id, /profile/:id)
 * @type {string[]}
 */
export const publicRoutePatterns = [
  "/auth/",
  "/profile/"
];

/**
 * Protected routes that require authentication
 * @type {string[]}
 */
export const protectedRoutes = [
  "/dashboard",
  "/onboarding"
];

/**
 * Check if a given pathname is a public route
 * @param pathname - The current pathname to check
 * @returns boolean - True if the route is public, false otherwise
 */
export const isPublicRoute = (pathname: string): boolean => {
  // Check exact matches
  if (publicRoutes.includes(pathname)) return true;
  
  // Check pattern matches
  return publicRoutePatterns.some(pattern => pathname.startsWith(pattern));
};

/**
 * Check if a given pathname is a protected route
 * @param pathname - The current pathname to check
 * @returns boolean - True if the route is protected, false otherwise
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
};

/**
 * Authentication page routes
 * Using full paths for consistency and easier maintenance
 * All components can use these directly without path construction
 */
export const authPages = {
    login: "/auth/sign-in",
    register: "/auth/sign-up",
    resetPassWord: "/auth/reset-password",
};

/**
 * The default onboarding redirect path after logging in
 * @type {string}
 */
export const ONBOARDING_REDIRECT = "/onboarding";
export const DASHBOARD_REDIRECT = "/dashboard";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_AFTER_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_AFTER_LOGOUT_REDIRECT = "/auth/sign-in"