import { useNavigate } from "react-router";
import mockCake from "../../../test-data/mockCake";
import CheckoutCard from "./CheckoutCard";
import  "./checkout.css";

  const CheckoutPage = ({cart, setCart,setEditingItemId, setSelectedCake, setOrderTotal }) =>{
    const navigate =useNavigate();

    
  // Editing a cart item: populating OrderPage form with selected item's data
    const handleEdit = (item) => {
    setEditingItemId(item.id);
    const fullCake = mockCake.find( cake => cake.id === item.originalCakeId); // getting cake data from mockdata
    setSelectedCake({
        ...fullCake,
        size:item.size,
        flavour:item.flavour,
        filling:item.filling,
        message:item.message
     } );
     navigate('/order');   
  };
  
  // Remove item from cart 
    const handleDelete = (id) => {
          setCart(cart.filter(item => item.id !== id));
    };

  // Calculate total price of all items in cart   
    const CalculateTotal =()=>{
        return cart.reduce((sum, item) => 
            {
               let extra = 0;
               if (item.sizePrice) extra += item.sizePrice;
               if (item.fillingPrice) extra += item.fillingPrice;
                   return (sum + item.basePrice + extra);
            }, 0);
    };

  // Calculate total price for a single cake item 
    const getCakeTotal = (item) => {
           const extras = (item.sizePrice || 0) + (item.fillingPrice || 0);
           return  Number(((item.basePrice + extras) * item.quantity).toFixed(2));
};
    return(
        <div className ="checkout-container">
            <div className ="checkout-lft">
            <div className="checkout-header">
            <span>Product       Description</span>
            <span>Quantity</span>
            <span>Price</span>
            </div>

                {cart.length === 0 ? (<p>Your Cart is empty.</p>) : (
                    cart.map((item) =>(
                        <CheckoutCard
              key={item.id}
              item={item}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getCakeTotal={getCakeTotal}
            /> 
                    ))
                )}
            </div>
            <div className="checkout-summary">
                <h2> Order Summary</h2>
                <p><b> Order Total:</b>${CalculateTotal()}</p>
                <button className="common-btn" 
                        disabled={cart.length === 0}
                        onClick={() =>{ 
                          const total = CalculateTotal(); 
                          setOrderTotal(total);         
                          navigate('/payment')}}
                >Checkout 
                </button> 
                <button className="continue-btn"  onClick={() => { navigate("/shop")}}> Continue Shopping </button>
            </div>
        </div>    
    );
};
export default CheckoutPage;