interface Application {}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    userData: object
  ) => Promise<{ error: Error | null; data: { user: User | null } | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isHost: boolean;
};

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface BookingFormProps {
  listingId: string;
  pricePerNight: number;
  maxGuests: number;
}

interface BookingForm {
  checkInDate?: Date | undefined;
  checkOutDate?: Date | undefined;
  guests: number;
}

interface Booking {
  id: string;
  user_id: string;
  listing_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  price_total: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

interface BookingWithListing extends Booking {
  listing?: Partial<Listing>;
}

interface ChatbotProps {
  className?: string;
};

interface ChatMessage {
  text: string;
  isUser: boolean;
  id: string;
  isItinerary?: boolean;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type HostType = 'homestay' | 'eatery' | 'guide' | 'experience'

type HostApplicationStatus = 'pending' | 'approved' | 'rejected'

interface HostApplicationForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  hostType: HostType;
  description: string;
}

interface HostApplication {
  id: string;
  user_id: string;
  host_type: HostType;
  property_address: string;
  description: string;
  status: HostApplicationStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  amenities?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  seller: string;
  contact: string;
  website: string;
  location: string;
}

type ProfileRole = 'user' | 'host' | 'admin';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

type SidebarState = 'expanded' | 'collapsed';

interface SidebarContext {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReachNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};