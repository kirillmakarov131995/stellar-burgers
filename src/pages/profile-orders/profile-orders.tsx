import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { getOrdersAsyncThunk } from '../../services/store/features/user/userSlice';
import { Preloader } from '@ui';
import { checkAuthAsyncThunk } from 'src/services/store/features/auth/authSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.user.orders);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    // dispatch(checkAuthAsyncThunk());

    dispatch(getOrdersAsyncThunk());
  }, []);

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
