// PrivateRoute.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const user = useSelector((state) => state.user);



  if (!user.isLogin) {
    console.log(user.isLogin);
    return <Navigate to="/user/sign-in" />;
  }
  
  if (user.loginUserRole !== role) {
    console.log(user.loginUserRole);
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
