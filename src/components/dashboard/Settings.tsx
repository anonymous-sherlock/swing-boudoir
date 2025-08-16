import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Lock, 
  User, 
  Trash2, 
  LogOut, 
  Shield, 
  Instagram,
  Eye,
  EyeOff,
  Globe,
  Download,
  Upload,
  Settings as SettingsIcon,
  Monitor,
  Moon,
  Sun,
  Palette,
  Languages,
  HelpCircle,
  MessageSquare,
  Star,
  Clock,
  MapPin,
  Calendar,
  Zap,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EditProfile } from "./EditProfile";
import { useProfile } from "@/hooks/api/useProfile";
import { notificationService } from "@/lib/notificationService";

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

const mockSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
    competitions: true,
    results: true,
    reminders: true,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    allowFollows: true,
  },
  preferences: {
    theme: "system",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    autoSave: true,
    soundEffects: true,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  }
};

export function Settings() {
  const { user, handleLogout } = useAuth();
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState("account");
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const { updateProfile } = useProfile();

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    { id: "advanced", label: "Advanced", icon: Zap },
  ];

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
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    if (user?.id && user?.profileId) {
      notificationService.notifySettingsChanged(user.id, user.profileId, `Notification: ${key}`);
    }
  };

  const updatePrivacySetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const updatePreference = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const updateSecuritySetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
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
    console.log("Changing password");
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setIsChangingPassword(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be emailed to you within 24 hours.",
    });
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
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
        title: "Phone Updated",
        description: "Your phone number has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPhone(false);
    }
  };

  if (showEditProfile) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
        <Button variant="outline" size="sm" onClick={() => setShowEditProfile(false)}>
          ← Back to Settings
        </Button>
        <EditProfile />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-4">
          {activeTab === "account" && (
            <>
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          disabled={isSavingPhone}
                        />
                        <Button 
                          onClick={handleSavePhone} 
                          disabled={isSavingPhone}
                          variant="outline" 
                          size="sm"
                        >
                          {isSavingPhone ? "..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Password</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isChangingPassword ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Last changed 30 days ago</p>
                        <p className="text-xs text-muted-foreground">Keep your account secure</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="current" className="text-sm">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="current"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new" className="text-sm">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="new"
                            type={showNewPassword ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm" className="text-sm">Confirm Password</Label>
                        <Input 
                          id="confirm"
                          type="password"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={changePassword} size="sm">Update Password</Button>
                        <Button 
                          variant="outline" 
                          size="sm"
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
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "email", label: "Email Updates", desc: "General account updates" },
                    { key: "competitions", label: "Competition Updates", desc: "New competitions and results" },
                    { key: "results", label: "Result Notifications", desc: "When competition results are announced" },
                    { key: "reminders", label: "Deadline Reminders", desc: "Reminders before deadlines" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                        onCheckedChange={(checked) => updateNotificationSetting(item.key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Push Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "push", label: "Browser Notifications", desc: "Instant notifications in browser" },
                    { key: "sms", label: "SMS Notifications", desc: "Text messages for urgent updates" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                        onCheckedChange={(checked) => updateNotificationSetting(item.key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Who can see your profile?</Label>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => updatePrivacySetting("profileVisibility", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Everyone</SelectItem>
                        <SelectItem value="registered">Registered Users Only</SelectItem>
                        <SelectItem value="private">Only Me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {[
                    { key: "showEmail", label: "Show Email", desc: "Display email on profile" },
                    { key: "showPhone", label: "Show Phone", desc: "Display phone number on profile" },
                    { key: "showLocation", label: "Show Location", desc: "Display location information" },
                    { key: "allowMessages", label: "Allow Messages", desc: "Let others send you messages" },
                    { key: "allowFollows", label: "Allow Follows", desc: "Let others follow your activity" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                        onCheckedChange={(checked) => updatePrivacySetting(item.key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Theme</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => updatePreference("theme", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Localization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => updatePreference("language", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Timezone</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => updatePreference("timezone", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">General Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "autoSave", label: "Auto-save", desc: "Automatically save your work" },
                    { key: "soundEffects", label: "Sound Effects", desc: "Play sounds for interactions" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings.preferences[item.key as keyof typeof settings.preferences] as boolean}
                        onCheckedChange={(checked) => updatePreference(item.key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "security" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enable 2FA</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {settings.security.twoFactor && <Badge variant="secondary">Enabled</Badge>}
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => updateSecuritySetting("twoFactor", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Login Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Login Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                    </div>
                    <Switch
                      checked={settings.security.loginAlerts}
                      onCheckedChange={(checked) => updateSecuritySetting("loginAlerts", checked)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => updateSecuritySetting("sessionTimeout", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "advanced" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Export Account Data</p>
                      <p className="text-xs text-muted-foreground">Download all your data</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-lg font-semibold">142</p>
                      <p className="text-xs text-muted-foreground">Days Active</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-lg font-semibold">23</p>
                      <p className="text-xs text-muted-foreground">Competitions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-destructive">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently delete your account</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={deleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs text-muted-foreground">Sign out from this device</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}