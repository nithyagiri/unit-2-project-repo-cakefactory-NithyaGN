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
};

const AddToCartForm = ({ cake }) => {
    const navigate = useNavigate();
    const { fetchCart } = useData();

    const [formData, setFormData] = useState({
        size: '',
        flavour: '',
        filling: '',
        message: '',
    });
    const [hasErrors, setHasErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Auto focus first field
    const firstFieldRef = useRef(null);
    useEffect(() => {
        if (firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, []);

    // Parse options from Cakes class methods 
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

    // Save to backend
    const saveToCart = async (cartDTO) => {
        try {
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartDTO),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || `ERROR - Status ${response.status}`
                );
            } else {
                fetchCart();
                navigate('/checkout');
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle field changes 
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    // ── Handle Submit ──
    const handleSubmit = (event) => {
        event.preventDefault();

        const cartDTO = new CartDTO(
            null,               // userId — null until login is implemented
            cake.id,
            1,                  
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </>
            )}

            <div>
                <Button
                    label={submitting ? 'Adding...' : 'Add to Cart'}
                    onClick={handleSubmit}
                    disabled={submitting}
                />
            </div>
        </form>
    );
};

export default AddToCartForm;