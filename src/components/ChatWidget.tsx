import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const botResponses = [
  "Hello! I'm here to help you with your order. What can I get started for you today?",
  "Our most popular dishes today are Grandma's Beef Stew and the Classic Chicken Potpie. Would you like to hear more about either of these?",
  "All our meals are prepared fresh daily with locally-sourced ingredients. Is there a specific dish you're interested in?",
  "Our delivery time is typically 45 minutes or less. Would you like me to help you place an order?",
  "We offer vegetarian, vegan, and gluten-free options. You can find these marked on our menu page. What dietary preferences do you have?",
  "That sounds delicious! Would you like me to add that to your cart or do you have any questions about ingredients?",
  "Our chefs put a lot of love into every dish. Is there anything specific I can help you with today?",
  "Great choice! That's one of our customer favorites. Would you like to add any sides or drinks to your order?",
];

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! Welcome to Home Kitchen Delivers! I'm here to help you find the perfect home-cooked meal. How can I assist you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-warm-orange to-[hsl(25_70%_65%)] hover:shadow-lg transform hover:scale-110 transition-all duration-300 text-white"
        >
          {isOpen ? "✕" : "💬"}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]">
          <Card className="h-full flex flex-col bg-background shadow-2xl border-warm-orange/20">
            <CardHeader className="bg-gradient-to-r from-warm-orange to-[hsl(25_70%_65%)] text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  👨‍🍳
                </div>
                <div>
                  <h3 className="font-semibold">Kitchen Assistant</h3>
                  <p className="text-xs text-white/80">Here to help with your order</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.sender === "user"
                          ? "bg-warm-orange text-white"
                          : "bg-sage-green/20 text-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-sage-green/20 text-foreground p-3 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-warm-orange rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-warm-orange rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-warm-orange rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our menu..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    variant="default"
                    size="sm"
                    className="bg-warm-orange hover:bg-warm-orange/90"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};