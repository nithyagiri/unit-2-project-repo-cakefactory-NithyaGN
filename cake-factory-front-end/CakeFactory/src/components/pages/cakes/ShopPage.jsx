import CakeCard from "./CakeCard";
import { useNavigate } from "react-router";
import "./shop.css"
const ShopPage =({cakes, setSelectedCake}) => 
  {
   const navigate = useNavigate();
   const handleSelectCake = (cake) => {
    setSelectedCake(cake);
    navigate ('/order');
  };
  let cakeJSX=[...cakes].map(cake=>{
    return <CakeCard key={cake.id} 
                     cake ={cake} 
                     onSelect={handleSelectCake}/>
  });
    return(
      <main className="main-content">
      <h1>All Occasion Cakes and Cupcakes</h1>
      {cakes.length ? (
              <div id="cake-card-container">
                 {cakeJSX}
              </div>):( 
                        <p> We're sorry, there are no cakes to order at  this time. Please visit again. 
                            Thank you for visiting our site. </p>
                      )
      }
    </main>
    );
};
export default ShopPage;
 