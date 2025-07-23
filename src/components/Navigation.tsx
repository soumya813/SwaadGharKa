import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cart } from "./Cart";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-warm-orange/20 shadow-xl' 
        : 'bg-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r from-warm-orange to-deep-orange rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}>
              <span className="text-2xl text-white">🏠</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              } ${!isScrolled ? 'text-shadow-white' : ''}`}>SwaadGharKa</span>
              <span className={`text-xs transition-all duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-white/90 text-shadow-white'
              }`}>Home Kitchen</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`relative font-medium transition-all duration-300 group ${
              isScrolled ? 'text-gray-800 hover:text-warm-orange' : 'text-white hover:text-warm-orange/90 text-shadow-white'
            }`}>
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/menu" className={`relative font-medium transition-all duration-300 group ${
              isScrolled ? 'text-gray-800 hover:text-warm-orange' : 'text-white hover:text-warm-orange/90 text-shadow-white'
            }`}>
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="#about" className={`relative font-medium transition-all duration-300 group ${
              isScrolled ? 'text-gray-800 hover:text-warm-orange' : 'text-white hover:text-warm-orange/90 text-shadow-white'
            }`}>
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link to="/contact" className={`relative font-medium transition-all duration-300 group ${
              isScrolled ? 'text-gray-800 hover:text-warm-orange' : 'text-white hover:text-warm-orange/90 text-shadow-white'
            }`}>
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Cart />
            <Link to="/menu">
              <Button 
                variant="hero" 
                size="sm" 
                className={`shadow-lg bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300 ${
                  isScrolled ? 'shadow-xl' : 'shadow-2xl border border-white/20'
                }`}
              >
                🍽️ Order Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center gap-3">
            <Cart />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'hover:bg-warm-orange/10 text-gray-800' 
                  : 'hover:bg-white/20 text-white'
              }`}
            >
              <span className="text-2xl">{isMenuOpen ? "✕" : "☰"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <Card className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border border-warm-orange/20 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <Link 
                to="/" 
                className="block text-gray-800 hover:text-warm-orange transition-all duration-300 py-3 px-4 rounded-xl hover:bg-warm-orange/5 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                to="/menu" 
                className="block text-gray-800 hover:text-warm-orange transition-all duration-300 py-3 px-4 rounded-xl hover:bg-warm-orange/5 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Menu
              </Link>
              <a 
                href="#about" 
                className="block text-gray-800 hover:text-warm-orange transition-all duration-300 py-3 px-4 rounded-xl hover:bg-warm-orange/5 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ About
              </a>
              <Link 
                to="/contact" 
                className="block text-gray-800 hover:text-warm-orange transition-all duration-300 py-3 px-4 rounded-xl hover:bg-warm-orange/5 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Contact
              </Link>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white rounded-full py-3 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  🍽️ Order Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </nav>
  );
};