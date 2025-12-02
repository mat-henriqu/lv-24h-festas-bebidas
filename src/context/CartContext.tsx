import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartContextType, CartItem, Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Carregar carrinho ao iniciar (localStorage ou Firestore)
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // Salvar carrinho sempre que mudar
  useEffect(() => {
    saveCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const loadCart = async () => {
    if (user?.uid) {
      // Se logado, buscar do Firestore
      try {
        const cartDoc = await getDoc(doc(db, 'carts', user.uid));
        if (cartDoc.exists()) {
          setItems(cartDoc.data().items || []);
        } else {
          // Se não tem no Firestore, pegar do localStorage e sincronizar
          const localCart = localStorage.getItem('lv-cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setItems(parsedCart);
            // Salvar no Firestore
            await setDoc(doc(db, 'carts', user.uid), {
              userId: user.uid,
              items: parsedCart,
              updatedAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho do Firestore:', error);
        // Fallback para localStorage
        const localCart = localStorage.getItem('lv-cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        }
      }
    } else {
      // Se não logado, usar localStorage
      const savedCart = localStorage.getItem('lv-cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    }
  };

  const saveCart = async () => {
    // Sempre salvar no localStorage
    localStorage.setItem('lv-cart', JSON.stringify(items));

    // Se logado, salvar também no Firestore
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          userId: user.uid,
          items,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Erro ao salvar carrinho no Firestore:', error);
      }
    }
  };

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('lv-cart');
    
    // Se logado, limpar também do Firestore
    if (user?.uid) {
      setDoc(doc(db, 'carts', user.uid), {
        userId: user.uid,
        items: [],
        updatedAt: new Date(),
      }).catch(error => {
        console.error('Erro ao limpar carrinho no Firestore:', error);
      });
    }
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
