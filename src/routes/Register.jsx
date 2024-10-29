import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";



const Register = () => {
    const navigate = useNavigate();

    const registerHandler = async () => {
        if (email === '' || password1 === '' || password2 === '') {
            setSnackBar({open: true, err: 'Пожалуста, заполните все поля'})
        } else if (password1 !== password2) {
            setSnackBar({open: true, err: 'Пароли должны сопадать'})
        } else {
            try {
                await createUserWithEmailAndPassword(auth, email, password1)
                navigate('../')
            } catch(error) {
                console.log(error)
                setSnackBar({open: true, err: JSON.stringify(error)})
            }

        }
    }

    const googleHandler = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            navigate('../')
        } catch(error) {
            console.log(error) 
            setSnackBar({open: true, err: JSON.stringify(error)})
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackBar({open: false, err: ''});
    };

    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [snackBar, setSnackBar] = useState({open: false, err: ''})

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
                setPassword1(e.target.value)
            }}
        />
        <input 
            placeholder="Подтвердите пароль" 
            required 
            onChange={(e) => {
                setPassword2(e.target.value)
            }}
        />
        <button onClick={registerHandler}>
            Зарегистрироваться
        </button>
        <p>
            Или
        </p>
        <button onClick={googleHandler}>
            Войти с Google
        </button>
        <span><Link to='../login'>Войти</Link></span>
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

export default Register