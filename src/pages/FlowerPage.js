import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlowerPage = () => {
    const [flowers, setFlowers] = useState([]);
    const [filteredFlowers, setFilteredFlowers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');

    const fetchCart = () => {
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
            });
    };

    useEffect(() => {
        fetchCart();
        axios.get('http://localhost:8080/api/bouquets')
            .then(response => {
                setFlowers(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении букетов:', error);
            });
    }, []);

    useEffect(() => {
        let filtered = flowers;

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(f =>
                f.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (inStockOnly) {
            filtered = filtered.filter(f => f.inStock);
        }

        setFilteredFlowers(filtered);
    }, [searchTerm, inStockOnly, flowers]);

    const handleAddToCart = (flower) => {
        axios.post('http://localhost:8080/api/cart/add', {
            bouquetId: flower.id,
            quantity: 1
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => fetchCart())
            .catch(error => {
                console.error('Ошибка при добавлении в корзину:', error);
            });
    };

    const handleUpdateQuantity = (flower, newQuantity) => {

        if (newQuantity <= 0) {
            axios.delete(`http://localhost:8080/api/cart/remove/${flower.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => fetchCart())
                .catch(error => {
                    console.error('Ошибка при удалении из корзины:', error);
                });
        } else {
            axios.post('http://localhost:8080/api/cart/update', {
                bouquetId: flower.id,
                quantity: newQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => fetchCart())
                .catch(error => {
                    console.error('Ошибка при обновлении количества:', error);
                });
        }
    };

    const getCartItemForFlower = (flowerName) => {
        return cartItems.find(item => item.bouquetName === flowerName);
    };

    return (
        <div>
            <h1>Список букетов</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={e => setInStockOnly(e.target.checked)}
                    />
                    {' '}Только в наличии
                </label>
            </div>

            <div className="flower-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {filteredFlowers.map(flower => {
                    const cartItem = getCartItemForFlower(flower.name);
                    return (
                        <div
                            key={flower.id}
                            className="flower-card"
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                borderRadius: '8px',
                                width: '200px'
                            }}
                        >
                            <img
                                src={flower.imageUrl}
                                alt={flower.name}
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <h3>{flower.name}</h3>
                            <p>Цена: {flower.price} руб.</p>
                            <p>{flower.inStock ? 'В наличии' : 'Нет в наличии'}</p>

                            {cartItem ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button onClick={() => handleUpdateQuantity(flower,cartItem.quantity - 1)}>-</button>
                                    <span>{cartItem.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(flower, cartItem.quantity + 1)}>+</button>
                                </div>
                            ) : (
                                <button onClick={() => handleAddToCart(flower)}>
                                    В корзину
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlowerPage;
