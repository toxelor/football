import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../firebase/firebase"
import { Button } from "antd"
import './header.css'
import { signOut } from "firebase/auth"

const Header = () => {
    const navigate = useNavigate();
    const logOut = async () => {
        await signOut(auth)
        navigate('/')
    }
    return (
        <div className='header'>
        {
            auth?.currentUser ? 
            <div className="header-logged-in">
                <div style={{display: 'flex', gap: '10px'}}>
                    <Link to={'/profile'}>{auth?.currentUser?.displayName ? auth?.currentUser?.displayName : auth?.currentUser?.email.split('@')[0]}</Link>
                    <Link to={'/'}>Игры</Link>
                </div>
                <Button className="basic-button" onClick={logOut}>
                    Выйти
                </Button>
            </div>
            :
            <div className="header-logged-out">
                <Link to='/login'>Войти</Link>
                <Link to='/register'>Зарегистрироваться</Link>
                <Link to={'/'}>Игры</Link>
            </div>
        }
        </div>
    )
}

export default Header