import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import "./login.css";

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
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
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        // Simulate API call — replace with real auth logic
        setTimeout(() => {
            setIsLoading(false);
            if (onLogin) onLogin(formData);
            navigate('/');
        }, 1200);
    };

    return (
        <main className="login-main">
            <div className="login-wrapper">

                {/* Login form panel */}
                <div className="login-form-panel">
                    <div className="login-form-inner">
                        <div className="login-header">
                            <h1>Sign In</h1>
                            <p>Enter your details to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form" noValidate>

                            {/* Email field */}
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
                                    />
                                </div>
                                {errors.email && <span className="error-msg">{errors.email}</span>}
                            </div>

                            {/* Password field */}
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
                                {errors.password && <span className="error-msg">{errors.password}</span>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="common-btn login-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? ' Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Sign up redirect */}
                        <p className="login-redirect">
                            Don't have an account?{' '}
                            <Link className="link-like" to="/register">
                                SignUp
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default LoginPage;