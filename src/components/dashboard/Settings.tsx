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
  Activity,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EditProfile } from "./EditProfile";
import { useProfile } from "@/hooks/api/useProfile";
import { notificationService } from "@/lib/notificationService";
import { Icons } from "@/components/icons";
import { getSocialMediaUrls } from "@/utils/social-media";

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
  },
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
  const [phone, setPhone] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const { useProfileByUserId, updateProfile } = useProfile();

  // Fetch user profile using the hook
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useProfileByUserId(user?.id || "");

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "edit-profile", label: "Edit Profile", icon: Edit },
    // { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "privacy", label: "Privacy", icon: Shield },
    // { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    // { id: "advanced", label: "Advanced", icon: Zap },
  ];

  // Update phone state when profile data is loaded
  useEffect(() => {
    if (userProfile?.phone) {
      setPhone(userProfile.phone);
    }
  }, [userProfile?.phone]);

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    if (user?.profileId) {
      notificationService.notifySettingsChanged(user.profileId, `Notification: ${key}`);
    }
  };

  const updatePrivacySetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const updatePreference = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const updateSecuritySetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: value },
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



  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "edit-profile") {
                    setActiveTab("edit-profile");
                    setShowEditProfile(true);
                  } else {
                    setActiveTab(tab.id);
                    setShowEditProfile(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  (tab.id === "edit-profile" && showEditProfile) || (tab.id !== "edit-profile" && activeTab === tab.id)
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
          {showEditProfile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* <h2 className="text-lg font-semibold">Edit Profile</h2> */}
                {/* <Button variant="outline" size="sm" onClick={() => setShowEditProfile(false)}>
                  ← Back to Settings
                </Button> */}
              </div>
              <EditProfile />
            </div>
          ) : (
            <>
              {activeTab === "account" && (
                <>
                  {/* Profile Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Profile Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isProfileLoading ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                            <div className="h-3 bg-muted rounded w-48 animate-pulse" />
                          </div>
                        </div>
                      ) : profileError ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium text-red-600">Error loading profile</p>
                            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative w-full aspect-[4/1] bg-gray-100 rounded-lg overflow-hidden">
                            <img src={`${userProfile?.bannerImage?.url}`} alt="Banner" className="w-full h-full object-cover" />
                                    </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                              {userProfile?.coverImage ? (
                                <img src={`${userProfile.coverImage.url}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{userProfile?.user?.name || user?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            {userProfile?.user?.username && <p className="text-xs text-muted-foreground">@{userProfile.user.username}</p>}
                          </div>
                          <div className="ml-auto">
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </div>
                        </>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setShowEditProfile(true)} disabled={isProfileLoading}>
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Profile Photos Gallery */}
                  {userProfile?.profilePhotos && userProfile.profilePhotos.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Profile Photos ({userProfile.profilePhotos.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                          {userProfile.profilePhotos.slice(0, 6).map((photo, index) => (
                            <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img src={`${photo.url}?t=${Date.now()}`} alt={`Profile ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {userProfile.profilePhotos.length > 6 && (
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">+{userProfile.profilePhotos.length - 6} more</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isProfileLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                            <div className="h-10 bg-muted rounded animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                            <div className="h-10 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email" className="text-sm">
                              Email
                            </Label>
                            <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm">
                              Phone
                            </Label>
                            <Input id="phone" value={phone} disabled className="bg-muted" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Profile Details */}
                  {!isProfileLoading && userProfile && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Profile Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userProfile.bio && (
                            <div className="md:col-span-2">
                              <Label className="text-sm">Bio</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.bio}</p>
                            </div>
                          )}
                          {userProfile.city && (
                            <div>
                              <Label className="text-sm">City</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.city}</p>
                            </div>
                          )}
                          {userProfile.country && (
                            <div>
                              <Label className="text-sm">Country</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.country}</p>
                            </div>
                          )}
                          {userProfile.gender && (
                            <div>
                              <Label className="text-sm">Gender</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.gender}</p>
                            </div>
                          )}
                          {userProfile.dateOfBirth && (
                            <div>
                              <Label className="text-sm">Date of Birth</Label>
                              <p className="text-sm text-muted-foreground mt-1">{new Date(userProfile.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {userProfile.hobbiesAndPassions && (
                          <div>
                            <Label className="text-sm">Hobbies & Passions</Label>
                            <p className="text-sm text-muted-foreground mt-1">{userProfile.hobbiesAndPassions}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Social Media Links */}
                  {!isProfileLoading &&
                    userProfile &&
                    (() => {
                      const socialUrls = getSocialMediaUrls(userProfile);
                      const hasSocialMedia = Object.values(socialUrls).some((url) => url);

                      return hasSocialMedia ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Social Media</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {socialUrls.instagram && (
                                <div className="flex items-center space-x-2">
                                  <Icons.instagram className="h-4 w-4 fill-pink-500" />
                                  <span className="text-sm">Instagram</span>
                                  <a href={socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Profile
                                  </a>
                                </div>
                              )}
                              {socialUrls.tiktok && (
                                <div className="flex items-center space-x-2">
                                  <Icons.tiktok className="h-4 w-4" />
                                  <span className="text-sm">TikTok</span>
                                  <a href={socialUrls.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Profile
                                  </a>
                                </div>
                              )}
                              {socialUrls.youtube && (
                                <div className="flex items-center space-x-2">
                                  <Icons.youtube className="h-4 w-4" />
                                  <span className="text-sm">YouTube</span>
                                  <a href={socialUrls.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Channel
                                  </a>
                                </div>
                              )}
                              {socialUrls.facebook && (
                                <div className="flex items-center space-x-2">
                                  <Icons.facebook className="h-4 w-4 fill-blue-500" />
                                  <span className="text-sm">Facebook</span>
                                  <a href={socialUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Profile
                                  </a>
                                </div>
                              )}
                              {socialUrls.twitter && (
                                <div className="flex items-center space-x-2">
                                  <Icons.x className="h-4 w-4" />
                                  <span className="text-sm">Twitter</span>
                                  <a href={socialUrls.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Profile
                                  </a>
                                </div>
                              )}
                              {socialUrls.linkedin && (
                                <div className="flex items-center space-x-2">
                                  <Globe className="h-4 w-4 text-blue-700" />
                                  <span className="text-sm">LinkedIn</span>
                                  <a href={socialUrls.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    View Profile
                                  </a>
                                </div>
                              )}
                              {socialUrls.website && (
                                <div className="flex items-center space-x-2">
                                  <Globe className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Website</span>
                                  <a href={socialUrls.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    Visit Site
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })()}

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
                          <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                            <Lock className="h-4 w-4 mr-2" />
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="current" className="text-sm">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="current"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
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
                            <Label htmlFor="new" className="text-sm">
                              New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="new"
                                type={showNewPassword ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                              />
                              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="confirm" className="text-sm">
                              Confirm Password
                            </Label>
                            <Input id="confirm" type="password" value={passwords.confirm} onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))} />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={changePassword} size="sm">
                              Update Password
                            </Button>
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

              {/* {activeTab === "notifications" && (
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
                      ].map((item) => (
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
                      ].map((item) => (
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
              )} */}

              {activeTab === "privacy" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Profile Visibility</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm">Who can see your profile?</Label>
                        <Select value={settings.privacy.profileVisibility} onValueChange={(value) => updatePrivacySetting("profileVisibility", value)}>
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
                      ].map((item) => (
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
                        <Select value={settings.preferences.theme} onValueChange={(value) => updatePreference("theme", value)}>
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
                          <Select value={settings.preferences.language} onValueChange={(value) => updatePreference("language", value)}>
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
                          <Select value={settings.preferences.timezone} onValueChange={(value) => updatePreference("timezone", value)}>
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
                      ].map((item) => (
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
                  {/* <Card>
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
              </Card> */}

                  {/* <Card>
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
              </Card> */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
