import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(response.data ?? []);
            } catch (error) {
                console.error('Ошибка при получении заказов:', error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="orders-page"><p className="loading-text">Загрузка заказов...</p></div>;
    }

    if (!Array.isArray(orders)) {
        console.error('Некорректный формат заказов:', orders);
        return <div className="orders-page"><p className="error-text">Ошибка загрузки заказов.</p></div>;
    }

    return (
        <div className="orders-page">
            <h1 className="page-title">Мои заказы</h1>
            {orders.length === 0 ? (
                <p className="empty-text">У вас пока нет заказов.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h2>Заказ №{order.id}</h2>
                                <span className={`order-status ${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="order-date">Дата заказа: {new Date(order.orderDate).toLocaleString()}</p>
                            <p className="order-total">Сумма заказа: {order.totalPrice} ₽</p>
                            <div className="order-items-section">
                                <h3>Товары:</h3>
                                <ul className="order-items">
                                    {(order.orderItems ?? []).map(item => (
                                        <li key={item.id} className="order-item">
                                            <span className="item-name">{item.bouquetName}</span>
                                            <span className="item-quantity">x{item.quantity}</span>
                                            <span className="item-price">{item.priceAtPurchase} ₽</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
