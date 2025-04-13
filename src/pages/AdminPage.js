import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [flowers, setFlowers] = useState([]);
    const [newFlower, setNewFlower] = useState({
        name: '',
        price: '',
        inStock: true,
        imageUrl: '',
        description: '',
        flowerList: []
    });

    useEffect(() => {
        axios.get('http://localhost:8080/bouquets')
            .then(response => {
                setFlowers(response.data);
            })
            .catch(error => {
                console.error('Error fetching flowers:', error);
            });
    }, []);

    const handleAddFlower = () => {
        axios.post('http://localhost:8080/bouquets', newFlower)
            .then(response => {
                setFlowers([...flowers, response.data]);
                setNewFlower({
                    name: '',
                    price: '',
                    inStock: true,
                    imageUrl: '',
                    description: '',
                    flowerList: []
                });
            })
            .catch(error => {
                console.error('Error adding flower:', error);
            });
    };

    const handleDeleteFlower = (flowerId) => {
        axios.delete(`http://localhost:8080/bouquets/${flowerId}`)
            .then(() => {
                setFlowers(flowers.filter(flower => flower.id !== flowerId));
            })
            .catch(error => {
                console.error('Error deleting flower:', error);
            });
    };

    return (
        <div>
            <h1>Админ панель</h1>
            <h2>Добавить новый букет</h2>
            <input
                type="text"
                placeholder="Название"
                value={newFlower.name}
                onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Описание"
                value={newFlower.description}
                onChange={(e) => setNewFlower({ ...newFlower, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Цена"
                value={newFlower.price}
                onChange={(e) => setNewFlower({ ...newFlower, price: e.target.value })}
            />
            <input
                type="text"
                placeholder="Ссылка на изображение"
                value={newFlower.imageUrl}
                onChange={(e) => setNewFlower({ ...newFlower, imageUrl: e.target.value })}
            />
            <label>
                В наличии:
                <input
                    type="checkbox"
                    checked={newFlower.inStock}
                    onChange={(e) => setNewFlower({ ...newFlower, inStock: e.target.checked })}
                />
            </label>
            <button onClick={handleAddFlower}>Добавить букет</button>

            <h2>Существующие букеты</h2>
            <ul>
                {flowers.map(flower => (
                    <li key={flower.id}>
                        <img
                            src={flower.imageUrl}
                            alt={flower.name}
                            width="100"
                            height="80"
                        />
                        <div>
                            {flower.name} — {flower.price} ₽ — {flower.inStock ? 'В наличии' : 'Нет в наличии'}
                        </div>
                        <button onClick={() => handleDeleteFlower(flower.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
