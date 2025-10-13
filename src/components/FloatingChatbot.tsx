import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  X,
  Map,
  UtensilsCrossed,
  Phone,
  Home,
  User,
  ArrowLeft,
  PlaneTakeoff,
  Loader2,
  Save,
  ChevronRight,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const FloatingChatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "👋 Hi there! I'm your Trip & Treat assistant. How can I help you today?",
      isUser: false,
      id: 'initial',
    },
  ]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [showHotspotDialog, setShowHotspotDialog] = useState(false);
  const [showHostDialog, setShowHostDialog] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([
        {
          text: "👋 Hi there! I'm your Trip & Treat assistant. How can I help you today?",
          isUser: false,
          id: 'initial-reset',
        },
      ]);
      setSelectedOption(null);
      setNavigationHistory([]);
      setCurrentItinerary(null);
    }
  };

  const addMessage = (text: string, isUser: boolean, isItinerary = false) => {
    const newMessage: ChatMessage = {
      text,
      isUser,
      id: Date.now().toString(),
      isItinerary,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const history = [...navigationHistory];
      history.pop();
      setNavigationHistory(history);
      setSelectedOption(history[history.length - 1] || null);
    } else {
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (option: string) => {
    addMessage(option, true);
    setNavigationHistory(prev => [...prev, option]);

    setTimeout(() => {
      let response = '';
      switch (option) {
        case 'Plan my tour':
          response =
            'Great! I can help you plan a tour of Manipur based on your budget. Please enter your travel budget in Indian Rupees (₹):';
          setSelectedOption('tour-planning');
          break;
        case "I'm looking for places to visit":
          response = 'Great! What kind of places are you interested in?';
          setSelectedOption('places');
          break;
        case 'Where can I eat?':
          response =
            'Manipur offers many delicious dining options! What are you in the mood for?';
          setSelectedOption('eateries');
          break;
        case 'I need contact details':
          response =
            "I'd be happy to help with contact information. What are you looking for?";
          setSelectedOption('contact');
          break;
        case 'Homestay information':
          response =
            'Excellent choice! Our homestays offer authentic Manipuri experiences. What would you like to know?';
          setSelectedOption('homestay');
          break;
        default:
          response =
            "I'm not sure I understand. Could you select one of the options?";
      }
      addMessage(response, false);
    }, 600);
  };

  const handleSubOptionSelect = async (category: string) => {
    if (selectedOption !== 'tour-planning') {
      addMessage(category, true);
    }
    setNavigationHistory(prev => [...prev, category]);

    setTimeout(async () => {
      if (selectedOption === 'tour-planning') {
        if (!budgetInput.trim() || isNaN(Number(budgetInput))) {
          addMessage(
            'Please enter a valid budget amount in Indian Rupees (₹).',
            false
          );
          return;
        }

        const budget = parseInt(budgetInput);
        addMessage(`₹${budget}`, true);
        setBudgetInput('');
        setIsLoading(true);

        try {
          addMessage(
            'Crafting your bespoke Manipur journey... Please hold on',
            false
          );

          const { data, error } = await supabase.functions.invoke(
            'generate-itinerary',
            { body: { budget } }
          );

          if (error) throw error;

          const itinerary = data.itinerary;
          const isMock = data.isMock || false;
          const message = data.message || '';

          setCurrentItinerary(itinerary);

          // Add a note if it's a mock itinerary
          if (isMock) {
            addMessage(`🤖 ${message}\n\n${itinerary}`, false, true);
          } else {
            addMessage(itinerary, false, true);
          }

          setTimeout(() => {
            addMessage(
              "Would you like to save this itinerary to your profile? Click the 'Save this plan' button below.",
              false
            );
          }, 1000);
        } catch (error: unknown) {
          // Log error for debugging in development
          if (import.meta.env.DEV) {
            console.error('Error generating itinerary:', error);
          }
          addMessage(
            `Sorry, I couldn't generate an itinerary. ${
              error.message || 'Please try again later.'
            }`,
            false
          );
        } finally {
          setIsLoading(false);
        }
      } else if (selectedOption === 'places') {
        setShowHotspotDialog(true);
        addMessage('Opening the hotspots for ' + category + '...', false);
      } else if (selectedOption === 'eateries') {
        addMessage(
          `Here are some ${category} recommendations in Manipur. For more options, visit our Eateries page.`,
          false
        );
      } else if (selectedOption === 'contact') {
        if (category === 'Host contact details') {
          setShowHostDialog(true);
          addMessage(
            "Please provide the name of the host or location you're inquiring about.",
            false
          );
        } else {
          addMessage(
            `For ${category}, you can reach our support team at support@tripandtreat.com or call +91-98765-43210.`,
            false
          );
        }
      } else if (selectedOption === 'homestay') {
        addMessage(
          `For information about ${category}, please visit our Homestays page. Would you like me to direct you there?`,
          false
        );
      }
    }, 600);
  };

  const handleSaveItinerary = async () => {
    if (!user) {
      toast.error('Please log in to save your itinerary', {
        description:
          'You need to be logged in to save itineraries to your profile.',
        duration: 5000,
      });
      return;
    }

    if (!currentItinerary) {
      toast.error('No itinerary to save', {
        description: 'There is no itinerary to save at the moment.',
        duration: 3000,
      });
      return;
    }

    try {
      const { error } = await supabase.from('planned_tours').insert({
        user_id: user.id,
        itinerary: currentItinerary,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Itinerary saved!', {
        description:
          'Your Manipur travel itinerary has been saved to your profile.',
        duration: 5000,
      });

      addMessage(
        "Great! I've saved this itinerary to your profile. You can view it anytime in your Profile > My Planned Tours section.",
        false
      );
    } catch (error: unknown) {
      // Log error for debugging in development
      if (import.meta.env.DEV) {
        console.error('Error saving itinerary:', error);
      }
      toast.error('Failed to save itinerary', {
        description: error.message || 'Please try again later.',
        duration: 5000,
      });
    }
  };

  const renderOptions = () => {
    const optionStyle = 'text-[11px] px-2 py-0.5 h-7 rounded-full';
    const subOptionStyle =
      'text-[11px] px-2 py-0.5 h-7 rounded-full whitespace-nowrap';

    if (!selectedOption) {
      return (
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1 max-h-20 overflow-y-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-sm justify-start py-3 hover:bg-primary/10"
            onClick={() => handleOptionSelect('Plan my tour')}
          >
            <PlaneTakeoff size={16} className="mr-2" />
            Plan My Tour
            <ChevronRight size={16} className="ml-auto" />
          </Button>

          <Button
            variant="outline"
            className={`${optionStyle} border-blue-200 text-blue-600 hover:bg-blue-50`}
            onClick={() =>
              handleOptionSelect("I'm looking for places to visit")
            }
          >
            <Map size={14} className="mr-1" />
            Places
          </Button>
          <Button
            variant="outline"
            className={`${optionStyle} border-orange-200 text-orange-600 hover:bg-orange-50`}
            onClick={() => handleOptionSelect('Where can I eat?')}
          >
            <UtensilsCrossed size={14} className="mr-1" />
            Eateries
          </Button>
          <Button
            variant="outline"
            className={`${optionStyle} border-green-200 text-green-600 hover:bg-green-50`}
            onClick={() => handleOptionSelect('I need contact details')}
          >
            <Phone size={14} className="mr-1" />
            Contacts
          </Button>
          <Button
            variant="outline"
            className={`${optionStyle} border-purple-200 text-purple-600 hover:bg-purple-50`}
            onClick={() => handleOptionSelect('Homestay information')}
          >
            <Home size={14} className="mr-1" />
            Homestays
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
        {currentItinerary && (
          <div className="grid grid-cols-1 gap-2 mt-3">
            <Button
              onClick={handleSaveItinerary}
              className="text-sm justify-center py-3 bg-primary hover:bg-primary/90"
            >
              <Save size={16} className="mr-2" />
              Save this plan
            </Button>
          </div>
        )}
        {selectedOption === 'places' && (
          <>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Historical Sites')}
            >
              🏛️ Historical
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Natural Attractions')}
            >
              🌿 Nature
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Cultural Places')}
            >
              🎭 Cultural
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Adventure Locations')}
            >
              ⛰️ Adventure
            </Button>
          </>
        )}
        {selectedOption === 'eateries' && (
          <>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Traditional Manipuri')}
            >
              🍲 Traditional
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Vegetarian')}
            >
              🌱 Vegetarian
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Street Food')}
            >
              🥡 Street Food
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Fine Dining')}
            >
              🍽️ Fine Dining
            </Button>
          </>
        )}
        {selectedOption === 'contact' && (
          <>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Support Team')}
            >
              🛟 Support
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Host contact details')}
            >
              👤 Host Contact
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Tour Guides')}
            >
              🧭 Tour Guides
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Emergency')}
            >
              🆘 Emergency
            </Button>
          </>
        )}
        {selectedOption === 'homestay' && (
          <>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Availability')}
            >
              📅 Availability
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Pricing')}
            >
              💰 Pricing
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Amenities')}
            >
              🛁 Amenities
            </Button>
            <Button
              variant="outline"
              className={subOptionStyle}
              onClick={() => handleSubOptionSelect('Booking Process')}
            >
              📖 Booking
            </Button>
          </>
        )}
      </div>
    );
  };

  const handleHostLookup = () => {
    toast.info('Host information', {
      description:
        "We've sent the host's contact details to your registered email address.",
      duration: 5000,
    });
    setShowHostDialog(false);
    addMessage(
      "For privacy reasons, we've sent the host's contact details to your registered email. If you haven't received it, please check your spam folder or contact our support team.",
      false
    );
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (selectedOption === 'tour-planning') {
      if (!budgetInput) return;
      handleSubOptionSelect(budgetInput);
    } else {
      if (!inputText.trim()) return;
      addMessage(inputText, true);
      setInputText('');
    }
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={toggleChatbot}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-red-500' : 'bg-primary'
          }`}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={24} className="text-white" />
          )}
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 h-[480px] bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in border border-gray-200">
            <div className="bg-primary p-3 text-white flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2" />
                <h3 className="font-medium">Trip & Treat Assistant</h3>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-[calc(100%-180px)] overflow-y-auto p-3 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl max-w-[85%] text-sm ${
                      msg.isUser
                        ? 'bg-primary text-white ml-8 rounded-br-none'
                        : 'bg-gray-100 mr-8 rounded-bl-none'
                    }`}
                  >
                    {msg.isItinerary ? (
                      <div className="text-xs max-h-80 overflow-y-auto font-sans">
                        <div className="font-semibold mb-2 text-base text-primary">
                          ✈️ Your Manipur Itinerary
                        </div>
                        <div className="space-y-2 text-gray-700">
                          {msg.text.split('\n').map((line, index) => {
                            if (line.startsWith('**'))
                              return (
                                <div
                                  key={index}
                                  className="font-semibold text-gray-900 mt-2"
                                >
                                  {line.replace(/\*\*/g, '')}
                                </div>
                              );
                            if (line.startsWith('- '))
                              return (
                                <div
                                  key={index}
                                  className="flex items-start ml-2"
                                >
                                  <span className="mr-2">•</span>
                                  {line.substring(2)}
                                </div>
                              );
                            return (
                              <div key={index} className="leading-relaxed">
                                {line}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Saved on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`leading-relaxed ${
                          !msg.isUser ? 'text-gray-700' : ''
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 max-w-[80%] mr-auto">
                  <div className="p-3 rounded-xl shadow-sm bg-white border border-gray-200 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating your personalized itinerary...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2">
              {selectedOption && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={goBack}
                  className="mb-2 text-xs flex items-center text-gray-600 hover:bg-gray-100"
                >
                  <ArrowLeft size={14} className="mr-1" /> Back
                </Button>
              )}

              {renderOptions()}

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 mt-2"
              >
                {selectedOption === 'tour-planning' && !currentItinerary ? (
                  <>
                    <input
                      type="number"
                      value={budgetInput}
                      onChange={e => setBudgetInput(e.target.value)}
                      placeholder="Enter budget in ₹"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      min="1000"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send size={16} className="mr-1" />
                      )}
                    </Button>
                  </>
                ) : null}
              </form>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showHotspotDialog} onOpenChange={setShowHotspotDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Map size={20} className="text-primary" />
              <h3 className="text-lg font-medium">Explore Hotspots</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Discover amazing places in Manipur. Visit our Hotspots page for a
              complete list of attractions.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => {
                  setShowHotspotDialog(false); // ⬅️ hide the dialog
                  navigate('/hotspots'); // then go to the page
                }}
              >
                View All Hotspots
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHostDialog} onOpenChange={setShowHostDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-primary" />
              <h3 className="text-lg font-medium">Host Information</h3>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Enter host name or location
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Loktak Lake View Homestay"
              />
            </div>
            <Button onClick={handleHostLookup} className="w-full">
              Get Contact Details
            </Button>
            <p className="text-xs text-muted-foreground">
              For privacy reasons, host contact information will be sent to your
              registered email address.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatbot;
