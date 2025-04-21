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

            const data = await res.json();

            if (!res.ok || !data.token || data.token.length < 100) {
                let errorText = data.token || 'Ошибка регистрации';
                if (errorText.includes('Пользователь с таким именем уже существует')) {
                    errorText = 'Увы, пользователь с таким именем уже есть!';
                }
                setError(errorText);
                return;
            }
            localStorage.setItem('token', data.token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Ошибка сервера. Попробуйте позже.');
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
