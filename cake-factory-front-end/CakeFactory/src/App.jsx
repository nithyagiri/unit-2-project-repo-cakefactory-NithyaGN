import { useState } from 'react';
import { Routes, Route } from 'react-router';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ShopPage from './components/pages/cakes/ShopPage.jsx';
import HomePage from './components/pages/home/HomePage.jsx';
import ContactPage from './components/pages/contact/ContactPage.jsx';
import LoginPage from './components/pages/login/Login.jsx';
import OrderPage from './components/pages/order/OrderPage.jsx';
import CheckoutPage from './components/pages/checkout/CheckoutPage.jsx';
import PaymentPage from './components/pages/payment/PaymentPage.jsx';
import { DataContextProvider } from './context/DataContext.jsx';

function App() {
  const [orderTotal, setOrderTotal] = useState(0);  // ← keep only this

  return (
    <div id="body-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage setOrderTotal={setOrderTotal} />} />
          <Route path="/payment" element={<PaymentPage total={orderTotal} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppWithContext() {
  return (
    <DataContextProvider>
      <App />
    </DataContextProvider>
  );
}

export default AppWithContext;