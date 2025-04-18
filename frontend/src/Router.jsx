import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const apiUrl = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  { path: "/", element: <Home apiUrl={apiUrl}/> },
  { path: "/about", element: <About /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}