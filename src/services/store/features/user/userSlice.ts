import {
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TAuthResponse,
  TFeedsResponse,
  TLoginData,
  TRefreshResponse,
  TRegisterData,
  TServerResponse,
  TUserResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RequestState,
  TIngredient,
  TOrder,
  TTabMode,
  TUser
} from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../../../utils/cookie';
import { RootState } from '../../store';
import { checkAuthAsyncThunk } from '../auth/authSlice';

interface IUserSliceState {
  orders: TOrder[];
  orderData: TOrder;
  // isAuthorized: boolean;
  // isAuthChecked: boolean;
  isLoading: boolean;
  // responseMessage: string | null;
  actionState: RequestState;
}

const initialState: IUserSliceState = {
  // user: {
  //   email: '',
  //   name: ''
  // },
  actionState: RequestState.none,
  // responseMessage: null,
  isLoading: false,
  // isAuthorized: false,
  // isAuthChecked: false,
  orders: [],
  orderData: {
    _id: '',
    status: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 0,
    ingredients: []
  }
};

// export const logoutUserThunk = createAsyncThunk(
//   'user/logoutUserThunk',
//   async function () {
//     if (localStorage.getItem('refreshToken')) {
//       return logoutAsyncThunk();
//     } else {
//       return Promise.reject();
//     }
//   }
// );

export const getOrdersAsyncThunk = createAsyncThunk(
  'user/getOrdersAsyncThunk',
  async function (_, { dispatch }) {
    // await dispatch(checkAuthAsyncThunk());
    return getOrdersApi();
  }
);

// export const loginAsyncThunk = createAsyncThunk(
//   'user/loginAsyncThunk',
//   async function (data: TLoginData): Promise<TAuthResponse> {
//     return loginUserApi(data);
//   }
// );

// export const registerAsyncThunk = createAsyncThunk(
//   'user/registerAsyncThunk',
//   async function (data: TRegisterData): Promise<TAuthResponse> {
//     return registerUserApi(data);
//   }
// );

// export const logoutAsyncThunk = createAsyncThunk(
//   'user/logoutAsyncThunk',
//   async function (): Promise<TServerResponse<{}>> {
//     return logoutApi();
//   }
// );

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getOrdersAsyncThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrdersAsyncThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(
        getOrdersAsyncThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload ?? [];
          state.isLoading = false;
        }
      );

    // .addCase(logoutUserThunk.fulfilled, (state, action) => {
    //   // state.user = {
    //   //   email: '',
    //   //   name: ''
    //   // };
    //   deleteCookie('accessToken');
    //   localStorage.removeItem('refreshToken');
    //   // state.isAuthorized = false;
    // })
    // .addCase(logoutUser.rejected, (state, action) => {
    // })
  },
  selectors: {}
});

// export const { getMains } = ingredientsSlice.selectors;

export default userSlice.reducer;
