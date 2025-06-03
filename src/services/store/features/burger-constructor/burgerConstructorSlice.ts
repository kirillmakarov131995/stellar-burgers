import { orderBurgerApi, TNewOrderResponse } from '@api';
import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { getCookie } from 'src/utils/cookie';
import { v4 as uuidv4 } from 'uuid';
import { checkAuthAsyncThunk } from '../auth/authSlice';
import { RootState } from '../../store';

interface IConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface IBurgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const makeOrderAsyncThunk = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { state: RootState }
>('burgerConstructor/makeOrderAsyncThunk', async function (data: string[]) {
  return orderBurgerApi(data);
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientIntoConstructor: (
      state,
      action: PayloadAction<TIngredient>
    ) => {
      // console.log(action.payload);
      if (action.payload) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          const id = uuidv4();
          state.constructorItems.ingredients.push({
            ...action.payload,
            id
          });
        }
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<{ item: TConstructorIngredient }>
    ) => {
      const selectedItem = action.payload.item || null;

      if (selectedItem) {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter(
            (item) => item.id !== selectedItem.id
          );
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(
        makeOrderAsyncThunk.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          if (action.payload.success) {
            state.constructorItems = {
              bun: null,
              ingredients: []
            };
            state.orderRequest = false;
          }
        }
      )
      .addCase(makeOrderAsyncThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(makeOrderAsyncThunk.rejected, (state, action) => {
        state.orderRequest = false;
        console.log(action.payload);
      });
  }
});

export const { addIngredientIntoConstructor, removeIngredient } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
