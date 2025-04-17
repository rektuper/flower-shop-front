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
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            {/* Блок добавления нового букета */}
            <div style={{ flex: '1', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                <h2>Добавить букет</h2>
                <input
                    type="text"
                    placeholder="Название"
                    value={newFlower.name}
                    onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                    type="text"
                    placeholder="Описание"
                    value={newFlower.description}
                    onChange={(e) => setNewFlower({ ...newFlower, description: e.target.value })}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={newFlower.price}
                    onChange={(e) => setNewFlower({ ...newFlower, price: e.target.value })}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <input
                    type="text"
                    placeholder="Ссылка на изображение"
                    value={newFlower.imageUrl}
                    onChange={(e) => setNewFlower({ ...newFlower, imageUrl: e.target.value })}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={newFlower.inStock}
                        onChange={(e) => setNewFlower({ ...newFlower, inStock: e.target.checked })}
                    />
                    <span style={{ marginLeft: '0.5rem' }}>В наличии</span>
                </label>
                <button onClick={handleAddFlower} style={{ width: '100%', padding: '0.5rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Добавить букет
                </button>
            </div>

            {/* Блок отображения существующих букетов */}
            <div style={{ flex: '2' }}>
                <h2>Существующие букеты</h2>
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {filteredFlowers.map(flower => (
                        <div key={flower.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
                            <img
                                src={editFlowerId === flower.id ? editFlowerData.imageUrl : flower.imageUrl}
                                alt={flower.name}
                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            {editFlowerId === flower.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editFlowerData.name}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, name: e.target.value })}
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        placeholder="Название"
                                    />
                                    <input
                                        type="number"
                                        value={editFlowerData.price}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, price: e.target.value })}
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        placeholder="Цена"
                                    />
                                    <input
                                        type="text"
                                        value={editFlowerData.description}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, description: e.target.value })}
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        placeholder="Описание"
                                    />
                                    <input
                                        type="text"
                                        value={editFlowerData.imageUrl}
                                        onChange={(e) => setEditFlowerData({ ...editFlowerData, imageUrl: e.target.value })}
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        placeholder="Ссылка на изображение"
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={editFlowerData.inStock}
                                            onChange={(e) => setEditFlowerData({ ...editFlowerData, inStock: e.target.checked })}
                                        />
                                        <span style={{ marginLeft: '0.5rem' }}>В наличии</span>
                                    </label>
                                    <button onClick={handleSaveEdit} style={{ marginTop: '0.5rem', width: '100%', background: '#2196F3', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                                        Сохранить
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 style={{ margin: '0.5rem 0' }}>{flower.name}</h4>
                                    <p style={{ margin: '0.5rem 0' }}>Цена: {flower.price} ₽</p>
                                    <p style={{ margin: '0.5rem 0' }}>{flower.description}</p>
                                    <p style={{ margin: '0.5rem 0', color: flower.inStock ? 'green' : 'red' }}>
                                        {flower.inStock ? 'В наличии' : 'Нет в наличии'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => handleEditClick(flower)} style={{ flex: 1, background: '#FFC107', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem' }}>
                                            Редактировать
                                        </button>
                                        <button onClick={() => handleDeleteFlower(flower.id)} style={{ flex: 1, background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem' }}>
                                            Удалить
                                        </button>
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

export default AdminPage;
