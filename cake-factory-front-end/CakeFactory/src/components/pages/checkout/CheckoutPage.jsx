import { useEffect } from "react";  // ← add useEffect
import { useNavigate } from "react-router";
import { useData } from '../../../context/DataContext.jsx';
import CheckoutCard from "./CheckoutCard";
import "./checkout.css";

const CheckoutPage = ({ setOrderTotal }) => {
    const navigate = useNavigate();
    const { cartItems, grandTotal, fetchCart, currentUser } = useData();

    // ← add this — fetch cart when page loads
    useEffect(() => {
        fetchCart(currentUser?.id || 1);  // ← fallback to 1 for testing
    }, []);

    // ── Edit a cart item ──
    const handleEdit = (item) => {
        navigate('/order', { state: { cakeId: item.cakeId } });
    };

    // ── Delete a cart item ──
    const handleDelete = async (cartItemId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${cartItemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();  // ← fix: text() not json()
                throw new Error(errorText || `ERROR - Status ${response.status}`);
            } else {
                fetchCart(currentUser?.id || 1);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // ── Checkout ──
    const handleCheckout = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/checkout/${currentUser?.id || 1}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();  // ← fix: text() not json()
                throw new Error(errorText || `ERROR - Status ${response.status}`);
            } else {
                setOrderTotal(grandTotal);
                navigate('/payment');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-lft">
                <div className="checkout-header">
                    <span>Product Description</span>
                    <span>Quantity</span>
                    <span>Price</span>
                </div>

                {cartItems.length === 0 ? (
                    <p>Your Cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <CheckoutCard
                            key={item.id}
                            item={item}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <div className="checkout-summary">
                <h2>Order Summary</h2>
                <p><b>Order Total:</b> ${grandTotal}</p>
                <button
                    className="common-btn"
                    disabled={cartItems.length === 0}
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
                <button
                    className="continue-btn"
                    onClick={() => navigate("/shop")}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;