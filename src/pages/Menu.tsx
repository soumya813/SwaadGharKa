import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const menuCategories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "mains", name: "Main Dishes", icon: "🍖" },
  { id: "soups", name: "Soups & Stews", icon: "🍲" },
  { id: "salads", name: "Fresh Salads", icon: "🥗" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Beverages", icon: "🥤" }
];

const menuItems = [
  {
    id: 1,
    name: "Grandma's Beef Stew",
    category: "mains",
    description: "Tender beef chunks with carrots, potatoes, and herbs in rich gravy",
    price: 19.99,
    servings: "4-6 servings",
    prepTime: "3 hours",
    dietary: ["gluten-free"],
    popular: true,
    image: "🍲"
  },
  {
    id: 2,
    name: "Homestyle Chicken Potpie",
    category: "mains", 
    description: "Classic comfort food with tender chicken and vegetables in flaky crust",
    price: 16.99,
    servings: "3-4 servings",
    prepTime: "1 hour",
    dietary: [],
    popular: true,
    image: "🥧"
  },
  {
    id: 3,
    name: "Garden Vegetable Lasagna",
    category: "mains",
    description: "Layers of pasta with roasted vegetables, ricotta, and marinara sauce",
    price: 18.99,
    servings: "4-6 servings", 
    prepTime: "1.5 hours",
    dietary: ["vegetarian"],
    popular: false,
    image: "🍝"
  },
  {
    id: 4,
    name: "Hearty Tomato Basil Soup",
    category: "soups",
    description: "Rich, creamy tomato soup with fresh basil and herbs",
    price: 8.99,
    servings: "2-3 servings",
    prepTime: "45 minutes", 
    dietary: ["vegetarian", "gluten-free"],
    popular: false,
    image: "🍅"
  },
  {
    id: 5,
    name: "Country Chicken Noodle Soup",
    category: "soups",
    description: "Traditional chicken soup with egg noodles, carrots, and celery",
    price: 10.99,
    servings: "2-3 servings",
    prepTime: "2 hours",
    dietary: [],
    popular: true,
    image: "🍜"
  },
  {
    id: 6,
    name: "Fresh Caesar Salad", 
    category: "salads",
    description: "Crisp romaine lettuce with homemade Caesar dressing and croutons",
    price: 11.99,
    servings: "2-3 servings",
    prepTime: "15 minutes",
    dietary: ["vegetarian"],
    popular: false,
    image: "🥬"
  },
  {
    id: 7,
    name: "Quinoa Power Bowl",
    category: "salads", 
    description: "Nutritious quinoa with roasted vegetables, avocado, and tahini dressing",
    price: 13.99,
    servings: "1-2 servings",
    prepTime: "30 minutes",
    dietary: ["vegan", "gluten-free"],
    popular: false,
    image: "🥙"
  },
  {
    id: 8,
    name: "Classic Apple Pie",
    category: "desserts",
    description: "Traditional apple pie with cinnamon and flaky, buttery crust",
    price: 14.99,
    servings: "6-8 servings",
    prepTime: "2 hours",
    dietary: ["vegetarian"],
    popular: true,
    image: "🥧"
  },
  {
    id: 9,
    name: "Chocolate Chip Cookies",
    category: "desserts",
    description: "Fresh-baked cookies with premium chocolate chips",
    price: 6.99,
    servings: "12 cookies",
    prepTime: "30 minutes",
    dietary: ["vegetarian"],
    popular: false,
    image: "🍪"
  },
  {
    id: 10,
    name: "Fresh Lemonade",
    category: "beverages",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    servings: "1 serving",
    prepTime: "5 minutes", 
    dietary: ["vegan", "gluten-free"],
    popular: false,
    image: "🍋"
  }
];

export const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Our Menu</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            Discover our daily selection of home-cooked meals, prepared with love and the finest ingredients
          </p>
        </div>
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🍽️</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>👨‍🍳</div>
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
          
          <div className="flex flex-wrap justify-center gap-3">
            {menuCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "hero" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
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

                {/* Item Details */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Serves:</span>
                    <span>{item.servings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prep time:</span>
                    <span>{item.prepTime}</span>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent">${item.price}</span>
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