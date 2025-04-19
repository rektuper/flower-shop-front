import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './../styles/Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <header className="header">
            <Link className="logo" to="/">
                🌸 FlowerShop
            </Link>
            <nav className="nav">
                {user ? (
                    <>
                        <Link className="cart-wrapper" to="/cart">
                            <div className="cart-button-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"/>
                                </svg>
                                {cartItems.length > 0 && (
                                    <div className="cart-badge">{cartItems.length}</div>
                                )}
                            </div>
                        </Link>


                        <div className="user-dropdown">
                            <button className="user-info" onClick={toggleMenu}>
                                👤 {user.username}
                            </button>
                            {menuOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/cart" className="dropdown-item" onClick={() => {setMenuOpen(false)}}>
                                        🛒 Корзина
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                        📜 История заказов
                                    </Link>
                                    <Link to="/favorites"  className="dropdown-item">
                                        ❤️ Избранное
                                    </Link>
                                    {hasRole('ROLE_ADMIN') && (
                                        <Link to="/adminpage" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                            🛠 Админ-панель
                                        </Link>
                                    )}
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        🚪 Выйти
                                    </button>
                                </div>
                            )}
                        </div>
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