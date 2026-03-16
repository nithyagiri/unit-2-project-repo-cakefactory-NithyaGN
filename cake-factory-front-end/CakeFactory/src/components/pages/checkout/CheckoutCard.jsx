const CheckoutCard = ({ item, handleEdit, handleDelete }) => {
    return (
        <div className="checkout-card">
            <img
                src={item.getImageURL()}
                className="checkout-img"
                alt={item.cakeName}
            />

            <div className="checkout-details">
                <h3 className="cake-name">{item.cakeName}</h3>
                <ul>
                    {item.selectedSize && <li><p><b>Size:</b> {item.selectedSize}</p></li>}
                    {item.selectedFlavour && <li><p><b>Flavour:</b> {item.selectedFlavour}</p></li>}
                    {item.selectedFilling && <li><p><b>Filling:</b> {item.selectedFilling}</p></li>}
                    {item.message && <li><p><b>Message:</b> {item.message}</p></li>}
                </ul>
            </div>

            <div>
                <p>{item.quantity}</p>
            </div>

            <div className="checkout-price">
                <p>{item.getFormattedPrice()}</p>
            </div>

            <div>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
        </div>
    );
};
export default CheckoutCard;