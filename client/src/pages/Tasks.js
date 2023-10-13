import React, { useContext, useEffect, useMemo, useState } from 'react';
import {Container, Form, Row, Spinner, } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { getBosses, getMyExec, logout, registration } from '../http/userApi';
import { getAll, getOne, newTask, update } from '../http/tasksApi';

const Tasks = observer(() => {
    const {user, tasks} = useContext(Context)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isTaskForm, setIsTaskForm] = useState(false)

    const [idTask, setIdTask] = useState(-1)
    const [heading, setHeading] = useState('')
    const [desc, setDesc] = useState('')
    const [dateComplete, setDateComplete] = useState('')
    const [executor_id, setExecutor_id] = useState(-1)
    const [priority, setPriority] = useState('')
    const [status, setStatus] = useState('')

    const nowDate = new Date()
    const stringNowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate()
    
    //админ-------------------
    const [adminPanel, setAdminPanel] = useState(false)
    const [newUser, setNewUser] = useState({login: '', password: '', name: '', lastName: '', patronymic: '', userId: ''})
    const createUser = (() => {})
    const deleteTask = (() => {})
    //------------------------

    const [taskChanged, setTaskChanged] = useState(false)

    const [ordering, setOrdering] = useState({time: 'week+', executor: -1})
    //const [executors, setExecutors] = useState({})

    

    const getAllTasks = () => {
        return getAll(ordering)
    }

    const crudTask = async () => {
        if (idTask === -1){
            await newTask(heading, desc, dateComplete, priority, executor_id)// heading, desc, dateComplete, priority, executor_id
        }
        else {
            const onlyStatus = user.user.userId !== []
            await update(idTask, heading, desc, dateComplete, priority, status, executor_id, onlyStatus)
        }
        setIsTaskForm(false)
        setTaskChanged(!taskChanged)
    }

    const addUser = async () => {
        try{
            await registration(newUser)
            setTaskChanged(!taskChanged)
            alert("Пользователь успешно добавлен")
        }
        catch (e){
            alert(e.response.data.messege)
        }
    }

    const deleteUser = async (id) => {
        try{
            await registration(newUser)
            setTaskChanged(!taskChanged)
            alert("Пользователь успешно добавлен")
        }
        catch (e){
            alert(e.response.data.messege)
        }
    }


    
    const getOneTask = useMemo(async () => {
        if (idTask === -1){
            setHeading('')
            setDesc('')
            setDateComplete('')
            setPriority('')
            setStatus('')
        }
        else{
            const data = await getOne(idTask)
            console.log(data)
            setHeading(data.heading)
            setDesc(data.desc)
            setDateComplete(data.dateComplete)
            setExecutor_id(data.executor_id)
            setPriority(data.priority)
            setStatus(data.status)
        }
    }, [idTask])

    useEffect(() => {
        console.log('Effect')
        getAllTasks().then(data => {
            tasks.setTasks(data)
        })
        getMyExec().then(data => {
            tasks.setExecutors(data.users)
        })
        if (user.user.name === "root"){
            getBosses().then((data) => {
                tasks.setBosses(data.users)
                console.log(tasks.bosses)
            })
        }
    }, [taskChanged, ordering])    

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        logout()
        window.location.reload()
    }
    return (
        <div className='p-5'>
            <h1>Добро пожаловать, {user.user.name}</h1>
            <Button className='mt-3' onClick={logOut}>
                Выйти
            </Button>
            <Button className='m-3 mb-0' onClick={async () => {
                setIdTask(-1)
                setIsTaskForm(true)
                }}>
                Новая задача
            </Button>
            {user.user.name === "root"
            &&
                <div className='mt-3'>
                    <Button onClick={() => setAdminPanel(true)}>Показать админ-панель</Button>
                </div>
                
            }
            <Card style={{width: 1000}} className="p-5 mt-3">
                <div>
                    <h3>Задание на:</h3>
                    <Form.Select value={ordering.time} onChange={(e) => setOrdering({...ordering, time: e.target.value})}>
                        <option value="today">Сегодня</option>
                        <option value="week">Неделю</option>
                        <option value="week+">Более, чем неделю</option>
                    </Form.Select>
                </div>
                {tasks.executors.length > 0
                &&
                <div>
                    <h3>Ответственный:</h3>
                    <Form.Select value={ordering.executor} onChange={(e) => setOrdering({...ordering, executor: e.target.value})}>
                        {tasks.executors.map(executor => 
                            <option key={executor.id} value={executor.id}>
                                {executor.lastName} {executor.name} {executor.patronymic}
                            </option>
                            
                        )}
                        <option value="-1">
                                Все
                        </option>
                    </Form.Select>
                </div>
                }
                
            </Card>
            
            
            <Container
                className="d-flex flex-column justify-content-center align-items-center"
                style={{}}
            >
                <h1 className="mb-5">Задачи</h1>
                {tasks.tasks.map(task => 
                    <Card key={task.id} style={{width: 600}} className=" d-flex p-3 mb-5" onClick={async () => {
                        setIdTask(task.id)
                        setIsTaskForm(true)
                        }}>
                    <h3 className="text-left" style={task.status == "Выполнена" ? {color: 'green'} : task.dateComplete < stringNowDate ? {color: 'red'} : {color: 'grey'}}> {task.heading} </h3>
                    <p><b>Приоритет: </b> {task.priority} </p>
                    <p><b>Дата окончания: </b> {task.dateComplete} </p>
                    <p><b>Ответственный: </b>{task.Executor.lastName} {task.Executor.name} {task.Executor.patronymic} </p>
                    <p><b>Статус: </b> {task.status} </p>
                </Card>
                )}
            </Container>
            {isTaskForm
            &&
                <div 
                className='position-fixed top-0 bottom-0 right-0 left-0' 
                style={{backgroundColor: 'rgba(0,0,0,0.75)', width: window.innerWidth, }}>
                <Container
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{minHeight: window.innerHeight}}
                >
                    <Card style={{width: 600}} className="p-5">
                        <h2 className="m-auto"> {idTask !== 0 ? heading : 'Новая задача'} </h2>
                        <Form className="d-flex flex-column">
                            <div  className="mt-3">
                                <p>Заголовок</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={heading}
                                    disabled={(idTask !== 0 && executor_id === user.user.id)}
                                    onChange={(e) => setHeading(e.target.value)}
                                />
                            </div>

                            <div  className="mt-4">
                                <p>Описание</p>
                                <Form.Control
                                    placeholder="Введите описание"
                                    value={desc}
                                    disabled={(idTask !== 0 && executor_id === user.user.id)}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </div>

                            <div  className="mt-4">
                                <p>Дата выполнения</p>
                                <Form.Control
                                    type="date"
                                    value={dateComplete}
                                    disabled={(idTask !== 0 && executor_id === user.user.id)}
                                    onChange={(e) => setDateComplete(e.target.value)}
                                />
                            </div>
                            
                            <div  className="mt-4">
                                <p>Приоритет</p>
                                <Form.Select 
                                    disabled={(idTask !== 0 && executor_id === user.user.id)} 
                                    value={priority} 
                                    onChange={(e) => setPriority(e.target.value)}>
                                    <option value="Низкий">Низкий</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Высокий">Высокий</option>
                                </Form.Select>
                            </div>

                            {idTask !== -1 
                            &&
                            <div  className="mt-4">
                                <p>Статус</p>
                                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="К выполнению">К выполнению</option>
                                    <option value="Выполняется">Выполняется</option>
                                    <option value="Выполнена">Выполнена</option>
                                    <option value="Отменена">Отменена</option>
                                </Form.Select>
                            </div>
                            }
                            

                            <div  className="mt-4">
                                <p>Ответственный</p>
                                <Form.Select 
                                    disabled={(idTask !== 0 && executor_id === user.user.id)}
                                    value={executor_id} 
                                    onChange={(e) => {setExecutor_id(e.target.value)}}>
                                    {tasks.executors.map(executor => 
                                        <option key={executor.id} value={executor.id}>
                                            {executor.lastName} {executor.name} {executor.patronymic}
                                        </option>
                                        
                                    )}
                                </Form.Select>
                            </div>
                            <div className="container mt-3">
                                <div className="row">
                                    <Button className='col' onClick={() => setIsTaskForm(false)}>
                                        Отмена
                                    </Button>
                                    <span className='col' > </span>
                                    <Button className='col' onClick={crudTask}>
                                    {idTask !== -1 ? 'Изменить' : 'Добавить'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </Container>
            </div>
            }
            {adminPanel
            &&
                <div 
                className='position-fixed top-0 bottom-0 right-0 left-0' 
                style={{backgroundColor: 'rgba(0,0,0,0.75)', width: window.innerWidth, }}>
                <Container
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{minHeight: window.innerHeight}}
                >
                    <Card style={{width: 600}} className="p-5">
                        <h2 className="m-auto"> Добавить пользователя </h2>
                        <Form className="d-flex flex-column">
                            <div  className="mt-3">
                                <p>Фамилия</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                />
                            </div>

                            <div  className="mt-3">
                                <p>Имя</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                />
                            </div>

                            <div  className="mt-3">
                                <p>Отчество</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={newUser.patronymic}
                                    onChange={(e) => setNewUser({...newUser, patronymic: e.target.value})}
                                />
                            </div>

                            <div  className="mt-3">
                                <p>Логин</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={newUser.login}
                                    onChange={(e) => setNewUser({...newUser, login: e.target.value})}
                                />
                            </div>

                            <div  className="mt-3">
                                <p>Пароль</p>
                                <Form.Control
                                    placeholder="Введите заголовок"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    type='password'
                                />
                            </div>

                            <div  className="mt-4">
                                <p>Руководитель</p>
                                <Form.Select value={newUser.userId}
                                    onChange={(e) => {setNewUser({...newUser, userId: e.target.value})}}>
                                    {tasks.bosses.map(boss => 
                                        <option key={boss.id} value={boss.id}>
                                            {boss.lastName} {boss.name} {boss.patronymic}
                                        </option>
                                        
                                    )}
                                    <option value="">
                                        Назначить пользователя руководителем
                                    </option>
                                </Form.Select>
                            </div>

                            
                            <div className="container mt-3">
                                <div className="row">
                                    <Button className='col' onClick={() => setAdminPanel(false)}>
                                        Отмена
                                    </Button>
                                    <span className='col' > </span>
                                    <Button className='col' onClick={addUser}>
                                    {idTask !== -1 ? 'Изменить' : 'Добавить'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </Container>
            </div>
            }
            
        </div>
        
    );
});

export default Tasks;