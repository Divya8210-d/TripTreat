import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarIcon,
  Clock,
  User,
  MapPin,
  ArrowLeft,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
           *,
           listing:listings(
             id,
             title,
             description,
             location,
             price_per_night,
             max_guests
           )
         `
        )
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error fetching bookings:', error);
      }
      toast.error('Failed to load your bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        )
      );

      toast.success('Booking cancelled successfully');
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error cancelling booking:', error);
      }
      toast.error('Failed to cancel booking');
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string) => {
    let className, icon;

    switch (status) {
      case 'confirmed':
        className = 'bg-green-500 hover:bg-green-500/90';
        icon = <Check className="h-3 w-3 mr-1" />;
        break;
      case 'pending':
        className = 'bg-yellow-500 hover:bg-yellow-500/90';
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'cancelled':
        className = 'bg-red-500 hover:bg-red-500/90';
        icon = <X className="h-3 w-3 mr-1" />;
        break;
      case 'completed':
        className = 'bg-blue-500 hover:bg-blue-500/90';
        icon = <Check className="h-3 w-3 mr-1" />;
        break;
      default:
        className = 'bg-secondary';
        icon = null;
    }

    return (
      <Badge className={`${className} flex items-center`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="container mx-auto py-10 px-4 flex-grow">
          <Button
            variant="ghost"
            className="mb-6 pl-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">
                You don't have any bookings yet.
              </p>
              <Button onClick={() => navigate('/homestays')}>
                Browse Homestays
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <img
                      src="/file-uploads/h1.jpg"
                      alt={booking.listing?.title}
                      className="w-full h-full object-cover"
                    />
                    {getStatusBadge(booking.status)}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      <Link
                        to={`/homestays/${booking.listing?.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {booking.listing?.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.listing?.location}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Check-in
                        </p>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            {format(new Date(booking.check_in_date), 'PP')}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Check-out
                        </p>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            {format(new Date(booking.check_out_date), 'PP')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        <p className="text-sm">
                          {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Price
                        </p>
                        <p className="text-md font-semibold">
                          ₹{booking.price_total}
                          <span className="text-xs text-muted-foreground ml-1">
                            (
                            {calculateNights(
                              booking.check_in_date,
                              booking.check_out_date
                            )}{' '}
                            nights)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                          <Button variant="outline" size="sm">
                            Contact Host
                          </Button>
                        </div>
                      )}

                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default BookingsPage;
