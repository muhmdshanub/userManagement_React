import React from 'react'
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import store from './store.js';
import ProfileScreen from './screens/ProfileScreen.jsx';
import SocketProvider from './components/SocketProvider.jsx';
import AdminLoginScreen from './screens/AdminLoginScreen.jsx';
import AdminDashboardScreen from './screens/AdminDashboardScreen.jsx';
import AdminUserEditScreen from './screens/AdminUserEditScreen.jsx';
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';
import AdminUserAddScreen from './screens/AdminUserAddScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginScreen />} />
      <Route path='' element={<AdminPrivateRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/user/edit/:userId" element={<AdminUserEditScreen />} />
        <Route path="/admin/user/add" element={<AdminUserAddScreen />} />
      </Route>
      
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <React.StrictMode>
      <SocketProvider> {/* Wrap SocketProvider directly around RouterProvider */}
        <RouterProvider router={router} />
      </SocketProvider>
    </React.StrictMode>
  </Provider>
);
