import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    loginUser,
    clearAuthError,
} from "../../Redux/Slice/authSlice";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        isLoading,
        error,
    } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        dispatch(clearAuthError());

        let hasError = false;

        /*
         * Email validation
         */
        if (!email.trim()) {
            setEmailError("Work email is required.");
            hasError = true;
        }

        /*
         * Password validation
         */
        if (!password.trim()) {
            setPasswordError("Password is required.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        /*
         * Email format validation
         */
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            setEmailError("Please enter a valid work email.");
            return;
        }

        try {
            /*
             * Redux handles both API calls:
             *
             * API 1:
             * POST /api/auth/authtoken
             *
             * API 2:
             * POST /api/auth/login
             * Authorization: Bearer <accessToken>
             */
            const result = await dispatch(
                loginUser({
                    email: email.trim(),
                    password: password,
                })
            ).unwrap();

            console.log("Login successful");
            console.log("User:", result.user);

            /*
             * Navigate to dashboard
             */
            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-page">
            <div className="card login-card border-0">
                <div className="card-body">

                    {/* Troy Logo */}
                    <div className="logo-wrapper">
                        <img
                            src={`${import.meta.env.BASE_URL}Troylogo1.png`}
                            alt="Troy Consultancy"
                            className="troy-logo"
                        />
                    </div>

                    {/* Subtitle */}
                    <p className="login-subtitle">
                        Recruitment workspace — sign in to continue
                    </p>

                    <form onSubmit={handleSubmit} noValidate>

                        {/* Work Email */}
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="form-label login-label"
                            >
                                Work email
                            </label>

                            <input
                                type="email"
                                id="email"
                                className={`form-control login-input ${
                                    emailError ? "input-error" : ""
                                }`}
                                placeholder="Enter your work email"
                                value={email}
                                disabled={isLoading}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                    if (emailError) {
                                        setEmailError("");
                                    }

                                    if (error) {
                                        dispatch(clearAuthError());
                                    }
                                }}
                            />

                            {emailError && (
                                <div className="field-error">
                                    {emailError}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="form-label login-label"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                className={`form-control login-input ${
                                    passwordError ? "input-error" : ""
                                }`}
                                placeholder="Enter your password"
                                value={password}
                                disabled={isLoading}
                                onChange={(e) => {
                                    setPassword(e.target.value);

                                    if (passwordError) {
                                        setPasswordError("");
                                    }

                                    if (error) {
                                        dispatch(clearAuthError());
                                    }
                                }}
                            />

                            {passwordError && (
                                <div className="field-error">
                                    {passwordError}
                                </div>
                            )}
                        </div>

                        {/* Authentication Error */}
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        {/* Sign In */}
                        <button
                            type="submit"
                            className="btn w-100 login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;