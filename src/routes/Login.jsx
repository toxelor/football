import { Link, redirect } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [snackBar, setSnackBar] = useState({open: false, err: ''})

    const loginHandler = async() => {
        if (email === '' || password === '') {
            setSnackBar({open: true, err: 'Пожалуста, заполните все поля'})
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password)
                navigate('../')
            } catch (error) {
                setSnackBar({open: true, err: JSON.stringify(error)})
            }
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackBar({open: false, err: ''});
    };

    const googleHandler = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            navigate('../')
        } catch(error) {
            console.log(error)
            setSnackBar({open: true, err: JSON.stringify(error)}) 
        }
    }

    return (
    <div style={{
        display: "flex",
        flexDirection: 'column'
    }}>
        <input
            placeholder="Электронная почта" 
            required 
            onChange={(e) => {
                setEmail(e.target.value)
            }}
        />
        <input 
            placeholder="Пароль" 
            required 
            onChange={(e) => {
                setPassword(e.target.value)
            }}
        />
        <button onClick={loginHandler}>
            Войти
        </button>
        <p>
            Или
        </p>
        <button onClick={googleHandler}>
            Войти с Google
        </button>
        <span>Нет аккаунта? <Link to='../register'>Зарегистрируйтесь</Link></span>
        <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'top' }} open={snackBar.open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
            >
            {snackBar.err}
            </Alert>
        </Snackbar>
    </div>
    )
}

export default Login