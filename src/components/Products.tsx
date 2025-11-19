import { Card, CardContent } from "@/components/ui/card";
import {  Beer, Sparkles, Coffee, Zap, Droplets, IceCream } from "lucide-react";
import { Button } from "@/components/ui/button";
import copaoImage from "@/assets/copao-whisky.png";

const products = [
  {
    icon: Beer,
    title: "Cervejas",
    description: "Nacionais e importadas, sempre trincando de gelada",
    emoji: "🍺",
    color: "from-primary to-secondary"
  },
  {
    icon: Sparkles,
    title: "Whisky",
    description: "Old Par, Red Label, Jack Daniels e mais",
    emoji: "🥃",
    color: "from-secondary to-party-purple"
  },
  {
    icon: Zap,
    title: "Energéticos",
    description: "Red Bull, Monster, TNT Energy e outros",
    emoji: "⚡",
    color: "from-party-red to-primary"
  },
  {
    icon: Coffee,
    title: "Copão",
    description: "Energético com gin ou whisky - a mistura perfeita!",
    emoji: "🍹",
    color: "from-party-purple to-primary"
  },
  {
    icon: IceCream,
    title: "Gelo Saborizado",
    description: "Limão, morango, maracujá e mais sabores",
    emoji: "🧊",
    color: "from-primary to-secondary"
  },
  {
    icon: Droplets,
    title: "Águas",
    description: "Mineral, com gás e saborizada",
    emoji: "💧",
    color: "from-secondary to-party-purple"
  },
  {
    icon: Coffee,
    title: "E Muito Mais",
    description: "Refrigerantes, sucos, petiscos e acompanhamentos",
    emoji: "🛒",
    color: "from-party-purple to-primary"
  }
];

const Products = () => {
  return (
    <section id="produtos" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            NOSSOS PRODUTOS
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Uma seleção completa para sua festa ser inesquecível!
          </p>
        </div>

        {/* Destaque Copão */}
        <div className="mb-16">
          <Card className="max-w-5xl mx-auto overflow-hidden border-4 border-primary shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-shine"></div>
            <CardContent className="p-0 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="p-8 md:p-12 space-y-6">
                  <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold animate-glow-pulse">
                    🔥 DESTAQUE DA CASA
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    COPÃO 700ML
                  </h3>
                  <p className="text-lg text-foreground font-semibold">
                    A combinação perfeita para sua festa! 🍹
                  </p>
                  <p className="text-muted-foreground">
                    Nosso famoso Copão de 700ml vem com energético gelado, sua escolha de whisky ou gin, 
                    e gelo saborizado. A mistura ideal para começar ou manter a festa animada! 
                    Energia + sabor + diversão em um único copão!
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <div className="bg-card border border-primary/30 px-4 py-2 rounded-lg">
                      <span className="text-sm text-muted-foreground">⚡ Energético</span>
                    </div>
                    <div className="bg-card border border-primary/30 px-4 py-2 rounded-lg">
                      <span className="text-sm text-muted-foreground">🥃 Whisky ou Gin</span>
                    </div>
                    <div className="bg-card border border-primary/30 px-4 py-2 rounded-lg">
                      <span className="text-sm text-muted-foreground">🧊 Gelo de Sabor</span>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                    onClick={() => {
                      const whatsappNumber = "5511999999999";
                      const message = encodeURIComponent("Olá! Gostaria de pedir um Copão 700ml 🍹");
                      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                    }}
                  >
                    Peça seu Copão Agora
                  </Button>
                </div>
                <div className="relative h-64 md:h-full bg-gradient-to-br from-muted to-background flex items-center justify-center overflow-hidden">
                  <img 
                    src={copaoImage} 
                    alt="Copão 700ml - Energético com Whisky ou Gin e Gelo Saborizado" 
                    className="w-full h-full object-contain animate-float p-4"
                  />
                  <div className="absolute inset-0 bg-primary/10 blur-3xl"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card 
                key={index} 
                className="group border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card/80 backdrop-blur-sm overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-6 text-center space-y-3 relative z-10">
                  <div className="relative inline-block">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 animate-float">
                      {product.emoji}
                    </div>
                    <Icon className="w-6 h-6 text-primary absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <p className="text-lg md:text-xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                🎊 Promoções especiais todos os dias! 🎊
              </p>
              <p className="text-muted-foreground">
                Entre em contato pelo WhatsApp e confira nossas ofertas exclusivas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Products;
