import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FlowerList from "./components/FlowerList";
import AdminPage from "./pages/AdminPage";

const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<FlowerList/>} />
                <Route path="/adminpage" element={<AdminPage/>} />
            </Routes>
        </Router>
    );
};

export default App;