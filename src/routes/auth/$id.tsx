import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';
import { toast } from '@/components/ui/use-toast';
// Removed AUTH_TOKEN_KEY import as we're using cookies now
import Auth from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

// Define valid auth route IDs
type AuthRouteId = "sign-in" | "sign-up" | "callback";

// Define search parameters
interface AuthSearchParams {
  callback?: string;
  token?: string;
  error?: string;
  redirectTo?: string;
}

export const Route = createFileRoute("/auth/$id")({
  component: AuthPage,
  errorComponent: NotFound,
  notFoundComponent: NotFound,
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    return {
      callback: typeof search.callback === "string" ? search.callback : undefined,
      token: typeof search.token === "string" ? search.token : undefined,
      error: typeof search.error === "string" ? search.error : undefined,
      redirectTo: typeof search.redirectTo === "string" ? search.redirectTo : undefined,
    };
  },
  params: {
    parse: (params) => {
      if (params.id !== "sign-in" && params.id !== "sign-up" && params.id !== "callback") {
        throw new Error(`Invalid auth route: ${params.id}`);
      }
      return { id: params.id as AuthRouteId };
    },
  },
  beforeLoad: ({ params }) => {
    // Type-safe validation
    const validIds: AuthRouteId[] = ["sign-in", "sign-up", "callback"];
    if (!validIds.includes(params.id as AuthRouteId)) {
      throw new Error(`Invalid auth route. Must be one of: ${validIds.join(", ")}`);
    }
  },
});

function AuthPage() {
  const { id } = Route.useParams();
  const search = useSearch({ from: '/auth/$id' });

  // Handle OAuth callback
  if (id === 'callback') {
    return <OAuthCallbackPage />;
  }

  // Handle regular auth pages
  return <Auth />;
}

// OAuth Callback Component
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { revalidateSession, checkUserNeedsOnboarding } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const search = useSearch({ from: '/auth/$id' });

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const redirectTo = search.redirectTo as string;

        // Revalidate session to get fresh user data
        const session = await revalidateSession();

        console.log("OAuth callback session:", session);

        if (!session.session) {
          throw new Error("No session received from OAuth callback");
        }

        // Wait for AuthContext to update with the new session
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if user needs onboarding BEFORE redirecting
        // Use the session data directly to avoid race conditions
        const needsOnboarding = !session.user.profileId || !session.session.profileId;
        console.log("OAuth callback - User needs onboarding:", needsOnboarding, {
          userProfileId: session.user.profileId,
          sessionProfileId: session.session.profileId
        });

        // Double-check with AuthContext as fallback (in case of race conditions)
        const authContextNeedsOnboarding = checkUserNeedsOnboarding();
        console.log("OAuth callback - AuthContext check:", authContextNeedsOnboarding);
        
        // Use the more reliable check (session data is more reliable than context state)
        const finalNeedsOnboarding = needsOnboarding || authContextNeedsOnboarding;

        // Determine redirect path - prioritize onboarding over dashboard
        let targetPath = '/dashboard';
        
        if (finalNeedsOnboarding) {
          targetPath = '/onboarding';
        } else if (redirectTo && redirectTo !== '/dashboard') {
          // Only use custom redirect if user doesn't need onboarding
          targetPath = redirectTo;
        }

        console.log("OAuth callback redirecting to:", targetPath);
        
        // Navigate to the determined path
        navigate({ to: targetPath, replace: true });
        
        toast({
          title: 'Welcome!',
          description: 'Successfully signed in with Google',
        });

      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to complete authentication',
          variant: 'destructive',
        });
        navigate({ to: '/auth/$id', params: { id: 'sign-in' }, replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [search, navigate, revalidateSession, checkUserNeedsOnboarding]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PageLoader />
          <p className="mt-4 text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
};
