import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { AccountView } from './components/AccountView';
import { AuthView } from './components/AuthView';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentView } = useStore();

  // 1. Tela de Entrada / Boas-Vindas da BCB Shoes
  if (currentView === 'welcome') {
    return (
      <>
        <WelcomeScreen />
        <ToastContainer />
      </>
    );
  }

  // 2. Painel Administrativo Protegido
  if (currentView === 'admin-panel') {
    return (
      <div className="min-h-screen bg-[#08080A]">
        <AdminPanel />
        <ToastContainer />
      </div>
    );
  }

  // 3. Login de Administrador
  if (currentView === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#08080A]">
        <AdminLogin />
        <ToastContainer />
      </div>
    );
  }

  // 4. Páginas da Loja Pública
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F3F4F6]">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-success' && <OrderSuccessView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'login' && <AuthView />}
      </main>

      <CartDrawer />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
