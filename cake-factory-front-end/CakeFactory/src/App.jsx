import { Routes, Route, Navigate } from 'react-router';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ShopPage from './components/pages/cakes/ShopPage.jsx';
import HomePage from './components/pages/home/HomePage.jsx';
import ContactPage from './components/pages/contact/ContactPage.jsx';
import LoginPage from './components/pages/login/Login.jsx';
import OrderPage from './components/pages/order/OrderPage.jsx';
import CheckoutPage from './components/pages/checkout/CheckoutPage.jsx';
import PaymentPage from './components/pages/payment/PaymentPage.jsx';
import { DataContextProvider, useData } from './context/DataContext.jsx';

function App() {
  const {currentUser}= useData(); 
 
  return (
    <div id="body-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order" element={<OrderPage/>} />
          <Route path="/checkout" element={currentUser ? <CheckoutPage /> : <Navigate to="/login" state={{ redirectTo: '/checkout' }} />} />
          <Route path="/payment" element={currentUser ? <PaymentPage /> : <Navigate to="/login" state={{ redirectTo: '/payment' }} />} />
          <Route path="/contact" element={<ContactPage />} />
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