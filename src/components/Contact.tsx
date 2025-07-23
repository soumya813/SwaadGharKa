import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Contact = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Ready to Taste Home?
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join hundreds of satisfied customers who've made us their go-to for delicious, 
          home-cooked meals. Order now and taste the difference love makes.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-b from-light-cream to-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-3">📞</div>
              <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground">+91 9871880053</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-light-cream to-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-semibold text-foreground mb-2">Hours</h3>
              <p className="text-muted-foreground">Sat-Sun 8AM - 8PM</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-light-cream to-card border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-3">🚚</div>
              <h3 className="font-semibold text-foreground mb-2">Delivery</h3>
              <p className="text-muted-foreground">45 min or less</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
            Order Now
          </Button>
          <a href="/menu">
            <Button variant="sage" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
              View Full Menu
            </Button>
          </a>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            Follow us on social media for daily specials and cooking tips!
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-2xl">
            <span>📘</span>
            <span>📷</span>
            <span>🐦</span>
          </div>
        </div>
      </div>
    </section>
  );
};