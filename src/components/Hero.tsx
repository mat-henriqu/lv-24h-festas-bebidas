import { Button } from "@/components/ui/button";
import { Phone, Clock, MapPin, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import logo from "@/assets/lv-logo.jpeg";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const whatsappNumber = "5511999999999"; // Adicione o número real aqui
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido na LV Distribuidora 24h");

  const handleOrderClick = () => {
    if (user) {
      navigate('/loja');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-float">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="LV Distribuidora 24 Horas" 
                  className="h-40 md:h-56 w-auto object-contain drop-shadow-2xl mt-3"
                />
                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 animate-glow-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary drop-shadow-lg animate-fade-in" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                LV DISTRIBUIDORA
              </h1>
              <div className="flex items-center justify-center gap-3 text-2xl md:text-4xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Clock className="w-8 h-8 md:w-12 md:h-12 text-primary" />
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  24 HORAS
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s", fontFamily: "'Poppins', sans-serif" }}>
              Suas bebidas favoritas, sempre geladas, entregues rapidinho! 🍺🎉
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                onClick={handleOrderClick}
              >
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {user ? 'Fazer Pedido Online' : 'Entrar e Fazer Pedido'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 font-bold border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-xl transition-all duration-300"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>

            {/* Location */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground animate-fade-in pt-4" style={{ animationDelay: "0.8s" }}>
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Rua Inhambu-Xintã, 75 - Pequis</span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 animate-fade-in" style={{ animationDelay: "1s" }}>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-lg text-primary mb-2">Entrega Rápida</h3>
                <p className="text-sm text-muted-foreground">Receba suas bebidas em minutos!</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-2">❄️</div>
                <h3 className="font-bold text-lg text-primary mb-2">Sempre Geladas</h3>
                <p className="text-sm text-muted-foreground">Bebidas na temperatura ideal!</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-bold text-lg text-primary mb-2">Festa Garantida</h3>
                <p className="text-sm text-muted-foreground">Variedade para todos os gostos!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
