import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
const Root = () => {
    const navigate = useNavigate();
    const logOut = async () => {
        await signOut(auth)
        navigate('/')
    }

    console.log(auth?.currentUser)

    return(
        <>
            {
                auth?.currentUser ? 
                <>
                    <span>
                        {auth?.currentUser?.displayName ? auth?.currentUser?.displayName : auth?.currentUser?.email.split('@')[0]}
                    </span>
                    <button onClick={logOut}>
                        Выйти
                    </button>
                </>
                :
                <>
                    <Link to='login'>Войти</Link>
                    <br/>
                    <Link to='register'>Зарегистрироваться</Link>
                </>

            }
        </>
    )
}

export default Root