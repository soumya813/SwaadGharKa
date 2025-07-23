import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cart } from "./Cart";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-warm-orange/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-warm-orange to-deep-orange rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">🏠</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent">SwaadGharKa</span>
              <span className="text-xs text-gray-500 -mt-1">Home Kitchen</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-warm-orange transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/menu" className="text-foreground hover:text-warm-orange transition-all duration-300 font-medium relative group">
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="#about" className="text-foreground hover:text-warm-orange transition-all duration-300 font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-foreground hover:text-warm-orange transition-all duration-300 font-medium relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Cart />
            <Link to="/menu">
              <Button 
                variant="hero" 
                size="sm" 
                className="shadow-lg bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300"
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
              className="p-2 hover:bg-warm-orange/10 rounded-xl transition-all duration-300"
            >
              <span className="text-2xl text-warm-orange">{isMenuOpen ? "✕" : "☰"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <Card className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-md border-warm-orange/20 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <Link 
                to="/" 
                className="block text-foreground hover:text-warm-orange transition-all duration-300 py-2 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                to="/menu" 
                className="block text-foreground hover:text-warm-orange transition-all duration-300 py-2 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Menu
              </Link>
              <a 
                href="#about" 
                className="block text-foreground hover:text-warm-orange transition-all duration-300 py-2 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ About
              </a>
              <a 
                href="#contact" 
                className="block text-foreground hover:text-warm-orange transition-all duration-300 py-2 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Contact
              </a>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white rounded-full py-3"
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