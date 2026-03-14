import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import HomeImage from '../../../images/Home.jpeg';
import { useData } from '../../../context/DataContext';
import "./home.css";

const HomePage = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [surpriseCake, setSurpriseCake] = useState(null);

    // use real cake data from DataContext
    const { allCakes, isLoading, currentUser } = useData();

    const navigate = useNavigate();

    const handleSurpriseMe = () => {
        //check if cakes are loaded
        if (!allCakes || allCakes.length === 0) return;

        setIsSpinning(true);
        setSurpriseCake(null);

        setTimeout(() => {
            //pick random cake from real data
            const randomCake = allCakes[Math.floor(Math.random() * allCakes.length)];
            setSurpriseCake(randomCake);
            setIsSpinning(false);
        }, 1200);
    };

    const goToOrder = () => {
        setIsSpinning(false);
        if(!currentUser){
            navigate('/login')
        }else{
        navigate('/order', { state: { cakeId: surpriseCake.id } });
        }
};

    return (
        <main>
            <div className="home-top-section">
                <div className="about-text">
                    <h1>Welcome!</h1>
                    <p>
                        At Cake Factory, every cake tells my story. I am a passionate baker who has
                        dedicated years to perfecting the art of baking, combining flavors, textures,
                        and designs to create cakes that delight both the eyes and the taste buds.
                        My love for baking has led me to experiment with countless recipes and styles,
                        and my creations have been recognized for their creativity and attention to detail.
                    </p>
                    <p>
                        I make it easy for you to bring your cake vision to life. You can browse my{' '}
                        <Link className="link-like" to="/shop">
                            collection of cakes
                        </Link>
                        {' '}and personalize them exactly as you like—choose the flavor, size, frosting,
                        decorations, and even add a custom message. Placing an order is simple, and you
                        can update delivery details, add a new order, or cancel an existing one anytime,
                        giving you full control over your sweet creations.
                    </p>
                    <p>
                        With Cake Factory, I combine my passion, creativity, and dedication to deliver
                        more than just a cake—I deliver a memorable experience. Each cake is crafted with
                        care and attention to detail, ensuring that it is not only delicious but also a
                        beautiful centerpiece for your special moments. Cake Factory isn't just an app —
                        it's a celebration of flavor, creativity, and connection. Download today and turn
                        your next occasion into something unforgettable.
                    </p>
                </div>

                <div className="surprise-column">
                    <button
                        className="common-btn"
                        onClick={handleSurpriseMe}
                        // disable button while loading
                        disabled={isLoading}>
                        {isLoading ? '⏳ Loading cakes...' : '🎁 Click to generate random cakes!'}
                    </button>

                    {/*spinning animation while selecting */}
                    {isSpinning && (
                        <div className="surprise-container">
                            <p>🎂 Finding your perfect cake...</p>
                        </div>
                    )}

                    {/*show surprise cake from real data */}
                    {surpriseCake && !isSpinning && (
                        <div className="surprise-container">
                            <img
                                src={"https://i.ibb.co/" + surpriseCake.image_id}  // image_id from Cake class
                                className="float-glow"
                                alt={surpriseCake.name}                            
                            />
                            <h3>{surpriseCake.name}</h3>
                            <p>{surpriseCake.getFormattedPrice()}</p>              
                            <button className="common-btn" onClick={goToOrder}>
                                {currentUser ? 'Order Now' : 'Login to Order'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="home-bottom-image">
                <img src={HomeImage} width="100%" alt="Cake image welcome page" />
            </div>
        </main>
    );
};

export default HomePage;
