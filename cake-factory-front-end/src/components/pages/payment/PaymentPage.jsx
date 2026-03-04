import { useState } from "react";
import "./payment.css";
import { useNavigate } from "react-router";
 
// Local state for payment form inputs
const PaymentPage = ({ total, setCart }) => {
  const navigate = useNavigate();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
   // Determine card brand based on starting digit
  const getCardBrand = () => {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "American Express";
    return "Card";
  };

   // Handle payment form submission
  const handlePayment = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!cardName.trim()) newErrors.cardName = "Card holder name is required";
    if (cardNumber.length < 16) newErrors.cardNumber = "Card number must be 16 digits";
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
         newErrors.expiry = "Enter expiry in MM/YY format";
        } 
        else {
         const [mm, yy] = expiry.split("/").map(Number);
         const currentDate = new Date();
         const currentYear = currentDate.getFullYear() % 100; // last two digits
         const currentMonth = currentDate.getMonth() + 1;
        if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
           newErrors.expiry = "Card has expired";
            }
        }
    if (cvv.length < 3) newErrors.cvv = "CVV must be 3 digits";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowSuccess(true);
    setCart([]);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">💳 Secure Payment</h2>

      {showSuccess && (
        <div className="payment-success">
          <h2>🎉 Payment Successful!</h2>
          <p>Your delicious cake order is confirmed.</p>
        </div>
      )}

      {/* Card Preview */}
      <div className="card-preview">
        <div className="chip"></div>
        <p className="card-brand">{getCardBrand()}</p>
        <p className="card-number-preview">
          {cardNumber
            ? cardNumber.replace(/(\d{4})/g, "$1 ").trim()
            : "•••• •••• •••• ••••"}
        </p>
        <div className="card-bottom">
          <p>{cardName || "CARD HOLDER"}</p>
          <p>{expiry || "MM/YY"}</p>
        </div>
      </div>

      {/* Payment Form */}
      <form className="payment-form" onSubmit={handlePayment}>
        <label>Name on Card</label>
        <input
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        {errors.cardName && <div className="error">{errors.cardName}</div>}

        <label>Card Number</label>
        <input
          maxLength="16"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
        />
        {errors.cardNumber && <div className="error">{errors.cardNumber}</div>}

        <div className="row">
          <div className="col">
            <label>Expiry</label>
            <input
              placeholder="MM/YY"
              maxLength="5"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            {errors.expiry && <div className="error">{errors.expiry}</div>}
          </div>

          <div className="col">
            <label>CVV</label>
            <input
              type="password"
              maxLength="3"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            />
            {errors.cvv && <div className="error">{errors.cvv}</div>}
          </div>
        </div>

         <h3><center>Total: ${total}</center></h3>
        <button type="submit" className="common-btn">Pay Now</button>
      </form>

      <button className="back-button" onClick={() => navigate('/checkout')}>
        ← Back to Checkout
      </button>
    </div>
  );
};

export default PaymentPage;