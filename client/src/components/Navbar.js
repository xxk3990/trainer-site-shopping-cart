import logo from '../logo.svg';
import '../styles/navbar.css'
import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleLogout } from '../services/auth-service';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { minsTillLogout } from '../services/auth-service';
import { useLogoutTimer } from '../hooks/useLogoutTimer';
export default function Navbar() {
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [minutes, setMinutes] = useState(minsTillLogout(Date.now()));
    const [seconds, setSeconds] = useState(localStorage.getItem("seconds"))
    
    useLogoutTimer(minutes, setMinutes, seconds, setSeconds) //call logout timer hook
    const navigate = useNavigate()
    const callLogout = async () => {
        setOpenSnackbar(true)
        setTimeout(async() => {
            await handleLogout()
            setOpenSnackbar(false)
            navigate("/")
        }, 2000)
    }
    const role = localStorage.getItem("userRole")
    if(role === "Admin") {
        return (
            <div className='Navbar'>
                <Snackbar open={openSnackbar} autoHideDuration={2000} message="Logging out..." anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                <section className='nav-loggedin'>
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/shoppingCart'>Shopping Cart</Link></li>
                        <li className='nav-item'><Link to='/userOrders'>Orders</Link></li>
                        <li className='nav-item'><Link to ='/adminProducts'>Products</Link></li>
                        <li className='nav-item'><button type="button" className='logout-btn' onClick={callLogout}>Logout</button></li>
                        <li className='nav-item-static'>{minutes <= 1 ? `Automatic logout in ${seconds} seconds` : `Automatic logout in ${minutes} minutes`}</li>
                    </ul>
                </section>
            </div>
        )
    } else {
        return (
            <div className='Navbar'>
                <Snackbar open={openSnackbar} autoHideDuration={2000} message="Logging out..." anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                <section className='nav-loggedin'>
                    <ul className = "nav-links">
                        <li className='nav-item'><Link to='/shoppingCart'>Shopping Cart</Link></li>
                        <li className='nav-item'><Link to='/userOrders'>Orders</Link></li>
                        <li className='nav-item'><button className='logout-btn' type="button" onClick={callLogout}>Logout</button></li>
                        <li className='nav-item-static'>{ minutes <= 1 ? `Automatic logout in ${seconds} seconds` : `Automatic logout in ${minutes} minutes`}</li>
                    </ul>
                </section>
            </div>
        )
    }
    
}