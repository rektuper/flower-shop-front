import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FlowerList from "./components/FlowerList";
import AdminPage from "./pages/AdminPage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<FlowerList/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/adminpage" element={<AdminPage/>} />
            </Routes>
        </Router>
    );
};

export default App;