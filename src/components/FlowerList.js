// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const FlowerList = () => {
//     const [flowers, setFlowers] = useState([]);
//     const [filteredFlowers, setFilteredFlowers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [inStockOnly, setInStockOnly] = useState(false);
//
//     useEffect(() => {
//         axios.get('http://localhost:8080/api/bouquets')
//             .then(response => {
//                 setFlowers(response.data);
//                 setFilteredFlowers(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching flowers:', error);
//             });
//     }, []);
//
//     useEffect(() => {
//         let filtered = flowers;
//
//         if (searchTerm.trim() !== '') {
//             filtered = filtered.filter(f =>
//                 f.name.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         if (inStockOnly) {
//             filtered = filtered.filter(f => f.inStock);
//         }
//
//         setFilteredFlowers(filtered);
//     }, [searchTerm, inStockOnly, flowers]);
//
//     return (
//         <div>
//             <h1>Список букетов</h1>
//
//             <div style={{ marginBottom: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="Поиск по названию..."
//                     value={searchTerm}
//                     onChange={e => setSearchTerm(e.target.value)}
//                     style={{ padding: '8px', marginRight: '10px' }}
//                 />
//                 <label>
//                     <input
//                         type="checkbox"
//                         checked={inStockOnly}
//                         onChange={e => setInStockOnly(e.target.checked)}
//                     />
//                     {' '}Только в наличии
//                 </label>
//             </div>
//
//             <div className="flower-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//                 {filteredFlowers.map(flower => (
//                     <div
//                         key={flower.id}
//                         className="flower-card"
//                         style={{
//                             border: '1px solid #ccc',
//                             padding: '10px',
//                             borderRadius: '8px',
//                             width: '200px'
//                         }}
//                     >
//                         <img
//                             src={flower.imageUrl}
//                             alt={flower.name}
//                             style={{ width: '100%', height: '150px', objectFit: 'cover' }}
//                         />
//                         <h3>{flower.name}</h3>
//                         <p>Цена: {flower.price} руб.</p>
//                         <p>{flower.inStock ? 'В наличии' : 'Нет в наличии'}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default FlowerList;
