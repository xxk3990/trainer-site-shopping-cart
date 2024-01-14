import '../styles/landing.css'
import { useNavigate } from 'react-router-dom'
export default function Landing() {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login')
    }
    const navigateToCreateAccount = () => {
        navigate('/createAccount')
    }
     return (
        <div className='Landing'>
            <h1>Landing Page</h1>
            <section className='account-btns'>
                <button type="button" onClick={navigateToLogin}>Login</button>
                <button type="button" onClick={navigateToCreateAccount}>Create Account</button>
            </section>
        </div>
    )
}