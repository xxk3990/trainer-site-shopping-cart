import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import ShoppingCart from './components/ShoppingCart';
import Orders from './components/Orders';
import Products from './components/Products';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount"
import { ProtectedRoute } from './guards/login-guard';
import { AdminRoute } from './guards/admin-guard';

function App() {
  return (
    <Routes>
       <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/createAccount" element={<CreateAccount />} />
      <Route element={<> <Navbar/> <Outlet /></>}>
        <Route path="/shoppingCart" element={<ProtectedRoute><ShoppingCart/></ProtectedRoute>}/>
        <Route path="/userOrders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        <Route path="/adminProducts" element={<ProtectedRoute><AdminRoute><Products/></AdminRoute></ProtectedRoute>}/>
      </Route>
    </Routes>   
  );
}

export default App;
