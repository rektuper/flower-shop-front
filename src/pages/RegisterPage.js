import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userLogin: username,
                    userPassword: password
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Ошибка регистрации');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-page">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Регистрация</h2>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Зарегистрироваться</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
