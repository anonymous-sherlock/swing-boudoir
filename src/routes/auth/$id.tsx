import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';
import { toast } from '@/components/ui/use-toast';
import { AUTH_TOKEN_KEY } from '@/lib/auth';
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
  const { revalidateSession } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const search = useSearch({ from: '/auth/$id' });

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
     
        const redirectTo = search.redirectTo as string;

        const session = await revalidateSession();

        console.log("session", session);

        if (!session.session) {
          throw new Error("No session received from OAuth callback");
        }

        // Store the token
        localStorage.setItem(AUTH_TOKEN_KEY, session.session.token);

        // Redirect to the intended destination or default
        const targetPath = redirectTo || '/dashboard';
        navigate({ to: targetPath });
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
        navigate({ to: '/auth/$id', params: { id: 'sign-in' } });
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [search, navigate, revalidateSession]);

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
