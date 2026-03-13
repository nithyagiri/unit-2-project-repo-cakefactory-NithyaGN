import { createContext, useState, useContext, useEffect} from 'react';
import Cakes from '../class/Cakes.js';
import Cart from '../class/Cart.js';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    //User state
    const [currentUser, setCurrentUser] = useState(null);

    // Cake states
    const [allCakes, setAllCakes] = useState(null);
    const [currentCakes, setCurrentCakes] = useState(null);

    //Cart States
    const [cartItems, setCartItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(false);

    
    // FETCH ALL CAKES
    const fetchCakes = async () => {
        const cakes = [];
        try{
            const response = await fetch("http://localhost:8080/api/cakes");
    
            if (!response.ok) {
                const errorData= await response.json();
                throw new Error(errorData.message || 'ERROR - Status ${response.status}');
            }else{
                const data = await response.json();
        
                data.forEach(cake => {
                    let newCake = new Cakes(
                        cake.id,
                        cake.name,
                        cake.description,
                        cake.price,
                        cake.customization,
                        cake.category,
                        cake.image_id,
                        cake.sizes,
                        cake.flavors,
                        cake.fillings,
                        cake.canWriteMessage
                    );
                    cakes.push(newCake);
                });
            }   
            } catch (error) {
                console.error(error.message);
            } finally {
                setAllCakes(cakes);
                setCurrentCakes(cakes);
            }
         };
    
    // FETCH CART CAKES
    const fetchCart = async (userId) => {
        setIsCartLoading(true);
        const carts = [];
        try{
            const response = await fetch(`http://localhost:8080/api/cart/user/${userId}`);
    
            if (!response.ok) {
                setCartItems([]);
                setGrandTotal(0);
                const errorData= await response.json();
                throw new Error(errorData.message || 'ERROR - Status ${response.status}');
            }else{
                const data = await response.json();
        
                data.cartItems.forEach(item => {
                let newCart = new Cart(
                    item.id,
                    item.userId,
                    item.cakeId,
                    item.cakeName,
                    item.cakeImage,
                    item.quantity,
                    item.selectedSize,
                    item.selectedFlavour,
                    item.selectedFilling,
                    item.message,
                    item.price,
                    item.status
                );
                carts.push(newCart);
                });
                setCartItems(carts);
                setGrandTotal(data.grandTotal);
            }   
            } catch (error) {
                console.error(error.message);
                setCartItems([]);
                setGrandTotal(0);
            } finally {
                setIsCartLoading(false);
            }
        };

    // CLEAR CART
    const clearCart = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/checkout/${userId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to checkout');
            }

            // Refresh the cart to update the grand total and items list to 0
            await fetchCart(userId);
            
        } catch (error) {
            console.error("Clear Cart Error:", error.message);
        }
    };
 
    // INITIAL FETCH on mount   
    useEffect(() => {
        fetchCakes();
        //fetchCart();
    }, []);

    useEffect(() => {
    if (currentUser?.id) {
        fetchCart(currentUser.id);
    }
}, [currentUser]);

    // SET LOADING FALSE when cakes are loaded
    useEffect(() => {
        if (allCakes !== null) {
            setIsLoading(false);
        }
    }, [allCakes]);

    return (
        <DataContext.Provider
            value={{isLoading, allCakes, currentCakes, setCurrentCakes, fetchCakes,
                cartItems, setCartItems, grandTotal, isCartLoading, fetchCart,
                clearCart,
                currentUser,setCurrentUser,
            }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        console.error("useData must be used within a DataProvider");
    }
    return context;
};
