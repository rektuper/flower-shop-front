import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './../styles/Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    username: decoded.sub,
                    roles: decoded.roles || [],
                });

                axios.get('http://localhost:8080/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(response => setCartItems(response.data))
                    .catch(error => console.error('Ошибка при загрузке корзины', error));

            } catch (error) {
                console.error("Ошибка при декодировании токена", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const hasRole = (role) => {
        return user?.roles.includes(role);
    };

    return (
        <header className="header">
            <Link className="logo" to="/">🌸 FlowerShop</Link>
            <nav className="nav">
                {user ? (
                    <>
                        {hasRole('ROLE_ADMIN') && (
                            <Link className="nav-link" to="/adminpage">Админ-панель</Link>
                        )}
                        {(hasRole('ROLE_ADMIN') || hasRole('ROLE_USER')) && (
                            <Link className="cart-wrapper" to="/cart">
                                <div className="cart-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293a1 1 0 001.414 1.414L7 13zm10 0l1.293 1.293a1 1 0 01-1.414 1.414L17 13z" />
                                    </svg>
                                    {cartItems.length > 0 && (
                                        <div className="cart-badge">{cartItems.length}</div>
                                    )}
                                </div>
                            </Link>
                        )}
                        <span className="user-info">👤 {user.username}</span>
                        <button className="logout-button" onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">Войти</Link>
                        <Link className="nav-link" to="/register">Регистрация</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
