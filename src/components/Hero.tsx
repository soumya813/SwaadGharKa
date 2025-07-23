import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kitchen.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-warm-orange/20"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 text-6xl animate-float opacity-20">🍳</div>
      <div className="absolute top-1/3 right-20 text-4xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🥕</div>
      <div className="absolute bottom-1/4 left-1/4 text-5xl animate-float opacity-25" style={{ animationDelay: '2s' }}>🌿</div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Home-Cooked
          <span className="block bg-gradient-premium bg-clip-text text-transparent animate-pulse-slow">Goodness</span>
          <span className="block text-sage-green drop-shadow-lg">Delivered</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
          Experience the warmth of home-cooked meals made with love and the finest ingredients, 
          delivered fresh to your doorstep.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4 shadow-strong transform hover:scale-105 transition-all duration-300">
            Order Now
          </Button>
          <a href="/menu">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-foreground shadow-medium transform hover:scale-105 transition-all duration-300">
              View Menu
            </Button>
          </a>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};