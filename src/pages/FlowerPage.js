import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../styles/FlowerPage.css';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const FlowerPage = () => {
    const [flowers, setFlowers] = useState([]);
    const [filteredFlowers, setFilteredFlowers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortOption, setSortOption] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
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

    const fetchFavorites = () => {
        axios.get('http://localhost:8080/api/favorites', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Ошибка при получении избранных:', error));
    };

    useEffect(() => {
        fetchCart();
        fetchFavorites();
        axios.get('http://localhost:8080/api/bouquets')
            .then(response => {
                setFlowers(response.data);
                const maxPrice = Math.max(...response.data.map(f => f.price));
                setPriceRange([0, maxPrice]);
            })
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
        filtered = filtered.filter(f => f.price >= priceRange[0] && f.price <= priceRange[1]);

        if (sortOption === 'price-asc') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name') {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'in-stock') {
            filtered = filtered.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        }

        setFilteredFlowers(filtered);
    }, [searchTerm, inStockOnly, flowers, sortOption, priceRange]);

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

    const toggleFavorite = (flower) => {
        const isFavorite = favorites.some(fav => fav.id === flower.id);

        if (isFavorite) {
            axios.delete(`http://localhost:8080/api/favorites/${flower.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchFavorites())
                .catch(error => console.error('Ошибка при удалении из избранного:', error));
        } else {
            axios.post(`http://localhost:8080/api/favorites/${flower.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchFavorites())
                .catch(error => console.error('Ошибка при добавлении в избранное:', error));
        }
    };

    return (
        <div className="flower-page">
            <h1 className="flower-title">Наши букеты</h1>

            <div className="flower-content">
                <div className="filter-panel">
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

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-select"
                    >
                        <option value="default">Без сортировки</option>
                        <option value="price-asc">Цена ↑</option>
                        <option value="price-desc">Цена ↓</option>
                        <option value="name">По названию</option>
                        <option value="in-stock">Сначала в наличии</option>
                    </select>

                    <div className="price-slider">
                        <p>Цена: {priceRange[0]} — {priceRange[1]} руб.</p>
                        <Slider
                            range
                            min={0}
                            max={Math.max(...flowers.map(f => f.price), 10000)}
                            defaultValue={[0, 10000]}
                            value={priceRange}
                            onChange={(value) => setPriceRange(value)}
                        />
                    </div>
                </div>

                <div className="flower-list">
                    {filteredFlowers.map(flower => {
                        const cartItem = getCartItemForFlower(flower.name);
                        const isFavorite = favorites.some(fav => fav.id === flower.id);
                        return (
                            <motion.div
                                key={flower.id}
                                className="flower-card"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
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

                                <div className="card-actions">
                                    {cartItem ? (
                                        <div className="cart-controls">
                                            <button className="cart-button" onClick={() => handleUpdateQuantity(flower, cartItem.quantity - 1)}>-</button>
                                            <span>{cartItem.quantity}</span>
                                            <button className="cart-button" onClick={() => handleUpdateQuantity(flower, cartItem.quantity + 1)}>+</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(flower)}
                                            className="add-to-cart-button"
                                            disabled={!flower.inStock}
                                        >
                                            В корзину
                                        </button>
                                    )}

                                    <button
                                        className="favorite-button"
                                        onClick={() => toggleFavorite(flower)}
                                    >
                                        {isFavorite ? '❤️' : '🤍'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FlowerPage;