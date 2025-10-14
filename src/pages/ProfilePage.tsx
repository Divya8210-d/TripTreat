import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, User, Upload, Edit3, Save, X, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PlannedTours from '@/components/PlannedTours';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserIcon, PlaneTakeoff, SettingsIcon } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Mirror global profile into a local copy for instant UI updates
  useEffect(() => {
    setLocalProfile(profile ?? null);
  }, [profile]);

  // Cleanup temp URL when component unmounts or temp URL changes
  useEffect(() => {
    return () => {
      if (tempAvatarUrl) {
        URL.revokeObjectURL(tempAvatarUrl);
      }
    };
  }, [tempAvatarUrl]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user's bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(
          `
           *,
           listing:listings(
             title,
             description,
             location,
             price_per_night
           )
         `
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (bookingError) throw bookingError;

      setBookings(bookingData.map(booking => ({
        ...booking,
        status: booking.status as BookingStatus,
      })) || []);

      // Fetch host applications
      const { data: hostData, error: hostError } = await supabase
        .from('host_applications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (hostError) throw hostError;
      setHostApplications(hostData.map(host => ({
        ...host,
        host_type: host.host_type as HostType,
        status: host.status as HostApplicationStatus,
      })) || []);
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error fetching user data:', error);
      }
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setEditForm({
      first_name: localProfile?.first_name || '',
      last_name: localProfile?.last_name || '',
      phone: localProfile?.phone || ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({
      first_name: '',
      last_name: '',
      phone: ''
    });
    setTempAvatarUrl(null);
    setSelectedFile(null);
    setShowAvatarOptions(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      let avatarUrl = localProfile?.avatar_url;

      // Handle avatar changes
      if (selectedFile) {
        // Upload new avatar
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('user-images')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-images')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      } else if (tempAvatarUrl === null && selectedFile === null && localProfile?.avatar_url) {
        // Avatar is being removed (user clicked remove but no new file selected)
        avatarUrl = undefined;
      }

      // Update profile with all data including new avatar URL
      const updateData: any = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone: editForm.phone,
        updated_at: new Date().toISOString()
      };

      // Only update avatar_url if it's not undefined
      if (avatarUrl !== undefined) {
        updateData.avatar_url = avatarUrl;
      } else {
        updateData.avatar_url = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditMode(false);
      setTempAvatarUrl(null);
      setSelectedFile(null);
      setShowAvatarOptions(false);
      
      // Refresh relevant data without a full page reload
      await fetchUserData();

      // Optimistically update local profile for immediate UI reflection
      setLocalProfile(prev => {
        const previous = prev ?? ({} as Profile);
        return {
          ...previous,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          avatar_url: avatarUrl !== undefined ? (avatarUrl ?? null) : null,
          updated_at: new Date().toISOString(),
        } as Profile;
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditMode) {
      setShowAvatarOptions(!showAvatarOptions);
    }
  };

  const handleRemoveAvatar = () => {
    setTempAvatarUrl(null);
    setSelectedFile(null);
    setShowAvatarOptions(false);
    toast.success('Profile picture will be removed when you save changes');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setTempAvatarUrl(tempUrl);
    setSelectedFile(file);
    setShowAvatarOptions(false);
    toast.success('Image selected. Please click "Save Changes".');
  };


  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 hover:bg-green-500/90';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-500/90';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-500/90';
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-500/90';
      case 'rejected':
        return 'bg-destructive';
      case 'approved':
        return 'bg-green-500';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="container mx-auto py-10 px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={tempAvatarUrl || localProfile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditMode && (
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
                          onClick={handleAvatarClick}
                        >
                          <Pencil className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {tempAvatarUrl && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </div>
                      )}
                      {showAvatarOptions && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="justify-start"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload New
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveAvatar}
                              className="justify-start text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <h2 className="mt-4 text-xl font-bold">
                      {localProfile?.first_name} {localProfile?.last_name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>

                    <div className="mt-6 w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setActiveTab('profile')}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start mt-2"
                        onClick={() => setActiveTab('bookings')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>My Bookings</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start mt-2"
                        onClick={() => setActiveTab('plans')}
                      >
                        <PlaneTakeoff className="mr-2 h-4 w-4" />
                        <span>My Planned Tours</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start mt-2"
                        onClick={() => setActiveTab('settings')}
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings tab */}
            <div className="w-full md:w-3/4">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your personal information and account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          First Name
                        </h3>
                        {isEditMode ? (
                          <Input
                            value={editForm.first_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                            placeholder="Enter first name"
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground">
                            {localProfile?.first_name || 'Not set'}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Last Name
                        </h3>
                        {isEditMode ? (
                          <Input
                            value={editForm.last_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                            placeholder="Enter last name"
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground">
                            {localProfile?.last_name || 'Not set'}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </h3>
                        <p className="text-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </h3>
                        {isEditMode ? (
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground">
                            {localProfile?.phone || 'Not set'}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Account Type
                        </h3>
                        <p className="text-foreground">
                          <Badge variant="outline" className="capitalize">
                            {localProfile?.role || 'User'}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Member Since
                        </h3>
                        <p className="text-foreground">
                          {localProfile?.created_at
                            ? format(new Date(localProfile.created_at), 'PPP')
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Profile Settings</h3>
                      <div className="flex gap-2">
                        {!isEditMode ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditProfile}
                          >
                            <Edit3 className="h-4 w-4 mr-2" /> Update Profile
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                            >
                              <Save className="h-4 w-4 mr-2" /> 
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'bookings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>
                      View and manage your booking history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground mb-4">
                          You don't have any bookings yet.
                        </p>
                        <Button onClick={() => navigate('/homestays')}>
                          Browse Homestays
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map(booking => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex flex-col md:flex-row justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {booking.listing?.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {booking.listing?.location}
                                </p>
                              </div>
                              <Badge
                                className={getStatusBadgeColor(booking.status)}
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Check-in
                                  </p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(booking.check_in_date),
                                      'PP'
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Check-out
                                  </p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(booking.check_out_date),
                                      'PP'
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Guests
                                  </p>
                                  <p className="font-medium">
                                    {booking.guests}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Total Price
                                </p>
                                <p className="font-semibold text-lg">
                                  ₹{booking.price_total}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 border-red-500"
                                  >
                                    Cancel
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/homestays/${booking.listing?.id}`
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'plans' && <PlannedTours />}

              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </h3>
                        <p className="text-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </h3>
                        <p className="text-foreground">
                          {localProfile?.phone || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Account Type
                        </h3>
                        <p className="text-foreground">
                          <Badge variant="outline" className="capitalize">
                            {localProfile?.role || 'User'}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Member Since
                        </h3>
                        <p className="text-foreground">
                          {localProfile?.created_at
                            ? format(new Date(localProfile.created_at), 'PPP')
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Profile Settings</h3>
                      <div className="flex gap-2">
                        {!isEditMode ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditProfile}
                          >
                            <Edit3 className="h-4 w-4 mr-2" /> Update Profile
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                            >
                              <Save className="h-4 w-4 mr-2" /> 
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div
            className="h-12 w-12 rounded-full border-4 border-green-500/80 border-t-transparent animate-spin"
            role="status"
            aria-label="Saving changes"
          ></div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default ProfilePage;
