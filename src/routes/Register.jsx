import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button, Input } from "antd";



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
    <div className="login-wrapper">
        <div className="login-card-wrapper">
            <div className="login-card-input-div">
                <Input
                    placeholder="Электронная почта" 
                    required 
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
                <Input 
                    placeholder="Пароль" 
                    required 
                    type="password"
                    onChange={(e) => {
                        setPassword1(e.target.value)
                    }}
                />
                <Input 
                    placeholder="Подтвердите пароль" 
                    required 
                    type="password"
                    onChange={(e) => {
                        setPassword2(e.target.value)
                    }}
                />
                <Button className="basic-button" onClick={registerHandler}>
                    Зарегистрироваться
                </Button>
            </div>
            <Button className="google-button" onClick={googleHandler}>
                Войти с Google
            </Button>
            <span className="switch"><Link to='../login'>Войти</Link></span>
        </div>
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