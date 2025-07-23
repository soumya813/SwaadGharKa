import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageCircle,
  Star,
  Users,
  ChefHat,
  Heart
} from "lucide-react";

export const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message sent successfully! 🎉",
      description: "We'll get back to you within 24 hours. Thank you for reaching out!",
      duration: 5000,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, 
            we're here to help make your dining experience exceptional.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-light-cream to-cream">
        <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-warm-orange to-deep-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Call Us</h3>
              <p className="text-warm-orange font-semibold text-lg">+91 9871880053</p>
              <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-sage-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Email Us</h3>
              <p className="text-sage-green font-semibold">soumyasrivastav53@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-1">Response in 2 hours</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Visit Us</h3>
              <p className="text-purple-600 font-semibold">R-011, Indiabulls Centrum Park</p>
              <p className="text-sm text-muted-foreground mt-1">Haryana-122006</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Hours</h3>
              <p className="text-blue-600 font-semibold">8AM - 8PM</p>
              <p className="text-sm text-muted-foreground mt-1">Sat-Sun</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="h-6 w-6 text-warm-orange" />
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+91 9871880053"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[120px]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white font-semibold text-lg shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Why Choose Us */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-red-500" />
                  Why Choose SwaadGharKa?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-5 w-5 text-warm-orange" />
                  <span className="font-medium">Expert home chefs with 10+ years experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">4.9/5 star rating from 1000+ customers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Trusted by families across the city</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Fresh ingredients, made daily</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Alert className="border-warm-orange/20 bg-warm-orange/5">
              <MessageCircle className="h-4 w-4 text-warm-orange" />
              <AlertDescription className="text-warm-orange">
                <strong>Need immediate help?</strong> Call us at{" "}
                <span className="font-bold">+91 9871880053</span> for instant support!
              </AlertDescription>
            </Alert>

            {/* Social Media */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Follow Us</CardTitle>
                <p className="text-muted-foreground">
                  Stay updated with our daily specials and cooking tips
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer">
                    📘 Facebook
                  </Badge>
                  <Badge className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 cursor-pointer">
                    📷 Instagram
                  </Badge>
                  <Badge className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 cursor-pointer">
                    🐦 Twitter
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
