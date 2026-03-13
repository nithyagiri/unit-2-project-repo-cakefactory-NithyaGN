import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import CartDTO from '../../../class/CartDTO.js';
import { useData } from '../../../context/DataContext.jsx';
import Select from '../../forms/input/Select.jsx';
import Input from '../../forms/input/Input.jsx';
import Button from '../../forms/input/Button.jsx';
import InputErrorMessage from '../../common/InputErrorMessage.jsx';

let errorMessages = {
    sizeRequired: 'Size is required.',
    flavourRequired: 'Flavour is required.',
    fillingRequired: 'Filling is required.',
     quantityRequired: 'Quantity must be at least 1.',
};

const AddToCartForm = ({ cake, cartItemId = null, existingData = null, onEditSuccess = null }) => {
    const navigate = useNavigate();
    const { fetchCart, currentUser } = useData();

    const isEditMode = !!cartItemId;

    const [formData, setFormData] = useState({
        size: existingData?.selectedSize || '',
        flavour: existingData?.selectedFlavour || '',
        filling: existingData?.selectedFilling || '',
        message: existingData?.message || '',
        quantity: existingData?.quantity || 1,  
    });
    const [hasErrors, setHasErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const firstFieldRef = useRef(null);
    useEffect(() => {
        if (firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, []);

    const sizeOptions = cake.getParsedSizes().map((s) => ({
        label: `${s.label} (+$${s.addPrice})`,
        value: s.label,
        addPrice: s.addPrice,
    }));

    const flavourOptions = cake.getParsedFlavors().map((f) => ({
        label: f.label,
        value: f.label,
    }));

    const fillingOptions = cake.getParsedFillings().map((f) => ({
        label: `${f.label} (+$${f.addPrice})`,
        value: f.label,
        addPrice: f.addPrice,
    }));

    const canWriteMessage = cake.canWriteMessage || false;

    // Add to cart( Post) 
    const saveToCart = async (cartDTO) => {
        try {
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartDTO),
            });

            if (!response.ok) {
                const errorText = await response.text();  
                throw new Error(errorText || `ERROR - Status ${response.status}`);
            } else {
                 await fetchCart(currentUser?.id || 1); 
                navigate('/checkout');
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Update cart item (Put)
    const updateCart = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity: formData.quantity,           
                    selectedSize: formData.size,
                    selectedFlavour: formData.flavour,
                    selectedFilling: formData.filling,
                    message: formData.message,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `ERROR - Status ${response.status}`);
            } else {
                await fetchCart(currentUser?.id || 1);
                onEditSuccess?.();
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Validate form data
    const isValid = () => {
        return (
            formData.size &&
            formData.flavour &&
            formData.filling &&
            formData.quantity >= 1
        );
    };


    // Handle Submit 
    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEditMode) {
            if (!isValid()) {
                setHasErrors(true);
                setSubmitting(false);
                return;
            }
            setSubmitting(true);
            updateCart();
        } else {
            const cartDTO = new CartDTO(
                currentUser?.id || 1,  // ← uses logged in user, falls back to 1 for testing
                cake.id,
                formData.quantity,
                formData.size,
                formData.flavour,
                formData.filling,
                formData.message
        );

        if (!cartDTO.isValid()) {
            setSubmitting(false);
            setHasErrors(true);
        } else {
            setSubmitting(true);
            saveToCart(cartDTO);
        }
    }
    };

    return (
        <form className="order-form">
            {cake.customization === true && (
                <>
                    <div className="form-field">
                        <Select
                            id="size"
                            label="Size:"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            options={sizeOptions}
                            ref={firstFieldRef}
                        />
                        <InputErrorMessage
                            hasError={hasErrors && !formData.size}
                            msg={errorMessages.sizeRequired}
                        />
                    </div>

                    <div className="form-field">
                        <Select
                            id="flavour"
                            label="Flavour:"
                            value={formData.flavour}
                            onChange={(e) => setFormData({ ...formData, flavour: e.target.value })}
                            options={flavourOptions}
                        />
                        <InputErrorMessage
                            hasError={hasErrors && !formData.flavour}
                            msg={errorMessages.flavourRequired}
                        />
                    </div>

                    <div className="form-field">
                        <Select
                            id="filling"
                            label="Filling:"
                            value={formData.filling}
                            onChange={(e) => setFormData({ ...formData, filling: e.target.value })}
                            options={fillingOptions}
                        />
                        <InputErrorMessage
                            hasError={hasErrors && !formData.filling}
                            msg={errorMessages.fillingRequired}
                        />
                    </div>

                    {canWriteMessage && (
                        <div className="form-field">
                            <Input
                                id="message"
                                label="Message:"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                    )}
                </>
            )}

            <div>
                <Button
                    label={submitting
                        ? (isEditMode ? 'Updating...' : 'Adding...')
                        : (isEditMode ? 'Update Cart' : 'Add to Cart')
                    }
                    onClick={handleSubmit}
                    disabled={submitting}
                />
            </div>
        </form>
    );
};

export default AddToCartForm;