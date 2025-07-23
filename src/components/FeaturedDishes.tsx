import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import featuredImage from "@/assets/featured-dishes.jpg";

const dishes = [
  {
    name: "Grandma's Lasagna",
    description: "Layers of pasta, rich meat sauce, and melted cheese baked to perfection",
    price: "$18.99",
    servings: "Serves 4-6"
  },
  {
    name: "Garden Fresh Salad",
    description: "Crisp vegetables, herbs, and house-made vinaigrette from our garden",
    price: "$12.99",
    servings: "Serves 2-3"
  },
  {
    name: "Classic Chicken Pot Pie",
    description: "Tender chicken and vegetables in flaky, golden pastry crust",
    price: "$16.99",
    servings: "Serves 3-4"
  }
];

export const FeaturedDishes = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-light-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Today's Featured Dishes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crafted with love using fresh, locally-sourced ingredients. Each dish tells a story of tradition and taste.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <img 
              src={featuredImage} 
              alt="Featured homemade dishes" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
          
          {/* Dishes List */}
          <div className="order-1 md:order-2 space-y-6">
            {dishes.map((dish, index) => (
              <Card key={index} className="bg-gradient-to-r from-card to-light-cream border-border/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{dish.name}</h3>
                    <span className="text-xl font-bold text-warm-orange">{dish.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-green font-medium">{dish.servings}</span>
                    <Button variant="sage" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};