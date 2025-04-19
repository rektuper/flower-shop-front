import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';

const BouquetsManager = () => {
    const [flowers, setFlowers] = useState([]);
    const [newFlower, setNewFlower] = useState({
        name: '',
        price: '',
        inStock: true,
        imageUrl: '',
        description: '',
        flowerList: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [editFlowerId, setEditFlowerId] = useState(null);
    const [editFlowerData, setEditFlowerData] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchFlowers();
    }, []);

    const fetchFlowers = () => {
        axios.get('http://localhost:8080/api/bouquets')
            .then(response => setFlowers(response.data))
            .catch(error => console.error('Ошибка загрузки букетов', error));
    };

    const handleAddFlower = () => {
        axios.post('http://localhost:8080/api/admin/bouquets', newFlower, {
            headers: { Authorization: `Bearer ${token}` }
        })
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
            .catch(error => console.error('Ошибка при добавлении', error));
    };

    const handleDeleteFlower = (flowerId) => {
        axios.delete(`http://localhost:8080/api/admin/bouquets/${flowerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => setFlowers(flowers.filter(flower => flower.id !== flowerId)))
            .catch(error => console.error('Ошибка при удалении', error));
    };

    const handleEditClick = (flower) => {
        setEditFlowerId(flower.id);
        setEditFlowerData({ ...flower });
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:8080/api/admin/bouquets/${editFlowerId}`, editFlowerData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                fetchFlowers();
                setEditFlowerId(null);
                setEditFlowerData({});
            })
            .catch(error => console.error('Ошибка при редактировании', error));
    };

    const filteredFlowers = flowers.filter(flower =>
        flower.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager">
            <div className="manager-form">
                <h2>Добавить букет</h2>
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
                <label className="checkbox-label">
                    <span>В наличии</span>
                    <input
                        type="checkbox"
                        checked={newFlower.inStock}
                        onChange={(e) => setNewFlower({...newFlower, inStock: e.target.checked})}
                    />

                </label>
                <button className="add-button" onClick={handleAddFlower}>Добавить букет</button>
            </div>

            <div className="manager-list">
                <h2>Существующие букеты</h2>
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flowers-grid">
                    {filteredFlowers.map(flower => (
                        <div key={flower.id} className="flower-card">
                            <img
                                src={editFlowerId === flower.id ? editFlowerData.imageUrl : flower.imageUrl}
                                alt={flower.name}
                                className="flower-image"
                            />
                            {editFlowerId === flower.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editFlowerData.name}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, name: e.target.value })}
                                        placeholder="Название"
                                    />
                                    <input
                                        type="number"
                                        value={editFlowerData.price}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, price: e.target.value })}
                                        placeholder="Цена"
                                    />
                                    <input
                                        type="text"
                                        value={editFlowerData.description}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, description: e.target.value })}
                                        placeholder="Описание"
                                    />
                                    <input
                                        type="text"
                                        value={editFlowerData.imageUrl}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, imageUrl: e.target.value })}
                                        placeholder="Ссылка на изображение"
                                    />
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={editFlowerData.inStock}
                                            onChange={(e) => setEditFlowerData({ ...editFlowerData, inStock: e.target.checked })}
                                        />
                                        <span>В наличии</span>
                                    </label>
                                    <button className="save-button" onClick={handleSaveEdit}>Сохранить</button>
                                </>
                            ) : (
                                <>
                                    <h4>{flower.name}</h4>
                                    <p>Цена: {flower.price} ₽</p>
                                    <p>{flower.description}</p>
                                    <p className={flower.inStock ? 'in-stock' : 'out-of-stock'}>
                                        {flower.inStock ? 'В наличии' : 'Нет в наличии'}
                                    </p>
                                    <div className="card-buttons">
                                        <button className="edit-button" onClick={() => handleEditClick(flower)}>Редактировать</button>
                                        <button className="delete-button" onClick={() => handleDeleteFlower(flower.id)}>Удалить</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BouquetsManager;
