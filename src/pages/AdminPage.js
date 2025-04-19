import React, { useState } from 'react';
import BouquetsManager from '../components/BouquetsManager';
import OrdersManager from '../components/OrdersManager';
import '../styles/AdminPage.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('bouquets');

    return (
        <div className="admin-page">
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'bouquets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bouquets')}
                >
                    Букеты
                </button>
                <button
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'bouquets' ? <BouquetsManager /> : <OrdersManager />}
            </div>
        </div>
    );
};

export default AdminPage;
