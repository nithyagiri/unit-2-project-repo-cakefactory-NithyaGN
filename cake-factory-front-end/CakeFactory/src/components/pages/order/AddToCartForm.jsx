import { useState} from 'react';
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
};

const AddToCartForm = ({ cake, quantity, cartItemId = null, existingData = null, onEditSuccess = null }) => {
    const navigate = useNavigate();
    const { fetchCart, currentUser } = useData();
    const isEditMode = !!cartItemId;

    const [formData, setFormData] = useState({
        size: existingData?.selectedSize || '',
        flavour: existingData?.selectedFlavour || '',
        filling: existingData?.selectedFilling || '',
        message: existingData?.message || '', 
    });
    const [hasErrors, setHasErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    
// Only require selects if customization is enabled
    const isFormValid = () => {
        if (cake.customization === false) {
            return quantity >= 1;
        }
        return (
            formData.size &&
            formData.flavour &&
            formData.filling &&
            quantity >= 1
        );
    };

    // Build the payload with defaults for non-customizable items
    const buildPayload = () => {
        return {
            userId: currentUser?.id,
            cakeId: cake.id,
            quantity: quantity,
            selectedSize: cake.customization ? formData.size : "Standard",
            selectedFlavour: cake.customization ? formData.flavour : "Standard",
            selectedFilling: cake.customization ? formData.filling : "None",
            message: cake.customization ? formData.message : ""
        };
    };
    //Submit Logic
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            setHasErrors(true);
            return;
        }

        setSubmitting(true);

        // Map to empty strings for cupcakes to keep the DB and UI clean
        const cartDTO = new CartDTO(
            currentUser?.id,
            cake.id,
            quantity,
            cake.customization ? formData.size : "",
            cake.customization ? formData.flavour : "",
            cake.customization ? formData.filling : "",
            cake.customization ? formData.message : ""
        );

        // Pass the customization status to DTO's isValid method
        if (!cartDTO.isValid(cake.customization)) {
            console.error("DTO validation failed.");
            setSubmitting(false);
            return;
        }

        try {
            const url = isEditMode 
                ? `http://localhost:8080/api/cart/${cartItemId}` 
                : 'http://localhost:8080/api/cart/add';
            
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartDTO),
            });

            if (!response.ok) throw new Error(await response.text());

            await fetchCart(currentUser?.id);
            
            if (isEditMode) {
                onEditSuccess?.();
            } else {
                navigate('/checkout');
            }
        } catch (error) {
            console.error("Cart Action Failed:", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Dynamic Options Mapping
    const sizeOptions = cake.customization ? cake.getParsedSizes().map(s => ({ label: `${s.label} (+$${s.addPrice})`, value: s.label })) : [];
    const flavourOptions = cake.customization ? cake.getParsedFlavors().map(f => ({ label: f.label, value: f.label })) : [];
    const fillingOptions = cake.customization ? cake.getParsedFillings().map(f => ({ label: `${f.label} (+$${f.addPrice})`, value: f.label })) : [];

    return (
        <form className="order-form" onSubmit={handleSubmit}>
            {/* Cupcakes (customization: false) will skip this entire block */}
            {cake.customization === true && (
                <>
                    <div className="form-field">
                        <Select
                            id="size"
                            label="Size:"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            options={sizeOptions}
                        />
                        <InputErrorMessage hasError={hasErrors && !formData.size} msg={errorMessages.sizeRequired} />
                    </div>

                    <div className="form-field">
                        <Select
                            id="flavour"
                            label="Flavour:"
                            value={formData.flavour}
                            onChange={(e) => setFormData({ ...formData, flavour: e.target.value })}
                            options={flavourOptions}
                        />
                        <InputErrorMessage hasError={hasErrors && !formData.flavour} msg={errorMessages.flavourRequired} />
                    </div>

                    <div className="form-field">
                        <Select
                            id="filling"
                            label="Filling:"
                            value={formData.filling}
                            onChange={(e) => setFormData({ ...formData, filling: e.target.value })}
                            options={fillingOptions}
                        />
                        <InputErrorMessage hasError={hasErrors && !formData.filling} msg={errorMessages.fillingRequired} />
                    </div>

                    {cake.canWriteMessage && (
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

            <div style={{ marginTop: '20px' }}>
                <Button
                    label={submitting 
                        ? (isEditMode ? 'Updating...' : 'Adding...') 
                        : (isEditMode ? 'Update Cart' : 'Add to Cart')
                    }
                    type="submit"
                    disabled={submitting || quantity < 1}
                />
            </div>
        </form>
    );
};

export default AddToCartForm;