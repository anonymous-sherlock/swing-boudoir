import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Megaphone as Marketing, Lock, User, Trash2, LogOut, Cookie, Shield, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EditProfile } from "./EditProfile";
import { useProfile } from "@/hooks/useProfile";

interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  gender?: string;
  hobbiesAndPassions?: string;
  paidVoterMessage?: string;
  freeVoterMessage?: string;
  lastFreeVoteAt?: string;
  coverImageId?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock settings data
const mockSettings = {
  notifications: {
    email: true,
    sms: false,
    marketing: true,
  },
  privacy: {
    acceptAllCookies: false,
    acceptNecessaryCookies: true,
  },
};

export function Settings() {
  const { user, handleLogout } = useAuth();

  const [settings, setSettings] = useState(mockSettings);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [phone, setPhone] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const { toast } = useToast();
  const { updateProfile } = useProfile();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/v1/users/${user.id}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          setPhone(profile.phone || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));

    // TODO: API call to update settings
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));

    // TODO: API call to update settings
    toast({
      title: "Privacy Settings Updated",
      description: "Your cookie preferences have been saved.",
    });
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // TODO: API call to change password
    console.log("Changing password");
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });

    setIsChangingPassword(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmed) {
      // TODO: API call to delete account
      console.log("Deleting account");
      toast({
        title: "Account Deletion",
        description: "Your account deletion request has been submitted.",
      });
    }
  };

  const handleSavePhone = async () => {
    if (!userProfile) return;
    setIsSavingPhone(true);
    try {
      await updateProfile.mutateAsync({ id: userProfile.id, data: { phone } });
      toast({
        title: "Phone Updated!",
        description: "Your phone number has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPhone(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      {!showEditProfile ? (
        <>
          {/* User Profile Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-lg font-semibold text-gray-900">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-lg font-semibold text-gray-900">{user?.email || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
                  <p className="text-lg font-semibold text-gray-900">{userProfile?.phone || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Instagram</Label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    {userProfile?.hobbiesAndPassions ? (
                      <>
                        <Instagram className="w-4 h-4 mr-2" />
                        {userProfile.hobbiesAndPassions}
                      </>
                    ) : (
                      "Not set"
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setShowEditProfile(true)}
              >
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Manage Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base font-medium">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive urgent updates via SMS
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => updateNotificationSetting('sms', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Marketing className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="marketing-notifications" className="text-base font-medium">
                      Marketing Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional offers and marketing content
                    </p>
                  </div>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Private Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" disabled={isSavingPhone} />
                      <Button onClick={handleSavePhone} disabled={isSavingPhone} variant="outline">
                        {isSavingPhone ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  {!isChangingPassword && (
                    <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  )}
                </div>

                {isChangingPassword && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" value={passwords.current} onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" value={passwords.new} onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" value={passwords.confirm} onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={changePassword}>Save Password</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswords({ current: "", new: "", confirm: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <Label className="text-base font-medium text-destructive">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={deleteAccount}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base font-medium">Log Out</Label>
                    <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="my-6">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => setShowEditProfile(false)}>
            ← Back to Settings
          </Button>
          <EditProfile />
        </div>
      )}
    </div>
  );
}
