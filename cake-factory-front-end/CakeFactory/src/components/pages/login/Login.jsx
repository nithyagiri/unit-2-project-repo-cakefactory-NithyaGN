import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import UserDTO from '../../../class/UserDTO.js';
import User from '../../../class/User.js';
import { useData } from '../../../context/DataContext.jsx';
import InputErrorMessage from '../../common/InputErrorMessage.jsx';
import "./login.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const { setCurrentUser, currentUser } = useData();

    const [isRegister, setIsRegister] = useState(false);  

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const firstFieldRef = useRef(null);
    
    useEffect(() => {
        if (currentUser) {
            navigate('/shop');
        }
    }, [currentUser]);

    useEffect(() => {
        firstFieldRef.current?.focus();
    }, [isRegister]);

    // Reset form when toggling
    const handleToggle = () => {
        setIsRegister(prev => !prev);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
        setServerError('');
    };

    const validate = () => {
        const newErrors = {};

        if (isRegister && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (isRegister && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    //Login API call
    const loginUser = async (userDTO) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDTO),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `ERROR - Status ${response.status}`);
            } else {
                const data = await response.json();
                const user = new User(data.id, data.name, data.email);
                setCurrentUser(user);
                navigate('/shop');
            }
        } catch (error) {
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    //Register API call
    const registerUser = async (userDTO) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDTO),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `ERROR - Status ${response.status}`);
            } else {
                // Switch to login after successful registration
                handleToggle();
                setServerError('');
                alert('Registration successful! Please login.');
            }
        } catch (error) {
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        if (isRegister) {
            const userDTO = new UserDTO(formData.name, formData.email, formData.password);
            registerUser(userDTO);
        } else {
            const userDTO = new UserDTO(null, formData.email, formData.password);
            loginUser(userDTO);
        }
    };

    return (
        <main className="login-main">
            <div className="login-wrapper">
                <div className="login-form-panel">
                    <div className="login-form-inner">

                        {/* Header — changes based on mode */}
                        <div className="login-header">
                            <p>{isRegister ? 'Enter your details to Create Account' : 'Enter your details to Sign in'}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form" noValidate>

                            {/* Name — only shown for register */}
                            {isRegister && (
                                <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            ref={firstFieldRef}
                                        />
                                    </div>
                                    <InputErrorMessage hasError={!!errors.name} msg={errors.name} />
                                </div>
                            )}

                            {/* Email */}
                            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        ref={!isRegister ? firstFieldRef : null}
                                    />
                                </div>
                                <InputErrorMessage hasError={!!errors.email} msg={errors.email} />
                            </div>

                            {/* Password */}
                            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </button>
                                </div>
                                <InputErrorMessage hasError={!!errors.password} msg={errors.password} />
                            </div>

                            {/* Confirm Password — only shown for register */}
                            {isRegister && (
                                <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            aria-label="Toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </button>
                                    </div>
                                    <InputErrorMessage hasError={!!errors.confirmPassword} msg={errors.confirmPassword} />
                                </div>
                            )}

                            {/* Server error */}
                            <InputErrorMessage hasError={!!serverError} msg={serverError} />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="common-btn login-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (isRegister ? 'Registering...' : 'Signing in...')
                                    : (isRegister ? 'Register' : 'Sign In')
                                }
                            </button>
                        </form>

                        {/* Toggle between login and register */}
                        <p className="login-redirect">
                            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                className="link-like toggle-btn"
                                onClick={handleToggle}
                            >
                                {isRegister ? 'Sign In' : 'SignUp'}
                            </button>
                        </p>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;