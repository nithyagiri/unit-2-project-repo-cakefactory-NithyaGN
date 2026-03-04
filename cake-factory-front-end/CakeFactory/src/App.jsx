import {useState} from 'react';
import { Routes, Route } from 'react-router';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ShopPage from './components/pages/cakes/ShopPage.jsx';
import HomePage from './components/pages/home/HomePage.jsx';
import ContactPage from './components/pages/contact/ContactPage.jsx';
import {mockCake} from './test-data/mockCake';
import OrderPage from './components/pages/order/OrderPage.jsx';
import CheckoutPage from './components/pages/checkout/CheckoutPage.jsx';
import PaymentPage from './components/pages/payment/PaymentPage.jsx';


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
     <Route path="/" element ={<HomePage setSelectedCake={setSelectedCake} />}/>
     <Route path="/shop" element={<ShopPage cakes= {mockCake} setSelectedCake={setSelectedCake}/>} />
     <Route path="/order" element={<OrderPage cake={selectedCake} setCart={setCart} editingItemId={editingItemId} setEditingItemId={setEditingItemId}/>} />
     <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} setEditingItemId={setEditingItemId} setSelectedCake={setSelectedCake} setOrderTotal={setOrderTotal} />} />
     <Route path="/payment" element={<PaymentPage total={orderTotal} setCart={setCart} />} />     
     <Route path="/contact" element={<ContactPage />} />
    </Routes>
    </main>
    <Footer />
  </div>
)
}
export default App
