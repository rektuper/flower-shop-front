import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlowerList = () => {
    const [flowers, setFlowers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/bouquets')
            .then(response => {
                setFlowers(response.data);
            })
            .catch(error => {
                console.error('Error fetching flowers:', error);
            });
    }, []);

    return (
        <div>
            <h1>Список цветов</h1>
            <div className="flower-list">
                {flowers.map(flower => (
                    <div key={flower.id} className="flower-card">
                        <img src={flower.imageUrl} alt={flower.name} />
                        <h3>{flower.name}</h3>
                        <p>Цена: {flower.price} руб.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlowerList;