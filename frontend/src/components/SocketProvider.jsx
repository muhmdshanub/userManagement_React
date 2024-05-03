import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './../slices/authSlice.js';
import { useLogoutMutation } from '../slices/usersApiSlice.js';
import { useNavigate } from 'react-router-dom';

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [logoutApiCall] = useLogoutMutation();

  const navigate = useNavigate;

  useEffect(() => {
    
    if (userInfo && userInfo?._id) {
      
      const socket = io("http://localhost:8000"); // Initialize socket.io connection

      socket.on('force-logout', async ({ userId }) => {
       
        if (userId === userInfo._id) {
            

          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
          
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo, dispatch]);

  return <>{children}</>;
};

export default SocketProvider;
