import {useState} from 'react';
import { Routes, Route } from 'react-router';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ShopPage from './components/pages/cakes/ShopPage.jsx';
import HomePage from './components/pages/home/HomePage.jsx';
import ContactPage from './components/pages/contact/ContactPage.jsx';
import LoginPage from './components/pages/login/Login.jsx';
import {mockCake} from './test-data/mockCake.js';
import OrderPage from './components/pages/order/OrderPage.jsx';
import CheckoutPage from './components/pages/checkout/CheckoutPage.jsx';
import PaymentPage from './components/pages/payment/PaymentPage.jsx';
import { DataContextProvider } from './context/DataContext.jsx';

function App() {
  const [selectedCake,setSelectedCake]=useState(null);
  const [cart, setCart] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
return(
  <div id="body-container">
    <Header />
    <main>
    <Routes>
     <Route path="/" element ={<HomePage />}/>
     <Route path="/shop" element={<ShopPage  />} />
     <Route path="/order" element={<OrderPage setCart={setCart} editingItemId={editingItemId} setEditingItemId={setEditingItemId}/>} />
     <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} setEditingItemId={setEditingItemId} setSelectedCake={setSelectedCake} setOrderTotal={setOrderTotal} />} />
     <Route path="/payment" element={<PaymentPage total={orderTotal} setCart={setCart} />} />     
     <Route path="/contact" element={<ContactPage />} />
     <Route path="/login" element={<LoginPage />} />
    </Routes>
    </main>
    <Footer />
  </div>
)
}
export default App



