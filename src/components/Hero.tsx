import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-kitchen.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-16">
      {/* Enhanced Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-warm-orange/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-8 w-32 h-32 bg-warm-orange/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-12 w-24 h-24 bg-sage-green/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300">
          🍳 Fresh • Local • Homemade
        </Badge>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          <span className="block bg-gradient-to-r from-white via-cream to-gold bg-clip-text text-transparent">
            Home-Cooked
          </span>
          <span className="block bg-gradient-premium bg-clip-text text-transparent animate-pulse-slow drop-shadow-2xl">
            Goodness
          </span>
          <span className="block text-sage-green drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
            Delivered
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light">
          Experience the warmth of <span className="font-semibold text-gold">home-cooked meals</span> made with love and the finest ingredients, 
          delivered fresh to your doorstep in <span className="font-semibold text-warm-orange">45 minutes</span>.
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">45min</div>
            <div className="text-sm text-gray-300">Delivery Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">100%</div>
            <div className="text-sm text-gray-300">Fresh Ingredients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">500+</div>
            <div className="text-sm text-gray-300">Happy Families</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-10 py-6 shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange border-0 text-white font-semibold rounded-full"
          >
            🍽️ Order Now
          </Button>
          <a href="/menu">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 bg-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-foreground shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold rounded-full"
            >
              📋 View Menu
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
