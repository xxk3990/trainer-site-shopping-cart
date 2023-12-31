import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import ShoppingCart from './components/ShoppingCart';
import Orders from './components/Orders';
import Products from './components/Products';
import Navbar from './components/Navbar';
import Landing from './components/Landing';

function App() {
  return (
    <Routes>
      <Route element={<> <Navbar/> <Outlet /></>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/shoppingCart" element={<ShoppingCart/>}/>
        <Route path="/userOrders" element={<Orders/>}/>
        <Route path="/adminProducts" element={<Products/>}/>
      </Route>
    </Routes>   
  );
}

export default App;
