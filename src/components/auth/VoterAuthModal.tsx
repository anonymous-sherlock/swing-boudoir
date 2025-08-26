/**
 * Voter Authentication Modal Component
 *
 * This component provides a simplified authentication flow for voters:
 * - Email/password registration (VOTER type)
 * - Email/password login
 * - Form validation
 * - Loading states
 * - No profile creation required
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { VoterLoginForm } from "./VoterLoginForm";
import { VoterRegisterForm } from "./VoterRegisterForm";

interface VoterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  callbackURL?: string;
}

export const VoterAuthModal: React.FC<VoterAuthModalProps> = ({ isOpen, onClose, onSuccess, callbackURL }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  // Handle tab switching from child components
  React.useEffect(() => {
    const handleSwitchToRegister = () => setActiveTab("register");
    const handleSwitchToLogin = () => setActiveTab("login");

    window.addEventListener("switchToRegister", handleSwitchToRegister);
    window.addEventListener("switchToLogin", handleSwitchToLogin);

    return () => {
      window.removeEventListener("switchToRegister", handleSwitchToRegister);
      window.removeEventListener("switchToLogin", handleSwitchToLogin);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Vote for Your Favorite Models</DialogTitle>
          <p className="text-center text-sm text-gray-600 mt-2">Register or login to start voting in competitions</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="w-full grid-cols-2 hidden">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <VoterLoginForm onSuccess={handleSuccess} callbackURL={callbackURL} />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <VoterRegisterForm onSuccess={handleSuccess} callbackURL={callbackURL} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
