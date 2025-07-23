import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-light-cream to-cream">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Made With Love,
              <span className="block text-warm-orange">Delivered With Care</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We're a family of passionate home cooks who believe that the best meals come from the heart. 
              Every dish we prepare follows traditional recipes passed down through generations, using only 
              the freshest, locally-sourced ingredients.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our mission is simple: to bring the warmth and comfort of home-cooked meals to busy families 
              who deserve better than fast food but don't always have time to cook from scratch.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="bg-white/70 border-sage-green/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warm-orange mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Fresh Ingredients</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-sage-green/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warm-orange mb-2">5★</div>
                  <div className="text-sm text-muted-foreground">Customer Rating</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Values */}
          <div className="space-y-6">
            <Card className="bg-white/70 border-warm-orange/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">🌱 Locally Sourced</h3>
                <p className="text-muted-foreground">
                  We partner with local farmers and suppliers to ensure the freshest ingredients 
                  while supporting our community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 border-warm-orange/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">👨‍👩‍👧‍👦 Family Recipes</h3>
                <p className="text-muted-foreground">
                  Every dish is prepared using time-tested family recipes that have been perfected 
                  over generations of home cooking.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 border-warm-orange/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">🚀 Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Fresh, hot meals delivered to your door in 45 minutes or less. We keep it warm 
                  and delicious every step of the way.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};