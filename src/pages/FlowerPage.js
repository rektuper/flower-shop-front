import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlowerPage = () => {
    const [flowers, setFlowers] = useState([]);
    const [filteredFlowers, setFilteredFlowers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [cart, setCart] = useState({}); // { bouquetId: { id, quantity } }
    const [cartLoaded, setCartLoaded] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:8080/api/bouquets')
            .then(response => {
                setFlowers(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении букетов:', error);
            });

        axios.get('http://localhost:8080/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const cartData = {};
                response.data.forEach(item => {
                    cartData[item.bouquetId] = {
                        id: item.id,
                        quantity: item.quantity
                    };
                });
                setCart(cartData);
                setCartLoaded(true);
            })
            .catch(error => {
                console.error('Ошибка при загрузке корзины:', error);
                setCartLoaded(true);
            });
    }, []);

    // Обновляем фильтрованные цветы при изменении данных или фильтров
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

        // добавляем к каждому объекту данные из корзины
        const enriched = filtered.map(flower => ({
            ...flower,
            cartItem: cart[flower.id] || null
        }));

        setFilteredFlowers(enriched);
    }, [searchTerm, inStockOnly, flowers, cart]);

    const handleAddToCart = (flowerId) => {
        axios.post('http://localhost:8080/api/cart/add', {
            bouquetId: flowerId,
            quantity: 1
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const newItem = response.data;
                setCart(prev => ({
                    ...prev,
                    [flowerId]: {
                        id: newItem.id,
                        quantity: newItem.quantity
                    }
                }));
            })
            .catch(error => {
                console.error('Ошибка при добавлении в корзину:', error);
            });
    };

    const handleUpdateQuantity = (flowerId, newQuantity) => {
        const cartItem = cart[flowerId];
        if (!cartItem) return;

        if (newQuantity <= 0) {
            axios.delete(`http://localhost:8080/api/cart/remove/${cartItem.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    setCart(prev => {
                        const updated = { ...prev };
                        delete updated[flowerId];
                        return updated;
                    });
                })
                .catch(error => {
                    console.error('Ошибка при удалении из корзины:', error);
                });
        } else {
            axios.post('http://localhost:8080/api/cart/update', {
                bouquetId: flowerId,
                quantity: newQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    setCart(prev => ({
                        ...prev,
                        [flowerId]: {
                            ...prev[flowerId],
                            quantity: newQuantity
                        }
                    }));
                })
                .catch(error => {
                    console.error('Ошибка при обновлении количества:', error);
                });
        }
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
                {filteredFlowers.map(flower => (
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

                        {cartLoaded && flower.cartItem ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button onClick={() => handleUpdateQuantity(flower.id, flower.cartItem.quantity - 1)}>-</button>
                                <span>{flower.cartItem.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(flower.id, flower.cartItem.quantity + 1)}>+</button>
                            </div>
                        ) : (
                            cartLoaded && (
                                <button onClick={() => handleAddToCart(flower.id)}>
                                    В корзину
                                </button>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlowerPage;
