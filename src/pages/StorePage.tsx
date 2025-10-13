import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Phone, Globe, MapPin, ShoppingBag } from 'lucide-react';
import ContactDialog from '@/components/ContactDialog';
import OrderDialog from '@/components/OrderDialog';
import { toast } from 'sonner';

// Sample products data
const products = [
  {
    id: 1,
    name: 'Manipuri Phanek',
    description:
      'Hand-woven traditional Manipuri sarong with intricate patterns',
    price: '₹1,200',
    image: '/file-uploads/phanek.jpeg',
    seller: 'Manipuri Heritage Crafts',
    contact: '+91 9876543210',
    website: 'www.manipuriheritage.com',
    location: 'Imphal, Manipur',
  },
  {
    id: 2,
    name: 'Handcrafted Pottery Set',
    description: 'Traditional pottery crafted by local artisans of Manipur',
    price: '₹850',
    image: '/file-uploads/pottery.jpeg',
    seller: 'Ema Keithel Crafts',
    contact: '+91 8765432109',
    website: 'www.emakeithel.com',
    location: 'Bishnupur, Manipur',
  },
  {
    id: 3,
    name: 'Bamboo Handicrafts',
    description: 'Eco-friendly bamboo basket with traditional Manipuri design',
    price: '₹650',
    image: '/file-uploads/bamboocrafts.jpeg',
    seller: 'Green Bamboo Crafts',
    contact: '+91 7654321098',
    website: 'www.greenbamboo.com',
    location: 'Churachandpur, Manipur',
  },
  {
    id: 4,
    name: 'Manipuri Silk Shawl',
    description: 'Premium silk shawl with traditional Manipuri motifs',
    price: '₹3,500',
    image: '/file-uploads/shwal.jpeg',
    seller: 'Silk Route Manipur',
    contact: '+91 6543210987',
    website: 'www.silkroutemanipur.com',
    location: 'Imphal East, Manipur',
  },
  {
    id: 5,
    name: 'Sinai Chei',
    description: "Handcrafted Sinai Chei inspired by Manipur's rich heritage",
    price: '₹1,800',
    image: '/file-uploads/sinai.jpeg',
    seller: 'Heritage Jewelry',
    contact: '+91 5432109876',
    website: 'www.heritagejewelry.com',
    location: 'Moirang, Manipur',
  },
  {
    id: 6,
    name: 'Handcrafted Sculpture',
    description: 'Handcrafted Sculpture representing Manipur',
    price: '₹2,200',
    image: '/file-uploads/polo.jpeg',
    seller: 'Kanglei Crafters',
    contact: '+91 4321098765',
    website: 'www.kangleicrafters.com',
    location: 'Imphal, Manipur',
  },
] satisfies Product[];

const StorePage = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(null);

  const handleContactClick = (product: Product) => {
    setSelectedProduct(product);
    setContactDialogOpen(true);
  };

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setOrderDialogOpen(true);
    toast.success('Order initiated!', {
      description: `You selected ${product.name}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in">
              Manipuri Handloom & Handicrafts
            </h1>
            <p className="text-muted-foreground mb-8 animate-fade-in">
              Discover the rich artisanal heritage of Manipur through our
              carefully curated collection of handloom and handicraft products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.seller}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <p className="mt-4 text-xl font-semibold">{product.price}</p>
                </CardContent>

                <CardFooter className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleContactClick(product)}
                  >
                    Contact
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-primary"
                    onClick={() => handleOrderClick(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Order Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Contact Dialog */}
      {selectedProduct && (
        <ContactDialog
          isOpen={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          eateryName={selectedProduct.seller}
          phone={selectedProduct.contact}
          website={selectedProduct.website}
          location={selectedProduct.location}
        />
      )}

      {/* Order Dialog */}
      {selectedProduct && (
        <OrderDialog
          isOpen={orderDialogOpen}
          onClose={() => setOrderDialogOpen(false)}
          productName={selectedProduct.name}
          contactNumber={selectedProduct.contact}
        />
      )}
    </div>
  );
};

export default StorePage;
