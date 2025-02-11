import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/home";
import Photo from "@/pages/photo";
import Settings from "@/pages/settings";

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