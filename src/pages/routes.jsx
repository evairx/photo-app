import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/home";
import Photo from "@/pages/photo";
import Settings from "@/pages/settings";
import Signup from './singup'
import Login from './login'
import TwoFactorSetUp from './two-factor/setup'
import Test from './test'
import Test2 from './test2'

const routes = [
    { 
        path: "/", 
        element: <Home /> 
    },
    { 
        path: "/photo/:id", 
        element: <Photo />,
        loader: async ({ params }) => {
            return { id: params.id };
        }
    },
    { 
        path: "/settings", 
        element: <Settings /> 
    },
    {
        path: "/login",
        element: <Login />
    },
    { 
        path: "/signup", 
        element: <Signup /> 
    },
    {
        path: "/two-factor/setup",
        element: <TwoFactorSetUp />
    },
    {
        path: "/test",
        element: <Test />
    },
    {
        path: "/test2",
        element: <Test2 />
    },
    { 
        path: "*", 
        element: <Home /> 
    },
]

const router = createBrowserRouter(routes, {
    future: {
        v7_relativeSplatPath: true,
    },
});

export default function Routes() {
  return <RouterProvider future={{ v7_startTransition: true, }} router={router} />;
}