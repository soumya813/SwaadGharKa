import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  ChefHat, 
  Star, 
  Clock, 
  Leaf,
  Shield,
  Award,
  MapPin,
  Target
} from "lucide-react";

export const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">About SwaadGharKa</h1>
          <p className="text-xl max-w-3xl mx-auto drop-shadow-md">
            Where authentic home-cooked flavors meet modern convenience. 
            We bring the warmth and taste of traditional Indian home kitchens directly to your table.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-light-cream to-cream">
        <div className="max-w-7xl mx-auto px-4 py-16">
          
          {/* Our Story Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-warm-orange/20 to-deep-orange/10 text-warm-orange border-warm-orange/30 px-4 py-2 font-semibold">
                🏠 Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-warm-orange via-deep-orange to-warm-brown bg-clip-text text-transparent mb-6">
                Born from Love for Home Cooking
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SwaadGharKa was born from a simple belief - nothing beats the taste and comfort of home-cooked meals. 
                  Founded in 2023, we started as a small home kitchen with a passion for sharing authentic Indian flavors 
                  with our community.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  What began as cooking for friends and family has grown into a trusted name for wholesome, 
                  traditional meals. Every dish we prepare carries the essence of home - made with love, 
                  care, and the finest ingredients.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warm-orange">2+</div>
                    <div className="text-sm text-muted-foreground">Years of Trust</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warm-orange">1000+</div>
                    <div className="text-sm text-muted-foreground">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warm-orange">50+</div>
                    <div className="text-sm text-muted-foreground">Authentic Dishes</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-warm-orange/20 to-deep-orange/20 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👩‍🍳</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Chef Soumya</h3>
                      <p className="text-muted-foreground mb-4">Founder & Head Chef</p>
                      <p className="text-sm text-muted-foreground italic">
                        "Every meal is prepared with the same love and care I would put into cooking for my own family."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Our Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-sage-green/20 to-green-500/10 text-sage-green border-sage-green/30 px-4 py-2 font-semibold">
                💫 Our Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sage-green via-green-600 to-green-700 bg-clip-text text-transparent mb-6">
                What We Stand For
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-warm-orange to-deep-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Made with Love</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Every dish is prepared with genuine care and passion, just like home-cooked meals should be.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-sage-green to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Fresh Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We source the freshest ingredients daily to ensure the highest quality and authentic taste.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ChefHat className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Traditional Recipes</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Our recipes are passed down through generations, preserving authentic Indian flavors.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Food Safety</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We maintain the highest standards of hygiene and food safety in our kitchen operations.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">On-Time Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We respect your time and ensure fresh, hot meals are delivered when promised.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Community First</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We're more than a food service - we're part of the community we serve with pride.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-warm-orange to-deep-orange rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To make authentic, home-cooked Indian meals accessible to everyone, bringing families together 
                  through the universal language of food. We strive to preserve traditional cooking methods 
                  while adapting to modern lifestyles.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sage-green to-green-600 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To become the most trusted name in home-style Indian cuisine, expanding our reach while 
                  maintaining the personal touch and quality that defines us. We envision a future where 
                  everyone can enjoy restaurant-quality home food.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
