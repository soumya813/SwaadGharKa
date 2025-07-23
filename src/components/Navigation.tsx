import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cart } from "./Cart";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-warm-orange/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold bg-gradient-premium bg-clip-text text-transparent">Home Kitchen</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-warm-orange transition-colors font-medium">
              Home
            </Link>
            <Link to="/menu" className="text-foreground hover:text-warm-orange transition-colors font-medium">
              Menu
            </Link>
            <a href="#about" className="text-foreground hover:text-warm-orange transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-warm-orange transition-colors font-medium">
              Contact
            </a>
            <Cart />
            <Link to="/menu">
              <Button variant="hero" size="sm" className="shadow-medium">
                Order Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center gap-2">
            <Cart />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <Card className="md:hidden absolute top-16 left-4 right-4 bg-background border-border">
            <CardContent className="p-4 space-y-4">
              <Link to="/" className="block text-foreground hover:text-warm-orange transition-colors">
                Home
              </Link>
              <Link to="/menu" className="block text-foreground hover:text-warm-orange transition-colors">
                Menu
              </Link>
              <a href="#about" className="block text-foreground hover:text-warm-orange transition-colors">
                About
              </a>
              <a href="#contact" className="block text-foreground hover:text-warm-orange transition-colors">
                Contact
              </a>
              <Link to="/menu">
                <Button variant="hero" size="sm" className="w-full">
                  Order Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </nav>
  );
};