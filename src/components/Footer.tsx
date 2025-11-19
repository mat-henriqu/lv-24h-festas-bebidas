import logo from "@/assets/lv-logo.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="LV Distribuidora" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              LV DISTRIBUIDORA 24 HORAS
            </h3>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Rua Inhambu-Xintã, 75 - Pequis
            </p>
          </div>

          {/* Social/Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">Sobre Nós</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Produtos</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Contato</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Promoções</span>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border w-full text-center">
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
              © {currentYear} LV Distribuidora. Todos os direitos reservados. 
              <span className="block mt-1 text-xs">Beba com moderação. Venda proibida para menores de 18 anos.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
