import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../styles/FlowerPage.css';

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
            .then(response => setCartItems(response.data))
            .catch(error => console.error('Ошибка при получении корзины:', error));
    };

    useEffect(() => {
        fetchCart();
        axios.get('http://localhost:8080/api/bouquets')
            .then(response => setFlowers(response.data))
            .catch(error => console.error('Ошибка при получении букетов:', error));
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
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchCart())
            .catch(error => console.error('Ошибка при добавлении в корзину:', error));
    };

    const handleUpdateQuantity = (flower, newQuantity) => {
        const cartItem = cartItems.find(item => item.bouquetName === flower.name);
        if (!cartItem) return;

        if (newQuantity <= 0) {
            axios.delete(`http://localhost:8080/api/cart/remove/${cartItem.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchCart())
                .catch(error => console.error('Ошибка при удалении из корзины:', error));
        } else {
            axios.post('http://localhost:8080/api/cart/update', {
                bouquetId: flower.id,
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchCart())
                .catch(error => console.error('Ошибка при обновлении количества:', error));
        }
    };

    const getCartItemForFlower = (flowerName) => {
        return cartItems.find(item => item.bouquetName === flowerName);
    };

    return (
        <div className="flower-page">
            <h1 className="flower-title">Список букетов</h1>

            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <label className="stock-filter">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={e => setInStockOnly(e.target.checked)}
                    />
                    Только в наличии
                </label>
            </div>

            <div className="flower-list">
                {filteredFlowers.map(flower => {
                    const cartItem = getCartItemForFlower(flower.name);
                    return (
                        <div key={flower.id} className="flower-card">
                            <img
                                src={flower.imageUrl}
                                alt={flower.name}
                                className="flower-image"
                            />
                            <h3 className="flower-name">{flower.name}</h3>
                            <p className="flower-price">Цена: {flower.price} руб.</p>
                            <p className={`flower-stock ${flower.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                {flower.inStock ? 'В наличии' : 'Нет в наличии'}
                            </p>

                            {cartItem ? (
                                <div className="cart-controls">
                                    <button className="cart-button" onClick={() => handleUpdateQuantity(flower, cartItem.quantity - 1)}>-</button>
                                    <span>{cartItem.quantity}</span>
                                    <button className="cart-button" onClick={() => handleUpdateQuantity(flower, cartItem.quantity + 1)}>+</button>
                                </div>
                            ) : (
                                <button  onClick={() => handleAddToCart(flower)} className="add-to-cart-button">
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
