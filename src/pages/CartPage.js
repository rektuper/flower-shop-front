import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = () => {
        const token = localStorage.getItem('token');
        console.log(token);
        axios.get('http://localhost:8080/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Ответ сервера (cart):', response.data);
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
        console.log(token);
        console.log(id);
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

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (loading) return <p>Загрузка корзины...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Ваша корзина</h1>
            {cartItems.length === 0 ? (
                <p>Корзина пуста.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} style={{
                            border: '1px solid #ccc',
                            marginBottom: '10px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between'
                            }}>
                                <img
                                    src={item.imageUrl}
                                    style={{width: '200px', height: '200px'}}
                                />
                                <div style={{
                                    marginLeft: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}>
                                    <h3>{item.bouquetName}</h3>
                                    <p>Количество: {item.quantity}</p>
                                    <p>Цена за всё: {item.totalPrice} ₽</p>
                                </div>
                            </div>
                            <button onClick={() => handleRemove(item.id)}>Удалить</button>
                        </div>
                    ))}
                    <h2>Общая сумма: {totalPrice} ₽</h2>
                </div>
            )}
        </div>
    );
};

export default CartPage;
