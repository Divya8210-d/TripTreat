import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  FacebookIcon,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const ContactPage = () => {
  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  } satisfies Readonly<ContactForm>;

  const form = useForm({ defaultValues });

  const onSubmit = () => {
    // TODO: Implement actual form submission logic
    toast.success('Your message has been sent!', {
      description: 'We will get back to you within 24 hours.',
    });
    form.reset();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[300px] mb-12">
        <img
          src="/file-uploads/cont.jpg"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Have questions or need assistance? Our team is here to help you plan
            your perfect Manipur journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below, and our team will get back to you as soon
              as possible.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="booking">
                            Booking Inquiry
                          </SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="support">
                            Customer Support
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How can we help you?"
                          className="min-h-[150px]"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <p className="text-muted-foreground mb-8">
              Whether you prefer to visit us in person, call us, or send an
              email, we're available to assist you.
            </p>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Our Office</h3>
                      <p className="text-muted-foreground">
                        123 Kangla Road, Thangal Bazar
                        <br />
                        Imphal, Manipur 795001
                        <br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Phone & WhatsApp
                      </h3>
                      <p className="text-muted-foreground">
                        Customer Service: +91 9876 543 210
                        <br />
                        Booking Support: +91 9876 543 211
                        <br />
                        Host Relations: +91 9876 543 212
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        General Inquiries: info@tripntreat.com
                        <br />
                        Bookings: bookings@tripntreat.com
                        <br />
                        Partnerships: partners@tripntreat.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Business Hours
                      </h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 5:00 PM
                        <br />
                        Sunday: Closed (Online support available)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toast.info('Opens Facebook page')}
                >
                  <FacebookIcon size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toast.info('Opens Instagram page')}
                >
                  <Instagram size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toast.info('Opens Twitter page')}
                >
                  <Twitter size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => toast.info('Opens YouTube channel')}
                >
                  <Youtube size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="rounded-lg overflow-hidden border h-[400px] bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <MapPin
                size={48}
                className="mx-auto mb-2 text-muted-foreground"
              />
              <p className="text-muted-foreground">
                Interactive map would be displayed here
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  toast.info('This would open directions to our office')
                }
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
