import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/LoginPage.css';

const LoginPage = () => {
    const [userLogin, setUsername] = useState('');
    const [userPassword, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userLogin, userPassword })
            });

            if (!res.ok) throw new Error('Неверный логин или пароль');

            const data = await res.json();
            localStorage.setItem('token', data.token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Вход</h2>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={userLogin}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={userPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
