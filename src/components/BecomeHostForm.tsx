import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPromptModal from './LoginPromptModal';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

const BecomeHostForm = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    hostType: 'homestay',
    description: '',
  } satisfies Readonly<HostApplicationForm>;
  
  const form = useForm({ defaultValues });

  const onSubmit = async (data: HostApplicationForm) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsSubmitting(true);

      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const results = await Promise.all(
          selectedFiles.map(async (file, index) => {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Date.now()}_${index}.${fileExt}`;
            const { data: storageData, error: storageError } = await supabase
              .storage
              .from('host_images')
              .upload(filePath, file, { upsert: false, cacheControl: '3600' });
            if (storageError) throw storageError;
            const { data: publicData } = supabase
              .storage
              .from('host_images')
              .getPublicUrl(storageData.path);
            return publicData.publicUrl;
          })
        );
        uploadedUrls = results.filter(Boolean) as string[];
      }

      // Save host application to database
      const { error } = await supabase.from('host_applications').insert([
        {
          user_id: user.id,
          host_type: data.hostType,
          property_address: data.address,
          description: data.description,
          image_urls: uploadedUrls,
        },
      ]);

      if (error) throw error;

      toast.success('Your host application has been submitted!', {
        description: 'We will contact you shortly with next steps.',
      });

      // Reset form
      form.reset();
      setSelectedFiles([]);

      // Redirect to profile page where they can see application status
      navigate('/profile');
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error submitting host application:', error);
      }
      toast.error(
        error.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Input placeholder="+91 9876543210" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St, Imphal, Manipur"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    The address of the property you want to register
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What would you like to offer?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="homestay" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Homestay/Accommodation
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="eatery" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Eatery/Restaurant
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="guide" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Guide Services
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="experience" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Cultural Experience/Activity
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
{/* Images Upload */}
<div>
              <FormLabel>Upload Images (optional)</FormLabel>
              <div className="mt-2">
                <label className="flex items-center gap-2 cursor-pointer w-full justify-center rounded-md border border-dashed border-muted-foreground/30 p-4 hover:bg-muted/30">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Click to select images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const newFiles = Array.from(e.target.files || []);
                      const combined = [...selectedFiles, ...newFiles].slice(0, 5);
                      if (selectedFiles.length + newFiles.length > 5) {
                        toast.info('You can upload up to 5 images. Extra files were ignored.');
                      }
                      setSelectedFiles(combined as File[]);
                    }}
                  />
                </label>
                {selectedFiles.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative rounded-lg overflow-hidden border border-muted-foreground/20 shadow-sm"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedFiles.length} image(s) selected (max 5)
                    </p>
                  </>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your property, experience, or services..."
                      className="min-h-[120px]"
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
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
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

export default BecomeHostForm;
