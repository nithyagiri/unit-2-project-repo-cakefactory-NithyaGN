  const CheckoutCard = ({ item, handleEdit, handleDelete, getCakeTotal }) => {
  return (                  
                    <div className="checkout-card" key ={item.id} >
                            <img src ={"https://i.ibb.co/" + item.imageId} className="checkout-img" alt ={item.name}/> 
                        <div className="checkout-details"> 
                        <h3 className="cake-name">{item.name}</h3>
                        <ul>
                            {item.size && <li><p><b>Size:</b> {item.size}</p></li>}
                            {item.flavour && <li><p><b>Flavour:</b> {item.flavour}</p></li>}
                            {item.filling && <li><p><b>Filling:</b> {item.filling}</p></li>}
                            {item.message && <li><p><b>Message:</b> {item.message}</p></li>}
                        </ul> 
                        
                        </div>    
                        <div >
                            <p>{item.quantity}</p>   
                        </div>
                        <div className="checkout-price">
                            <p>${getCakeTotal(item)}  </p>    
                        </div> 
                        <div>  
                            <button onClick={() => { handleEdit(item)}}>Edit  </button>     
                            <button onClick={() => { handleDelete(item.id)}}>Delete</button>
                        </div> 
                    </div> 
        );
    }  
    export default CheckoutCard;