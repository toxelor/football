import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import Root from './routes/root.jsx';
import Game from './routes/Game.jsx';
import Profile from './routes/Profile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/profile",
    element: <Profile/>
  },
  {
    path: 'game',
    element: <Game />,
    children: [
      {
        element: <Game />,
        path: ':id',
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
