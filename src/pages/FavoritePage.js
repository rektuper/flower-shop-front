import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../styles/FavoritePage.css';
import { motion } from 'framer-motion';

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');

    const fetchFavorites = () => {
        axios.get('http://localhost:8080/api/favorites', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Ошибка при загрузке избранного:', error));
    };

    const fetchCart = () => {
        axios.get('http://localhost:8080/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setCartItems(response.data))
            .catch(error => console.error('Ошибка при загрузке корзины:', error));
    };

    useEffect(() => {
        fetchFavorites();
        fetchCart();
    }, []);

    const removeFromFavorites = (bouquetId) => {
        axios.delete(`http://localhost:8080/api/favorites/${bouquetId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchFavorites())
            .catch(error => console.error('Ошибка при удалении из избранного:', error));
    };

    const handleAddToCart = (favorite) => {
        axios.post('http://localhost:8080/api/cart/add', {
            bouquetId: favorite.id,
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchCart())
            .catch(error => console.error('Ошибка при добавлении в корзину:', error));
    };

    const handleUpdateQuantity = (favorite, newQuantity) => {
        const cartItem = cartItems.find(item => item.bouquetName === favorite.name);
        if (!cartItem) return;

        if (newQuantity <= 0) {
            axios.delete(`http://localhost:8080/api/cart/remove/${cartItem.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchCart())
                .catch(error => console.error('Ошибка при удалении из корзины:', error));
        } else {
            axios.post('http://localhost:8080/api/cart/update', {
                bouquetId: favorite.id,
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => fetchCart())
                .catch(error => console.error('Ошибка при обновлении количества:', error));
        }
    };

    const getCartItemForFavorite = (favoriteName) => {
        return cartItems.find(item => item.bouquetName === favoriteName);
    };

    return (
        <div className="favorite-page">
            <h1 className="favorite-title">Избранные букеты</h1>

            {favorites.length === 0 ? (
                <p className="empty-message">Вы ещё ничего не добавили в избранное.</p>
            ) : (
                <div className="favorite-list">
                    {favorites.map(favorite => {
                        const cartItem = getCartItemForFavorite(favorite.name);
                        return (
                            <motion.div
                                key={favorite.id}
                                className="favorite-card"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <img
                                    src={favorite.imageUrl}
                                    alt={favorite.name}
                                    className="favorite-image"
                                />
                                <h3 className="favorite-name">{favorite.name}</h3>
                                <p className="favorite-price">Цена: {favorite.price} руб.</p>

                                <div className="favorite-buttons">
                                    {cartItem ? (
                                        <div className="cart-controls">
                                            <button className="cart-button" onClick={() => handleUpdateQuantity(favorite, cartItem.quantity - 1)}>-</button>
                                            <span>{cartItem.quantity}</span>
                                            <button className="cart-button" onClick={() => handleUpdateQuantity(favorite, cartItem.quantity + 1)}>+</button>
                                        </div>
                                    ) : (
                                        <button
                                            className="add-to-cart-button"
                                            onClick={() => handleAddToCart(favorite)}
                                        >
                                            В корзину
                                        </button>
                                    )}
                                </div>

                                <button
                                    className="remove-favorite-button"
                                    onClick={() => removeFromFavorites(favorite.id)}
                                >
                                    Удалить из избранного
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FavoritePage;