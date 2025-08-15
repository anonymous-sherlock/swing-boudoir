// import React from "react";
// import { Toaster } from "@/components/ui/toaster";
// import { AuthProvider, ProtectedRoute, useAuth } from "@/contexts/AuthContext";
// import { OnboardingProvider } from "@/contexts/OnboardingContext";
// import { PageLoader } from "@/components/PageLoader";
// import { isProtectedRoute } from "@/routes";
// import { useRouter } from "@tanstack/react-router";

// // Global Loading Wrapper Component
// // Uses centralized route configuration from routes.ts for better maintainability
// const AppContent: React.FC = () => {
//   const { isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = router.state.location.pathname;

//   // Show global loader only for protected routes while auth state is being determined
//   // Public routes (like /auth/:id) should render immediately for better UX
//   if (isLoading && isProtectedRoute(pathname)) {
//     return <PageLoader />;
//   }

//   return null; // TanStack Router handles the routing automatically
// };

// function App() {
//   return (
//     <AuthProvider>
//       <OnboardingProvider>
//         <div className="App">
//           <AppContent />
//           <Toaster />
//         </div>
//       </OnboardingProvider>
//     </AuthProvider>
//   );
// }

// export default App;
