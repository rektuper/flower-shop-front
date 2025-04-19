import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // добавили useNavigate
import '../styles/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate(); // хук для навигации

    const fetchCart = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCartItems(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении корзины:', error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8080/api/cart/remove/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                setCartItems(prev => prev.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('Ошибка при удалении товара из корзины:', error);
            });
    };

    const handleOrder = () => {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8080/api/orders', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCartItems([]);
                setOrderId(response.data.id);
                setIsOrderModalOpen(true);
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
            });
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleModalClose = () => {
        setIsOrderModalOpen(false);
        navigate('/orders'); // редирект на страницу истории заказов
    };

    if (loading) return <p>Загрузка корзины...</p>;

    return (
        <div className="cart-page">
            <h1>Ваша корзина</h1>
            {cartItems.length === 0 ? (
                <p>Корзина пуста.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                                <div className="cart-item-img">
                                    <img src={item.imageUrl} alt={item.bouquetName}/>
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.bouquetName}</h3>
                                    <p>Количество: {item.quantity}</p>
                                    <p>Цена за всё: {item.totalPrice} ₽</p>
                                </div>
                            </div>
                            <button className="remove-btn" onClick={() => handleRemove(item.id)}>Удалить</button>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <h2>Общая сумма: {totalPrice} ₽</h2>
                        <button className="order-btn" onClick={handleOrder}>Заказать</button>
                    </div>
                </div>
            )}

            {isOrderModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Спасибо за заказ! 🎉</h2>
                        {orderId && <p>Номер вашего заказа: <strong>{orderId}</strong></p>}
                        <p>Мы скоро с вами свяжемся для подтверждения.</p>
                        <button onClick={handleModalClose}>Перейти к заказам</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
