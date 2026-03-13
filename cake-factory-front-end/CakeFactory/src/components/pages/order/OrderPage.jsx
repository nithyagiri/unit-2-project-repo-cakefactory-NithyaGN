import { useNavigate, useLocation } from "react-router";
import { useData } from '../../../context/DataContext';
import AddToCartForm from './AddToCartForm.jsx';
import "./order.css"; 


const OrderPage = () => {
  const navigate = useNavigate();
  const location= useLocation();
  const { allCakes, isLoading } = useData();


  // Get cakeId passed via navigation state
  const cakeId = location.state?.cakeId;
  const cartItemId = location.state?.cartItemId || null;
  const existingData = location.state?.existingData || null;

  const isEditMode = !!cartItemId;

  const cake = allCakes?.find((c) => c.id === cakeId) || null;

  if (isLoading) {
    return <p> Loading...</p>;
  }

  // Return early if no cake is selected
   if (!cake) {
    return (
      <div>
        <h2>No Cake Selected</h2>
        <p>Please return to the Shop page and select a cake.</p>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  const getImageURL = () => {
    return "https://i.ibb.co/" + cake.image_id;
  };

  return (
    <div className="order-container">
      <div className="order-card">

        {/* LEFT IMAGE */}
        <div className="order-image-box">
          <img
            className="order-image"
            src={getImageURL()}
            alt={`Image of ${cake.name}`}
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="order-details">
          <h1 className="order-title">{cake.name}</h1>
          <p className="order-price">${cake.price}</p>
          <p className="order-description">{cake.description}</p>
             <h2>{isEditMode ? 'Edit Your Order' : 'Place Your Order'}</h2>
                    <AddToCartForm
                        cake={cake}
                        cartItemId={cartItemId}
                        existingData={existingData}
                        onEditSuccess={() => navigate('/checkout')}
                    />
          </div>
      </div>
    </div>
  );
};

export default OrderPage;