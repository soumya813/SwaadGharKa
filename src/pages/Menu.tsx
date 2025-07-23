import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    id: 1,
    name: "Idli",
    description: "4 idlis served with coconut chutney and sambar",
    price: 99,
    dietary: [],
    popular: true,
    image: "🍲"
  },
  {
    id: 2,
    name: "Veg Cutlet",
    description: "5 pieces of crispy vegetable cutlets served with mint chutney",
    price: 99,
    dietary: [],
    popular: true,
    image: "🥧"
  },
  {
    id: 3,
    name: "BreadRolls",
    description: "4 pieces of spiced potato bread rolls served with tangy chutney",
    price: 99,
    dietary: [],
    popular: false,
    image: "🥬"
  },
  {
    id: 4,
    name: "Paneer BreadRolls",
    description: "4 pieces of crispy paneer bread rolls served with mint chutney",
    price: 120,
    dietary: [],
    popular: false,
    image: "🧈"
  },
  {
    id: 5,
    name: "Dosa",
    description: "one masala dosa served with chutney and sambar",
    price: 99,
    dietary: [],
    popular: true,
    image: "🍲"
  },
  {
    id: 6,
    name: "Lunch Box Special",
    description: "Two roti, one sabzi, one dal, and rice",
    price: 199,
    dietary: ["vegetarian"],
    popular: false,
    image: "🍱"
  },
  
];

export const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary) {
      case "vegetarian": return "bg-sage-green text-white";
      case "vegan": return "bg-warm-orange text-white";
      case "gluten-free": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Our Menu</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            Discover our daily selection of home-cooked meals, prepared with love and the finest ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <Input
            placeholder="Search our delicious dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-strong transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-warm-orange/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                {/* Item Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
                      {item.popular && (
                        <Badge className="bg-gradient-premium text-white shadow-soft animate-pulse-slow">✨ Popular</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-warm-orange transition-colors duration-300">{item.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Dietary Badges */}
                {item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.dietary.map((diet) => (
                      <Badge key={diet} className={getDietaryBadgeColor(diet)}>
                        {diet}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent">Rs {item.price}</span>
                  <Button 
                    variant="sage" 
                    onClick={() => handleAddToCart(item)}
                    className="bg-gradient-accent hover:shadow-medium transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No dishes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};