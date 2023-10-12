import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from "../routes";
import { Context } from '../index';
const AppRouter = () => {
    const {user} = useContext(Context)
    return (
            <Routes>
                { user.isAuth ? privateRoutes.map(route => 
                <Route
                    
                    path={route.path}
                    exact={route.exact}
                    element={route.element}
                    key={route.path}
                    handle={route.handle}
                />  
                )
                :
                publicRoutes.map(route => 
                    <Route
                        
                        path={route.path}
                        exact={route.exact}
                        element={route.element}
                        key={route.path}
                        handle={route.handle}
                    />  
                )
            }
            </Routes> 
    )
}

export default AppRouter;