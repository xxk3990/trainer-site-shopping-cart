import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleGet } from '../services/requests-service';
import '../styles/orders.css';
import { checkAuth } from '../services/auth-service';
import { addDecimal } from '../util-methods';
export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const getOrders = async() => {
        const authorized = await checkAuth()
        if(authorized === false) {
            localStorage.clear();
            navigate("/login")
        }
        const endpoint = `orders?userID=${localStorage.getItem("user_uuid")}`
        handleGet(endpoint, setOrders)
    }
    useEffect(() => {
        document.title = "Your Orders"
        getOrders()
    },[])
    
    if(orders.length === 0) {
        return (
            <div className='Orders'>No Orders yet.</div>
        )
    } else {
        return (
            <div className='Orders'>
                <section className='orders-grid'>
                    {orders.map(odr => {
                        return <OrderTile odr={odr} />
                    })}
                </section>
            </div>
        )
    }

}
const OrderTile = (props) => {
    //TODO: GET ALL PRODUCTS OF ORDER TO APPEAR. RIGHT NOW IT IS JUST THE FIRST ONE.
    const odr = props.odr;
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [details, setDetails] = useState([])
    const getProductsInOrder = () => {
        //this loop should get each product but even though it's in a loop it still only gets the first one
        odr.items_in_order.forEach(async od => {
            const host = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
            const endpoint = `productDetails?product=${od.product_uuid}`
            await fetch(`${host}/${endpoint}`, {
                method: 'GET',
                credentials: "include"
            }, []).then(res => res.json()).then(data => {
                console.log("data from server:", data)
                setDetails([{
                    ...data,
                    quantity: od.quantity
                }])
            })
            console.log("details:", details)
        })
    }
   
    return (
        <section className='order-info'>
            <h3>Date: {odr.order_date}</h3>
            <p>Amount: ${addDecimal(odr.order_total)}</p>
            <button onClick ={() => {
                getProductsInOrder()
                setShowOrderDetails(!showOrderDetails);
            }}>{showOrderDetails ? `Close ${String.fromCharCode(8593)}` : `View Details ${String.fromCharCode(8595)}`}</button>
            {showOrderDetails ? 
            <ul className='order-products-list'> 
                {details.map(det => {
                    return(<li><OrderProduct det={det}/></li>)
                })} 
            </ul>
            : null} 
        </section>
        
    )
}

const OrderProduct = (props) => {
    const det = props.det;
    return (
        <section className='order-details'>
            <h4>Name: {det.product_name}, {det.quantity} </h4>
            <p>Price: ${addDecimal(det.price * det.quantity)}</p>
        </section>
    )
}
