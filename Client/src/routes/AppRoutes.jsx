import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/app/pages/Home';

const AppRoutes = () => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />
        }
    ])

    return (
        <div>AppRoutes</div>
    )
}

export default AppRoutes