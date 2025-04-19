import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AdminPage from "./pages/AdminPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FlowerPage from "./pages/FlowerPage";
import CartPage from "./pages/CartPage";
import OrdersPage from './pages/OrdersPage';
import FavoritePage from "./pages/FavoritePage";

const App = () => {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<FlowerPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/adminpage" element={<AdminPage/>} />
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/favorites" element={<FavoritePage />} />
            </Routes>
        </Router>
    );
};

export default App;