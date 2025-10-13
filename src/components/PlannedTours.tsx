import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PlaneTakeoff, Calendar, Trash2, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import TravelItinerary from './TravelItinerary';

interface PlannedTour {
  id: string;
  user_id: string;
  itinerary: string;
  created_at: string;
}

const PlannedTours: React.FC = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState<PlannedTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<PlannedTour | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTours();
    }
  }, [user]);

  const fetchUserTours = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('planned_tours')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTours(data || []);
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error fetching planned tours:', error);
      }
      toast.error('Failed to load your planned tours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTour = async (id: string) => {
    try {
      const { error } = await supabase
        .from('planned_tours')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTours(tours.filter(tour => tour.id !== id));
      toast.success('Tour plan deleted successfully');
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error deleting tour:', error);
      }
      toast.error('Failed to delete tour plan');
    }
  };

  const handleViewTour = (tour: PlannedTour) => {
    setSelectedTour(tour);
    setShowDialog(true);
  };

  const handleDownloadTour = (tour: PlannedTour) => {
    // Create a blob with the itinerary content
    const blob = new Blob([tour.itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manipur-itinerary-${format(new Date(tour.created_at), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        Loading your planned tours...
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <PlaneTakeoff className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No Planned Tours</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't saved any tour plans yet. Use our chatbot to plan your
              next Manipur adventure!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">My Planned Tours</h3>

      {tours.map(tour => (
        <Card key={tour.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PlaneTakeoff className="h-5 w-5 mr-2 text-primary" />
              Manipur Tour Plan
            </CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Created on {format(new Date(tour.created_at), 'PPP')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="line-clamp-3 text-sm text-muted-foreground">
              {tour.itinerary}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleViewTour(tour)}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleDownloadTour(tour)}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleDeleteTour(tour.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PlaneTakeoff className="h-5 w-5 mr-2" />
              Manipur Tour Plan
            </DialogTitle>
            <DialogDescription>
              Created on{' '}
              {selectedTour && format(new Date(selectedTour.created_at), 'PPP')}
            </DialogDescription>
          </DialogHeader>

          {selectedTour && (
            <TravelItinerary
              itinerary={selectedTour.itinerary}
              alreadySaved={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlannedTours;
