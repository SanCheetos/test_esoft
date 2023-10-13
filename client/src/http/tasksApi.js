import { $authHost, $host } from "./index";
import jwt_decode from 'jwt-decode'

export const getAll = async (ordering) => {
    const {data} = await $authHost.get('/task/', {params: {ordering}})
    return data
}

export const getOne = async (id) => {
    const {data} = await $authHost.get(`/task/${id}`)
    return data
}

export const update = async (
    id, 
    heading, 
    desc, 
    dateComplete, 
    priority,
    status,
    executor_id,
    onlyStatus) => {
    const response = await $authHost.post(`/task/update/${id}`, { 
        heading, 
        desc, 
        dateComplete, 
        priority, 
        status,
        executor_id,
        onlyStatus
    })
    return response
}


export const newTask = async ( 
    heading, 
    desc, 
    dateComplete, 
    priority, 
    executor_id) => {
    const response = await $authHost.post('/task/new', {
        heading, 
        desc, 
        dateComplete, 
        priority,
        executor_id
    })
    return response
}