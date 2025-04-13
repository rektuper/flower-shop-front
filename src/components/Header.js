import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const [user, setUser] = useState(null);
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

    return (
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
            <h2>🌸 FlowerShop</h2>
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {user ? (
                    <>
                        <span>👤 {user.username}</span>
                        <span>🔐 {user.roles.join(", ")}</span>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Войти</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
