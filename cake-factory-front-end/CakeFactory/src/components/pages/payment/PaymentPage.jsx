import { useState } from "react";
import { useNavigate } from "react-router";
import { useData } from "../../../context/DataContext";
import InputErrorMessage from '../../common/InputErrorMessage.jsx';
import "./payment.css";
 
// Local state for payment form inputs
const PaymentPage = () => {
  const navigate = useNavigate();
  const {clearCart, currentUser, grandTotal} = useData();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
   const [submitError, setSubmitError] = useState("");
  
   // Determine card brand based on starting digit
  const getCardBrand = () => {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "American Express";
    return "Card";
  };

   // Handle payment form submission
  const handlePayment = async(e) => {
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
    setSubmitError("");

    // Missing user is handled before calling clearCart
    if (!currentUser?.id) {
      setSubmitError("You must be logged in to complete payment.");
      return;
    }
    try {
      await clearCart(currentUser.id);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setSubmitError("Payment could not be completed. Please try again.");
    }
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
          maxLength="25"
           onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
          autoComplete="cc-name"
        />
        <InputErrorMessage hasError={!!errors.cardName} msg={errors.cardName} />

        <label>Card Number</label>
        <input
          maxLength="16"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          autoComplete="cc-number"
        />
        <InputErrorMessage hasError={!!errors.cardNumber} msg={errors.cardNumber} />

        <div className="row">
          <div className="col">
            <label>Expiry</label>
            <input
              placeholder="MM/YY"
              maxLength="5"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              autoComplete="cc-exp"
            />
            <InputErrorMessage hasError={!!errors.expiry} msg={errors.expiry} />
          </div>

          <div className="col">
            <label>CVV</label>
            <input
              type="password"
              maxLength="3"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              autoComplete="cc-csc"
            />
            <InputErrorMessage hasError={!!errors.cvv} msg={errors.cvv} />
          </div>
        </div>
        
         <h3><center>Total: ${grandTotal != null ? Number(grandTotal).toFixed(2) : "0.00"}</center></h3>
        <button type="submit" className="common-btn">Pay Now</button>
      </form>

      <button className="back-button" onClick={() => navigate('/checkout')}>
        ← Back to Checkout
      </button>
    </div>
  );
};

export default PaymentPage;