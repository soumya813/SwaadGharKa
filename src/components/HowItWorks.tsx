import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Browse Our Menu",
    description: "Explore our daily selection of home-cooked meals, made fresh with locally-sourced ingredients.",
    icon: "🍽️"
  },
  {
    step: "02", 
    title: "Place Your Order",
    description: "Choose your favorite dishes and customize your order. We prepare everything fresh just for you.",
    icon: "📱"
  },
  {
    step: "03",
    title: "We Cook With Love",
    description: "Our home chefs prepare your meal with the same care and attention as cooking for their own family.",
    icon: "👩‍🍳"
  },
  {
    step: "04",
    title: "Fresh Delivery",
    description: "Your meal is carefully packaged and delivered warm to your doorstep within 45 minutes.",
    icon: "🚗"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From our home kitchen to yours in four simple steps. We make it easy to enjoy authentic, home-cooked meals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center bg-gradient-to-b from-light-cream to-card border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="text-6xl mb-6">{step.icon}</div>
                <div className="text-2xl font-bold text-warm-orange mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};