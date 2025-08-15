import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      router.state.location.pathname
    );
  }, [router.state.location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-8xl md:text-9xl font-display font-bold text-accent mb-8 opacity-50">
                404
              </div>
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                Page Not Found
              </h1>
              
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved to a new location.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-competition text-competition-foreground">
                  <a href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </a>
                </Button>
                
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="/competitions">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Competitions
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
