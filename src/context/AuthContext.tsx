import React, { createContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, AuthContextType } from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário do Firestore
  const loadUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      return null;
    }
  };

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        const userData = await loadUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Registrar novo usuário
  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Criar documento do usuário no Firestore
      const userData: User = {
        uid,
        email,
        name,
        phone,
        role: 'user', // Padrão é usuário comum
        createdAt: serverTimestamp() as unknown as Timestamp,
        orders: []
      };

      await setDoc(doc(db, 'users', uid), userData);
      
      // Atualizar estado local
      setUser(userData);
    } catch (error: unknown) {
      console.error('Erro ao registrar:', error);
      const err = error as { code?: string; message?: string };
      
      // Traduzir erros comuns
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está em uso');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await loadUserData(userCredential.user);
      
      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }
      
      setUser(userData);
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      const err = error as { code?: string; message?: string };
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Email ou senha incorretos');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }
      
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao sair. Tente novamente.');
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      
      // Atualizar estado local
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
