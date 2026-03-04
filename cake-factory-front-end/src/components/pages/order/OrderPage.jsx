import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Select from "../../forms/input/Select.jsx";
import Input from "../../forms/input/Input.jsx";
import Button from "../../forms/input/Button.jsx";
import "./order.css"; 

const OrderPage = ({
  cake,
  setCart,
  editingItemId,
  setEditingItemId,
}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    size: "",
    flavour: "",
    filling: "",
    message: "",
  });
 // Initialize options based on cake customization
  let sizeOptions = [];
  let flavourOptions = [];
  let fillingOptions = [];
  let canWriteMessage = false;
  // Return early if no cake is selected
   if (!cake) {
    return (
      <div>
        <h2>No Cake Selected</h2>
        <p>Please return to the Shop page and select a cake.</p>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }
 // Setup options if customization is allowed
  if (cake.customization) {
    if (cake.customization.sizes) {
      sizeOptions = cake.customization.sizes.map((s) => ({
        label: `${s.label} (+$${s.addPrice})`,
        value: s.label,
        addPrice: s.addPrice,
      }));
    }

    if (cake.customization.flavors) {
      flavourOptions = cake.customization.flavors.map((f) => ({
        label: f.name,
        value: f.name,
      }));
    }

    if (cake.customization.fillings) {
      fillingOptions = cake.customization.fillings.map((f) => ({
        label: `${f.label} (+$${f.addPrice})`,
        value: f.label,
        addPrice: f.addPrice,
      }));
    }

    canWriteMessage = cake.customization.canWriteMessage || false;
  }

  // Auto-fill when editing cart item
  useEffect(() => {
    if (cake && editingItemId) {
      setForm({
        size: cake.size || "",
        flavour: cake.flavour || "",
        filling: cake.filling || "",
        message: cake.message || "",
      });
    }
  }, [cake, editingItemId]);

   // Calculate additional price for size or filling
  const getPrice = (type, value) => {
    if (!value) return 0;
    let option;

    switch (type) {
      case "size":
        option = sizeOptions.find((o) => o.value === value);
        break;
      case "filling":
        option = fillingOptions.find((o) => o.value === value);
        break;
      default:
        return 0;
    }
    return option?.addPrice || 0;
  };

  const handleSubmit = () => {
    const orderItem = {
      id: editingItemId || Date.now(),
      originalCakeId: cake.id,
      name: cake.name,
      basePrice: cake.price,
      size: form.size,
      flavour: form.flavour,
      filling: form.filling,
      message: form.message,
      sizePrice: getPrice("size", form.size),
      fillingPrice: getPrice("filling", form.filling),
      imageId: cake.imageId,
      customize: cake.customize,
      quantity: 1,
    };

    setCart((prev) => {
    // CASE 1 — Updating an existing cart item
      if (editingItemId) {
        const updated = prev.map((item) =>
          item.id === editingItemId ? {...orderItem, quantity: item.quantity || 1} : item
        );
        return updated;
      }
    // CASE 2 — Adding a new item (check if it already exists with same selections)
    const existingItem = prev.find(
      (item) =>
        item.originalCakeId === orderItem.originalCakeId &&
        item.size === orderItem.size &&
        item.flavour === orderItem.flavour &&
        item.filling === orderItem.filling &&
        item.message === orderItem.message
    );

    if (existingItem) {
      // Same cake + same options → increase quantity
      return prev.map((item) =>
        item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 }: item
      );
    }
      // Otherwise → add as new item
      return [...prev, orderItem];
    });

    setEditingItemId(null);
    navigate ('/checkout');
  };

 

  const getImageURL = () => {
    return "https://i.ibb.co/" + cake.imageId;
  };

  return (
    <div className="order-container">
      <div className="order-card">
        {/* LEFT IMAGE */}
        <div className="order-image-box">
          <img
            className="order-image"
            src={getImageURL()}
            alt={`Image of ${cake.name}`}
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="order-details">
          <h1 className="order-title">{cake.name}</h1>
          <p className="order-price">${cake.price}</p>

          <p className="order-description">{cake.description}</p>

          <div className="order-form">
            {cake.customize === "yes" && (
              <>
                <Select
                  label="Size:"
                  value={form.size}
                  onChange={(e) =>
                    setForm({ ...form, size: e.target.value })
                  }
                  options={sizeOptions}
                />

                <Select
                  label="Flavor:"
                  value={form.flavour}
                  onChange={(e) =>
                    setForm({ ...form, flavour: e.target.value })
                  }
                  options={flavourOptions}
                />

                <Select
                  label="Filling:"
                  value={form.filling}
                  onChange={(e) =>
                    setForm({ ...form, filling: e.target.value })
                  }
                  options={fillingOptions}
                />

                {canWriteMessage && (
                  <Input
                    label="Message:"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                )}
              </>
            )}
            <div>            
              <Button className
                label={editingItemId ? "Update Cart" : "Add to Cart"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;