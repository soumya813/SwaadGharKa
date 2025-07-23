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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From our home kitchen to yours in four simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
