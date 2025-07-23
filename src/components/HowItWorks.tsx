import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Browse Our Menu",
    description: "Explore our daily selection of home-cooked meals, made fresh with locally-sourced ingredients.",
    icon: "🍽️",
    gradient: "from-warm-orange/10 to-warm-orange/5"
  },
  {
    step: "02", 
    title: "Place Your Order",
    description: "Choose your favorite dishes and customize your order. We prepare everything fresh just for you.",
    icon: "📱",
    gradient: "from-sage-green/10 to-sage-green/5"
  },
  {
    step: "03",
    title: "We Cook With Love",
    description: "Our home chefs prepare your meal with the same care and attention as cooking for their own family.",
    icon: "👩‍🍳",
    gradient: "from-gold/10 to-gold/5"
  },
  {
    step: "04",
    title: "Fresh Delivery",
    description: "Your meal is carefully packaged and delivered warm to your doorstep within 45 minutes.",
    icon: "🚗",
    gradient: "from-deep-orange/10 to-deep-orange/5"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-light-cream relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-8 w-64 h-64 bg-warm-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-8 w-48 h-48 bg-sage-green/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 bg-warm-orange/10 text-warm-orange border-warm-orange/20">
            ⚡ Simple Process
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-warm-orange via-deep-orange to-warm-brown bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From our home kitchen to yours in four simple steps. We make it easy to enjoy authentic, home-cooked meals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className={`group text-center bg-gradient-to-br ${step.gradient} border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
            >
              <CardContent className="p-8 relative z-10">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-warm-orange to-deep-orange rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-warm-orange transition-colors duration-300">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.description}
                </p>
                
                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-warm-orange to-transparent"></div>
                )}
              </CardContent>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-warm-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <span className="text-warm-orange font-semibold">⏱️ Average delivery time:</span>
            <span className="text-2xl font-bold text-warm-orange">45 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
