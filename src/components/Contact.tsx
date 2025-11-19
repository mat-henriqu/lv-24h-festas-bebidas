import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const whatsappNumber = "5511999999999"; // Adicione o número real aqui
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido na LV Distribuidora 24h");
  
  const address = "Rua Inhambu-Xintã, 75 - Pequis";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            FALE CONOSCO
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Estamos prontos para atender você 24 horas por dia!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 bg-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Horário
              </h3>
              <p className="text-2xl font-bold text-foreground">24 HORAS</p>
              <p className="text-sm text-muted-foreground">Todos os dias da semana</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 bg-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Localização
              </h3>
              <p className="text-sm font-medium text-foreground">
                Rua Inhambu-Xintã, 75
              </p>
              <p className="text-sm text-muted-foreground">Pequis</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(mapsUrl, '_blank')}
              >
                Ver no Mapa
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 bg-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Contato
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Faça seu pedido agora pelo WhatsApp
              </p>
              <Button 
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary via-secondary to-primary border-none shadow-2xl">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-5xl font-black text-primary-foreground mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                PRONTO PARA A FESTA?
              </h3>
              <p className="text-lg text-primary-foreground/90 mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Faça seu pedido agora e receba suas bebidas geladinhas em minutos!
              </p>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 font-bold bg-background text-foreground hover:bg-background/90 border-2 hover:scale-105 transition-all duration-300"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')}
              >
                <Phone className="mr-2 h-6 w-6" />
                Pedir Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
