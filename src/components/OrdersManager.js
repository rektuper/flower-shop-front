import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';

const OrdersManager = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchId, setSearchId] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = () => {
        let url = 'http://localhost:8080/api/admin/orders/history?sort=asc'; // <-- добавили сортировку по возрастанию
        if (filterStatus) {
            url += `&status=${filterStatus}`;
        }
        axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setOrders(response.data))
            .catch(error => console.error('Ошибка загрузки заказов', error));
    };

    const handleStatusChange = (orderId, newStatus) => {
        axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchOrders())
            .catch(error => console.error('Ошибка обновления статуса', error));
    };

    const filteredOrders = orders
        .filter(order =>
            searchId === '' || order.id.toString().includes(searchId)
        );

    return (
        <div className="manager">
            <div className="manager-list">
                <h2>Управление заказами</h2>

                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Все заказы</option>
                        <option value="NEW">Новый</option>
                        <option value="PAID">Оплачен</option>
                        <option value="SHIPPED">Отправлен</option>
                        <option value="DELIVERED">Доставлен</option>
                        <option value="CANCELED">Отменен</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Поиск по номеру заказа"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="orders-list">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <h4>Заказ №{order.id}</h4>
                            <p>Статус: {order.status}</p>
                            <p>Дата: {new Date(order.orderDate).toLocaleString()}</p>
                            <p>Сумма: {order.totalPrice} ₽</p>

                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                                <option value="NEW">Новый</option>
                                <option value="PAID">Оплачен</option>
                                <option value="SHIPPED">Отправлен</option>
                                <option value="DELIVERED">Доставлен</option>
                                <option value="CANCELED">Отменен</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersManager;
