import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const dishes = [
  { id: 101, name: "Lunch Box Special", price: "Rs 199", emoji: "🍽️", popular: true },
  { id: 102, name: "Paneer BreadRolls", price: "Rs 120", emoji: "🧈", popular: false },
  { id: 103, name: "Idli", price: "Rs 99", emoji: "🍚", popular: true }
];

export const FeaturedDishes = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (dish: typeof dishes[0]) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: parseInt(dish.price.replace('Rs ', '')),
      image: dish.emoji
    });
    
    toast({
      title: "Added to cart! 🎉",
      description: `${dish.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Today's Chef Special
          </h2>
          <p className="text-lg text-gray-600">
            Handpicked specialties prepared with love and fresh ingredients
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <Card key={dish.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {dish.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {dish.name}
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  {dish.price}
                </p>
                <Button 
                  onClick={() => handleAddToCart(dish)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
