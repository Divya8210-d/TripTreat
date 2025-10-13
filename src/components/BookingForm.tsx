import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import LoginPromptModal from '@/components/LoginPromptModal';
import { supabase } from '@/integrations/supabase/client';

const BookingForm: React.FC<BookingFormProps> = ({
  listingId,
  pricePerNight,
  maxGuests,
}) => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const defaultValues = {
      checkInDate: undefined,
      checkOutDate: undefined,
      guests: 1,
  } satisfies Readonly<BookingForm>

  const form = useForm({
    defaultValues
  });

  const watchCheckIn = form.watch('checkInDate');
  const watchCheckOut = form.watch('checkOutDate');
  // const watchGuests = form.watch('guests'); // Removed unused variable

  // Calculate number of nights and total price
  const calculateNights = () => {
    if (!watchCheckIn || !watchCheckOut) {
      return 0;
    }
  
    const checkIn = new Date(watchCheckIn);
    const checkOut = new Date(watchCheckOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const numberOfNights = calculateNights();
  const totalPrice = numberOfNights * pricePerNight;

  // Create an array with numbers from 1 to maxGuests
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  const handleBooking = async (data: BookingForm) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Calculate total price
      const priceTotal = numberOfNights * pricePerNight;

      // Insert booking into database
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            listing_id: listingId,
            check_in_date: data.checkInDate,
            check_out_date: data.checkOutDate,
            guests: data.guests,
            price_total: priceTotal,
            status: 'pending',
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success('Booking request submitted successfully!', {
        description:
          'Your booking request has been received and is pending confirmation.',
      });

      // Redirect to booking confirmation page or user bookings
      navigate('/bookings');
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error creating booking:', error);
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create booking';
      const errorCode = (error as unknown)?.code;

      if (errorCode === '23514') {
        toast.error('Booking dates conflict with an existing reservation');
      } else if (errorCode === '23503') {
        toast.error('Unable to create booking. Please try again later.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border border-border">
        <h3 className="text-xl font-semibold mb-4">
          <span className="text-2xl text-primary">₹{pricePerNight}</span> /
          night
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBooking)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Check-in date */}
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-out date */}
              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date <= new Date() ||
                            (watchCheckIn
                              ? date <= new Date(watchCheckIn)
                              : false)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guests */}
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Guests
                  </FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {guestOptions.map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price summary */}
            {watchCheckIn && watchCheckOut && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>
                    ₹{pricePerNight} x {numberOfNights} nights
                  </span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-4 mt-2">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!watchCheckIn || !watchCheckOut || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Request to Book'}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-2">
              You won't be charged yet
            </p>
          </form>
        </Form>
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default BookingForm;
