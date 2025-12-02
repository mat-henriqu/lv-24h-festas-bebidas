import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, ShoppingBag, LayoutDashboard, Package, Home, Clock, Beer, Ticket } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] shadow-xl border-b-4 border-yellow-500 sticky top-0 z-50">
      {/* Barra dourada superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Beer className="h-8 w-8 text-yellow-500 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight">
                LV DISTRIBUIDORA
              </span>
              <div className="flex items-center space-x-1 text-xs text-yellow-500/80">
                <Clock className="h-3 w-3" />
                <span className="font-semibold">24 HORAS</span>
              </div>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {user && (
              <>
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all ${
                      isActive('/') ? 'text-yellow-500 bg-yellow-500/10' : ''
                    }`}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Início
                  </Button>
                </Link>
                
                <Link to="/loja">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all ${
                      isActive('/loja') ? 'text-yellow-500 bg-yellow-500/10' : ''
                    }`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Loja
                  </Button>
                </Link>

                <Link to="/meus-pedidos">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all ${
                      isActive('/meus-pedidos') ? 'text-yellow-500 bg-yellow-500/10' : ''
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Meus Pedidos
                  </Button>
                </Link>

                {isAdmin && (
                  <>
                    <div className="h-6 w-px bg-yellow-500/30 mx-2"></div>
                    <Link to="/admin/dashboard">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all ${
                          isActive('/admin/dashboard') ? 'bg-yellow-500/20' : ''
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    
                    <Link to="/admin/pedidos">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all ${
                          isActive('/admin/pedidos') ? 'bg-yellow-500/20' : ''
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Pedidos
                      </Button>
                    </Link>
                    
                    <Link to="/admin/produtos">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all ${
                          isActive('/admin/produtos') ? 'bg-yellow-500/20' : ''
                        }`}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Produtos
                      </Button>
                    </Link>
                    
                    <Link to="/admin/cupons">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all ${
                          isActive('/admin/cupons') ? 'bg-yellow-500/20' : ''
                        }`}
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Cupons
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Menu / Login */}
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
                    size="sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                    {isAdmin && (
                      <span className="ml-2 px-2 py-0.5 bg-black/20 rounded text-xs">
                        ADMIN
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-[#1a1a1a] border-yellow-500/30">
                  <DropdownMenuLabel className="text-gray-300">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-yellow-500">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {isAdmin && (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold w-fit">
                          ADMINISTRADOR
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  
                  {/* Menu Mobile - Links Principais */}
                  <div className="md:hidden">
                    <DropdownMenuSeparator className="bg-yellow-500/20" />
                    <DropdownMenuItem 
                      onClick={() => navigate('/')}
                      className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Início
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/loja')}
                      className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Loja
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/meus-pedidos')}
                      className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Meus Pedidos
                    </DropdownMenuItem>
                  </div>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-yellow-500/20" />
                      <DropdownMenuLabel className="text-yellow-500 text-xs font-bold">
                        PAINEL ADMIN
                      </DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/dashboard')}
                        className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/pedidos')}
                        className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Gerenciar Pedidos
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/produtos')}
                        className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Gerenciar Produtos
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/cupons')}
                        className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Gerenciar Cupons
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-yellow-500/20" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barra dourada inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
    </nav>
  );
}
