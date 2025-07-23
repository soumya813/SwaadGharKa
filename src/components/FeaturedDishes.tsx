import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import featuredImage from "@/assets/featured-dishes.jpg";

const dishes = [
  {
    name: "Grandma's Lasagna",
    description: "Layers of pasta, rich meat sauce, and melted cheese baked to perfection",
    price: "$18.99",
    servings: "Serves 4-6",
    emoji: "🍝",
    popular: true
  },
  {
    name: "Garden Fresh Salad",
    description: "Crisp vegetables, herbs, and house-made vinaigrette from our garden",
    price: "$12.99",
    servings: "Serves 2-3",
    emoji: "🥗",
    popular: false
  },
  {
    name: "Classic Chicken Pot Pie",
    description: "Tender chicken and vegetables in flaky, golden pastry crust",
    price: "$16.99",
    servings: "Serves 3-4",
    emoji: "🥧",
    popular: true
  }
];

export const FeaturedDishes = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-light-cream to-cream relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-warm-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-sage-green/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 bg-warm-orange/10 text-warm-orange border-warm-orange/20">
            ⭐ Chef's Special
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-warm-orange via-deep-orange to-warm-brown bg-clip-text text-transparent mb-6">
            Today's Featured Dishes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Crafted with love using fresh, locally-sourced ingredients. Each dish tells a story of tradition and taste.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-warm-orange/20 to-sage-green/20 rounded-3xl blur-2xl"></div>
            <img 
              src={featuredImage} 
              alt="Featured homemade dishes" 
              className="relative w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-orange">4.9⭐</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
          
          {/* Dishes List */}
          <div className="order-1 lg:order-2 space-y-8">
            {dishes.map((dish, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{dish.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-warm-orange transition-colors">
                            {dish.name}
                          </h3>
                          {dish.popular && (
                            <Badge variant="secondary" className="bg-warm-orange/10 text-warm-orange text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{dish.servings}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-warm-orange">{dish.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {dish.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-warm-orange group-hover:text-white transition-all duration-300 border-warm-orange/30 text-warm-orange hover:border-warm-orange"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🍽️ View Full Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
