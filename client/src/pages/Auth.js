import React, {useContext, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { login } from '../http/userApi';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { redirect } from 'react-router-dom';

const Auth = observer(() => {
    const {user} = useContext(Context)
    const [loginUser, setLoginUser] = useState('')
    const [password, setPassword] = useState('')
    const signIn = async () => {
        try {
            const data = await login(loginUser, password)
            user.setUser(data)
            user.setIsAuth(true)
            window.location.reload()
        }
        catch (e) {
            alert(e.response.data.message)
        }       
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto"> Авторизация </h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={loginUser}
                        onChange={e => setLoginUser(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        className="mt-3"
                        onClick={signIn}
                    >
                        Войти
                    </Button>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;