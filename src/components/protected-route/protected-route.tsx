import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store/store';
import { Preloader } from '@ui';
import { checkAuthAsyncThunk } from '../../services/store/features/auth/authSlice';
import { getIngredientsAsyncThunk } from '../../services/store/features/ingredients/slices/ingredientsSlice';

interface IProtectedRoute {
  onlyUnAuthed?: boolean;
  children: ReactElement;
}

export function ProtectedRoute({
  onlyUnAuthed = false,
  children
}: IProtectedRoute) {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  useEffect(() => {
    dispatch(getIngredientsAsyncThunk()).finally(() => {
      dispatch(checkAuthAsyncThunk());
    });
  }, []);

  // useEffect(() => {
  //   // console.log(isAuthorized);
  // }, [isAuthorized]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthorized && !onlyUnAuthed) {
    return <Navigate to={'/login'} state={{ pageToLoad: location.pathname }} />;
  }

  if (isAuthorized && location.pathname === '/login') {
    if (
      location.state &&
      Object.hasOwn(location.state, 'pageToLoad') &&
      location.state.pageToLoad
    ) {
      return <Navigate to={location.state.pageToLoad} replace />;
    } else {
      // return <Navigate to={'/'} replace />;
      // navigate(-1);
    }
  }

  if (isAuthorized && onlyUnAuthed) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
}
