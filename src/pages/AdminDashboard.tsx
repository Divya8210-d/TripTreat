import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CheckCircle,
  XCircle,
  Search,
  CalendarIcon,
  User,
  Home,
  DollarSign,
  BarChart2,
  Users,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeHosts: 0,
    pendingApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch host applications with profile data
      const { data: applicationData, error: appError } = await supabase
        .from('host_applications')
        .select(
          `
           *,
           profile:profiles(
             first_name,
             last_name,
             email,
             avatar_url
           )
         `
        )
        .order('created_at', { ascending: false });

      if (appError) throw appError;
      setApplications(applicationData || []);

      // Fetch bookings with user and listing data
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(
          `
           *,
           user:profiles(first_name, last_name, email),
           listing:listings(title, location, price_per_night)
         `
        )
        .order('created_at', { ascending: false });

      if (bookingError) throw bookingError;
      setBookings(bookingData || []);

      // Calculate statistics
      const pendingApps = (applicationData || []).filter(
        a => a.status === 'pending'
      ).length;
      const activeHosts = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'host');

      const totalRevenue = (bookingData || []).reduce((acc, booking) => {
        return acc + (booking.status !== 'cancelled' ? booking.price_total : 0);
      }, 0);

      setStats({
        totalBookings: (bookingData || []).length,
        totalRevenue,
        activeHosts: activeHosts.count || 0,
        pendingApplications: pendingApps,
      });
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error fetching admin data:', error);
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: string,
    adminNotes?: string
  ) => {
    try {
      // Update application status
      const { error } = await supabase
        .from('host_applications')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      if (status === 'approved') {
        // Get user ID from the application
        const { data: appData, error: fetchError } = await supabase
          .from('host_applications')
          .select('user_id')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        // Update user role to 'host'
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'host' })
          .eq('id', appData.user_id);

        if (updateError) throw updateError;
      }

      toast.success(
        `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`
      );

      // Refresh data
      await fetchDashboardData();
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error updating application status:', error);
      }
      toast.error(error.message || 'Failed to update application status');
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Booking ${status} successfully`);

      // Refresh data
      await fetchDashboardData();
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error updating booking status:', error);
      }
      toast.error(error.message || 'Failed to update booking status');
    }
  };

  // Filter applications based on search query and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.profile?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.profile?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.property_address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.user?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.user?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.listing?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.listing?.location
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="container mx-auto py-10 px-4 flex-grow">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                  <p className="text-muted-foreground">Total Bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="bg-green-500/10 p-3 rounded-full mb-3">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">₹{stats.totalRevenue}</h3>
                  <p className="text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="bg-blue-500/10 p-3 rounded-full mb-3">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.activeHosts}</h3>
                  <p className="text-muted-foreground">Active Hosts</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="bg-yellow-500/10 p-3 rounded-full mb-3">
                    <Home className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {stats.pendingApplications}
                  </h3>
                  <p className="text-muted-foreground">Pending Applications</p>
                </CardContent>
              </Card>
            </div>

            <Tabs
              defaultValue="applications"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger value="applications">
                    Host Applications
                  </TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>

                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-9 w-full min-w-[200px]"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <select
                      className="h-10 rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Applications Tab */}
              <TabsContent value="applications">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      No host applications found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map(application => (
                      <Card key={application.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={application.profile?.avatar_url}
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {application.profile?.first_name?.[0]}
                                  {application.profile?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {application.profile?.first_name}{' '}
                                  {application.profile?.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {application.profile?.email}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={getStatusBadgeColor(
                                application.status
                              )}
                            >
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Host Type
                              </p>
                              <p className="font-medium capitalize">
                                {application.host_type}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Application Date
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(application.created_at),
                                  'PPP'
                                )}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-muted-foreground">
                                Property Address
                              </p>
                              <p className="font-medium">
                                {application.property_address}
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-1">
                              Description
                            </p>
                            <p>{application.description}</p>
                          </div>

                          {Array.isArray(application.image_urls) && application.image_urls.length > 0 && (
                            <div className="flex justify-end mb-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setActiveImages(application.image_urls);
                                  setActiveIndex(0);
                                  setIsImagesOpen(true);
                                }}
                                className="flex items-center gap-2"
                              >
                                <ImageIcon className="h-4 w-4" />
                                View Images
                              </Button>
                            </div>
                          )}

                          {application.status === 'pending' && (
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                              <Button
                                variant="outline"
                                className="flex items-center gap-2 text-destructive"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.id,
                                    'rejected',
                                    'Application does not meet our requirements'
                                  )
                                }
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.id,
                                    'approved'
                                  )
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No bookings found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map(booking => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {booking.listing?.title}
                              </h3>
                              <p className="text-muted-foreground">
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

                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {booking.user?.first_name?.[0]}
                                {booking.user?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {booking.user?.first_name}{' '}
                                {booking.user?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.user?.email}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Check-in
                              </p>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">
                                  {format(
                                    new Date(booking.check_in_date),
                                    'PP'
                                  )}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Check-out
                              </p>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">
                                  {format(
                                    new Date(booking.check_out_date),
                                    'PP'
                                  )}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Guests
                              </p>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">{booking.guests}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Total Price
                              </p>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">
                                  ₹{booking.price_total}
                                </p>
                              </div>
                            </div>
                          </div>

                          {booking.status === 'pending' && (
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                              <Button
                                variant="outline"
                                className="flex items-center gap-2 text-destructive"
                                onClick={() =>
                                  updateBookingStatus(booking.id, 'cancelled')
                                }
                              >
                                <XCircle className="h-4 w-4" />
                                Cancel
                              </Button>
                              <Button
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                                onClick={() =>
                                  updateBookingStatus(booking.id, 'confirmed')
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                                Confirm
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <Dialog open={isImagesOpen} onOpenChange={setIsImagesOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Host Application Images</DialogTitle>
                </DialogHeader>
                {activeImages.length > 0 && (
                  <div className="relative">
                    <img
                      src={activeImages[activeIndex]}
                      alt={`Image ${activeIndex + 1}`}
                      className="w-full h-[420px] object-contain bg-black/5 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 border rounded-full p-2"
                      onClick={() =>
                        setActiveIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length)
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 border rounded-full p-2"
                      onClick={() =>
                        setActiveIndex((prev) => (prev + 1) % activeImages.length)
                      }
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="mt-3 text-center text-sm text-muted-foreground">
                      {activeIndex + 1} / {activeImages.length}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
