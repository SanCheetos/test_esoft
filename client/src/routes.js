import Tasks from "./pages/Tasks";
import Auth from "./pages/Auth";
import { Navigate } from "react-router";


export const privateRoutes = [
    {path: "/tasks", element: <Tasks/>, exact: true},
    {path: "*", element: <Navigate to="/tasks"/>, exact: true}

];

export const publicRoutes = [
    {path: "/auth", element: <Auth/>, exact: true},
    {path: "*", element: <Navigate to="/auth"/>, exact: true},
];