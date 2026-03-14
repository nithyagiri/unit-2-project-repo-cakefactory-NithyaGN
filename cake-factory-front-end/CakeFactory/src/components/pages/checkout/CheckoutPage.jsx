import { useEffect } from "react";  // ← add useEffect
import { useNavigate } from "react-router";
import { useData } from '../../../context/DataContext.jsx';
import CheckoutCard from "./CheckoutCard";
import "./checkout.css";

const CheckoutPage = ({ setOrderTotal }) => {
    const navigate = useNavigate();
    const { cartItems, grandTotal, fetchCart, currentUser } = useData();

    // fetch cart when page loads
    useEffect(() => {
        fetchCart(currentUser?.id);  // ← fallback to 1 for testing
    }, []);

     // Edit a cart item
    const handleEdit = (item) => {
        navigate('/order', {
            state: {
                cakeId: item.cakeId,
                cartItemId: item.id,
                existingData: {
                    selectedSize: item.selectedSize,
                    selectedFlavour: item.selectedFlavour,
                    selectedFilling: item.selectedFilling,
                    quantity: item.quantity,
                    message: item.message,
                },
            },
        });
    };

    // Delete a cart item
    const deleteCartItem = async (cartItemId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${cartItemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `ERROR - Status ${response.status}`);
            } else {
                fetchCart(currentUser?.id);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Delete with confirm dialog
    const handleDelete = (id) => {
        let confirmed = confirm(`
            Are you sure to delete this item from your cart?
            
            Cake: ${cartItems.find((c) => c.id === id)?.cakeName}
        `);
        if (confirmed) {
            deleteCartItem(id);
        }
    };
    
    // Checkout the cart
    const handleCheckout = async () => {
                setOrderTotal(grandTotal);
                navigate('/payment');
    };

    // ── Build JSX ──
    const cartItemsJSX = cartItems.map((item) => (
        <CheckoutCard
            key={item.id}
            item={item}
            handleEdit={() => handleEdit(item)}
            handleDelete={() => handleDelete(item.id)}
        />
    ));

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
                    cartItemsJSX
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