import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  LogOut, 
  Camera,
  Phone,
  ArrowLeft,
  CheckCircle,
  Clock,
  Award,
  MessageSquare,
  AlertTriangle,
  Upload,
  Settings,
  History
} from 'lucide-react';
import { AnalyticsService, type UserProfile } from '@/lib/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const { currentUser, userProfile, logout, updateUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userStats, setUserStats] = useState<{
    totalReports: number;
    totalComments: number;
    totalUpvotes: number;
    reputation: number;
    recentActivity?: Array<{
      type: string;
      description: string;
      createdAt: Date;
    }>;
  } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editData, setEditData] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    phoneNumber: userProfile?.phoneNumber || ''
  });

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (currentUser && userProfile) {
        try {
          const stats = await AnalyticsService.getUserStats(currentUser.uid);
          setUserStats(stats);
          console.log('User stats loaded:', stats); // For debugging recentActivity
        } catch (error) {
          console.error('Failed to load user stats:', error);
        }
      }
    };

    loadUserStats();
  }, [currentUser, userProfile]);
  
  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentUser) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size should be less than 5MB');
      return;
    }
    
    try {
      setUploadingPhoto(true);
      setMessage('');
      
      // Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const photoURL = await getDownloadURL(storageRef);
      
      // Update user profile
      await updateUserProfile({ photoURL });
      
      // Update local state to show the new photo immediately
      // Note: We don't modify currentUser directly since it may be read-only
      // The UI will update when the profile is refetched
      
      setMessage('Profile photo updated successfully!');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setMessage(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
      location: userProfile?.location || '',
      phoneNumber: userProfile?.phoneNumber || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');
      await updateUserProfile(editData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | any) => {
    // Handle Firestore Timestamp
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  // Show loading while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show access denied only if not authenticated (not loading)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Please log in to view your profile</p>
          <Link to="/login">
            <Button className="bg-primary text-primary-foreground">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while user profile is being created/loaded
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-6">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Setting up your profile...</p>
          
          {/* Manual bypass button after 3 seconds */}
          <div className="mt-6">
            <Button 
              onClick={() => {
                console.log('Manual profile bypass triggered');
                const basicProfile: UserProfile = {
                  uid: currentUser.uid,
                  email: currentUser.email || '',
                  displayName: currentUser.displayName || 'User',
                  photoURL: currentUser.photoURL || undefined,
                  phoneNumber: currentUser.phoneNumber || undefined,
                  bio: '',
                  location: '',
                  joinedAt: new Date(),
                  lastLoginAt: new Date(),
                  reputation: 0,
                  badgesEarned: [],
                  totalReports: 0,
                  totalComments: 0
                };
                window.localStorage.setItem('tempProfile', JSON.stringify(basicProfile));
                window.location.reload();
              }}
              variant="outline"
              className="text-xs"
            >
              Continue anyway (Skip Profile Setup)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SAARTHI
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Success Message */}
        {message && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">{message}</AlertDescription>
          </Alert>
        )}

        {/* Profile Header Card */}
        <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                  <AvatarImage src={currentUser.photoURL || ''} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xl font-semibold">
                    {getInitials(userProfile.displayName)}
                  </AvatarFallback>
                </Avatar>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-card border-2 border-card shadow-md"
                  onClick={triggerFileInput}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {userProfile.displayName}
                  </h1>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="flex items-center text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {formatDate(userProfile.joinedAt)}</span>
                  </div>
                </div>

                {userProfile.bio && (
                  <p className="text-muted-foreground max-w-md">{userProfile.bio}</p>
                )}
                
                {userProfile.location && (
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{userProfile.location}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="border-primary text-primary hover:bg-accent"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={editData.displayName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={editData.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Full Name</Label>
                        <p className="font-medium">{userProfile.displayName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                    </div>

                    {userProfile.phoneNumber && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Phone Number</Label>
                        <p className="font-medium">{userProfile.phoneNumber}</p>
                      </div>
                    )}

                    {userProfile.bio && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Bio</Label>
                        <p className="font-medium">{userProfile.bio}</p>
                      </div>
                    )}

                    {userProfile.location && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Location</Label>
                        <p className="font-medium">{userProfile.location}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Statistics */}
            <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Statistics & Reputation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reputation Score */}
                <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {userProfile.reputation || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Reputation Points</div>
                </div>
                
                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-center mb-1">
                      <AlertTriangle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {userStats?.totalReports || userProfile.totalReports || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Reports</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-center mb-1">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {userStats?.totalComments || userProfile.totalComments || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>
                
                {userStats && (
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="text-lg font-semibold text-foreground">
                      {userStats.totalUpvotes || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Upvotes Received</div>
                  </div>
                )}
                
                {/* Badges */}
                {userProfile.badgesEarned && userProfile.badgesEarned.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Badges Earned</Label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.badgesEarned.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-foreground">Email Verified</span>
                  </div>
                  <span className="text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-foreground">Profile Complete</span>
                  </div>
                  <span className="text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
                    {userProfile.displayName && userProfile.bio ? '100%' : '75%'}
                  </span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm font-medium">
                      {formatDate(userProfile.joinedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="text-sm font-medium">
                      {formatDate(userProfile.lastLoginAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userStats?.recentActivity && userStats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {userStats.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'report_created' && <AlertTriangle className="w-4 h-4 text-primary" />}
                          {activity.type === 'comment_added' && <MessageSquare className="w-4 h-4 text-primary" />}
                          {activity.type === 'post_created' && <Edit3 className="w-4 h-4 text-primary" />}
                          {activity.type === 'badge_earned' && <Award className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-border shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Activity History
                </Button>
                <Separator />
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;