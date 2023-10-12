import { $authHost, $host } from "./index";
import jwt_decode from 'jwt-decode'

export const registration = async (newUser) => {
    if (newUser.userId === ""){
        newUser.userId = null
    }
    const {data} = await $authHost.post('/user/reg', newUser)
}

export const login = async (login, password) => {
    const response = await $host.post('/user/login', {login, password})
    console.log('ok')
    localStorage.setItem('token', response.data.token)
    return (jwt_decode(response.data.token))
}

export const check = async () => {
    const response = await $authHost.get('user/check' )
    localStorage.setItem('token', response.data.token)
    return jwt_decode(response.data.token)
}

export const getMyExec = async () => {
    const {data} = await $authHost.post('user/myExec' )
    return data
}

export const getBosses = async () => {
    const {data} = await $authHost.post('user/Bosses' )
    return data
}


export const logout = async () => {
    localStorage.setItem('token', '')
}