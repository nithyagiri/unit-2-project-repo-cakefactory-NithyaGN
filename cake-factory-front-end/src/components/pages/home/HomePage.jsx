import {useState} from 'react';
import {Link, useNavigate} from "react-router";
import HomeImage from '../../../images/Home.jpeg';
import mockCake from '../../../test-data/mockCake';
import "./home.css";
import { Route } from 'react-router';

const HomePage =( {setSelectedCake}) =>{
    const [isSpinning, setIsSpinning] = useState(false);
    const [surpriseCake, setSurpriseCake] = useState(null);
    const handleSurpriseMe =() =>{
        setIsSpinning(true);
        setSurpriseCake(null);
        setTimeout(()=> {
            const randomCake = mockCake[Math.floor(Math.random() *mockCake.length)]
            setSurpriseCake(randomCake);
        },1200);
        };
        const navigate =useNavigate();
        const goToOrder =() =>{
            setIsSpinning(false);
            setSelectedCake(surpriseCake);
            navigate('/order');
        };
    return(
             <main>
            <div className="home-top-section">
                <div className ="about-text">
                     <h1>Welcome!</h1>
                <p>
                            At Cake Factory, every cake tells my story. I am a passionate baker who has dedicated years to perfecting the art of baking, combining flavors, textures, and designs to create cakes that delight both the eyes and the taste buds. My love for baking has led me to experiment with countless recipes and styles, and my creations have been recognized for their creativity and attention to detail.
                </p>
                <p>         I make it easy for you to bring your cake vision to life. You can browse my {' '}
                           <Link 
                              className="link-like" 
                              to="/shop">
                            collection of cakes 
                            </Link>
                            {''} and personalize them exactly as you like—choose the flavor, size, frosting, decorations, and even add a custom message. Placing an order is simple, and you can update delivery details, add a new order, or cancel an existing one anytime, giving you full control over your sweet creations.
                </p>
                <p>
                            With Cake Factory, I combine my passion, creativity, and dedication to deliver more than just a cake—I deliver a memorable experience. Each cake is crafted with care and attention to detail, ensuring that it is not only delicious but also a beautiful centerpiece for your special moments.Cake Factory isn’t just an app — it’s a celebration of flavor, creativity, and connection.Download today 
                    and turn your next occasion into something unforgettable.
                </p>
            </div>
             <div className="surprise-column">
          <button className="common-btn" onClick={handleSurpriseMe}>
            🎁 Click to generate random cakes!
          </button>

          {surpriseCake && (
            <div className="surprise-container">
              <img
                src={"https://i.ibb.co/" + surpriseCake.imageId}
                className={isSpinning ? "float-glow" : ""}
                alt="Surprise Cake"
              />
              <h3>{surpriseCake.name}</h3>
              <button className="common-btn" onClick={goToOrder}>
                Order Now
              </button>
            </div>
          )}
            </div>    
            </div>
            <div className ="home-bottom-image">
              <img src= {HomeImage} width="100%" alt="Cake image welcome page" /> 
            </div>
        </main>
    );
};
export default HomePage;

