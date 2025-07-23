import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cart } from "./Cart";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-white/90 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏠</span>
            <div className="flex flex-col">
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}>SwaadGharKa</span>
              <span className={`text-xs transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-600' : 'text-white/90'
              }`}>Home Kitchen</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-medium transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
            }`}>
              Home
            </Link>
            <Link to="/menu" className={`font-medium transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
            }`}>
              Menu
            </Link>
            <Link to="/about" className={`font-medium transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
            }`}>
              About
            </Link>
            <Link to="/contact" className={`font-medium transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
            }`}>
              Contact
            </Link>
            <Cart />
            <Link to="/menu">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                Order Now
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
              className={`p-2 transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className="block py-2 text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/about" 
                className="block py-2 text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white">
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};