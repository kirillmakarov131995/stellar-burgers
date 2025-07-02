import { configureStore, Store } from '@reduxjs/toolkit';
import appSlice, {
  initialState as appInitialState
} from '../../store/features/app/appSlice';
import authSlice, {
  initialState as authInitialState,
  checkAuthAsyncThunk,
  loginAsyncThunk,
  logoutAsyncThunk,
  registerAsyncThunk,
  updateUserDataAsyncThunk
} from '../features/auth/authSlice';
import burgerConstructorSlice, {
  addIngredientIntoConstructor,
  initialState as burgerConstructorInitialState,
  IBurgerConstructorState,
  makeOrderAsyncThunk,
  moveIngredient,
  removeIngredient
} from '../features/burger-constructor/burgerConstructorSlice';
import feedSlice, {
  initialState as feedInitialState,
  getFeedsAsyncThunk,
  getOrderByIDAsyncThunk
} from '../features/feed/feedSlice';
import ingredientsSlice, {
  initialState as ingredientsInitialState
} from '../features/ingredients/ingredientsSlice';
import userSlice, {
  getOrdersAsyncThunk,
  initialState as userInitialState
} from '../features/user/userSlice';
import {
  TAuthResponse,
  TFeedsResponse,
  TNewOrderResponse,
  TOrderResponse,
  TUserResponse
} from '@api';
import { after, before } from 'node:test';
import 'jest-localstorage-mock';
import { getCookie } from '../../../utils/cookie';
import { ingredients } from '../features/burger-constructor/ingredients';
import { AppDispatch, RootState } from '../store';

describe('Testing initial states of the reducers', () => {
  test('Testing appReducer state', () => {
    let state = appSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(appInitialState);
  });
  test('Testing authSlice state', () => {
    let state = authSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(authInitialState);
  });
  test('Testing ingredientsSlice state', () => {
    let state = ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(ingredientsInitialState);
  });
  test('Testing burgerConstructorSlice state', () => {
    let state = burgerConstructorSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(burgerConstructorInitialState);
  });
  test('Testing userSlice state', () => {
    let state = userSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(userInitialState);
  });
  test('Testing feedSlice state', () => {
    let state = feedSlice(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(feedInitialState);
  });
});

describe('Testing async requests of the features', () => {
  const fetch = global.fetch;
  const globalDocument = global.document;

  beforeAll(() => {
    global.document = {
      ...global.document,
      cookie: ''
    };
  });

  afterAll(() => {
    global.fetch = fetch;
    global.document = globalDocument;
  });

  afterEach(() => {
    global.localStorage.clear();
    global.document.cookie = '';
  });

  const initialIngredientsState: IBurgerConstructorState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  };

  const data = {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: '25662f89-75e6-4e73-9391-757f0f14f4f6',
    success: true,
    user: {
      email: 'mickey@email.com',
      name: 'Mickey'
    }
  };

  describe('Testing async requests of the authSlice', () => {
    describe('Testing registerAsyncThunk requests of the authSlice', () => {
      test('Testing fulfilled response of the registerAsyncThunk', async () => {
        const expectedResult: TAuthResponse = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          success: true,
          user: data.user
        };
        global.fetch = jest.fn(
          (): Promise<{ ok: 200; json: () => Promise<TAuthResponse> }> =>
            Promise.resolve({
              ok: 200,
              json: () => Promise.resolve(expectedResult)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice }
        });

        await store.dispatch(
          registerAsyncThunk({
            email: 'mickey@email.com',
            name: 'Mickey',
            password: '123123'
          })
        );

        expect(store.getState().auth.requestState).toBe('success');
      });

      test('Testing rejected response of the registerAsyncThunk', async () => {
        const expectedResult = {
          success: false
        };

        global.fetch = jest.fn(
          (): Promise<{ json: () => Promise<any> }> =>
            Promise.resolve({
              json: () => Promise.resolve(expectedResult)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice }
        });

        await store.dispatch(
          registerAsyncThunk({
            email: 'mickey@email.com',
            name: 'Mickey',
            password: '123123'
          })
        );

        expect(store.getState().auth.requestState).toBe('failed');
      });
    });

    describe('Testing logoutAsyncThunk requests of the authSlice', () => {
      test('Testing failed response no refreshToken', async () => {
        before(() => {
          global.localStorage.clear();
        });

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(logoutAsyncThunk());

        expect(store.getState().auth.user).toEqual(data.user);
        expect(store.getState().auth.isAuthorized).toBe(true);
      });

      test('Testing fulfilled response of the logoutAsyncThunk', async () => {
        before(() => {
          global.localStorage.setItem('refreshToken', data.refreshToken);
        });

        global.fetch = jest.fn(
          (): Promise<{ ok: 200; json: () => Promise<TAuthResponse> }> =>
            Promise.resolve({
              ok: 200,
              json: () => Promise.resolve(data)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(logoutAsyncThunk());

        expect(store.getState().auth.user).toEqual(null);
        expect(store.getState().auth.isAuthorized).toEqual(false);
        expect(global.localStorage.getItem('refreshToken')).toEqual(null);
      });
    });

    describe('Testing updateUserDataAsyncThunk requests of the authSlice', () => {
      test('Testing fulfilled response of the updateUserDataAsyncThunk', async () => {
        const newUserData = {
          email: 'mickeyNewBorn@email.com',
          name: 'MickeyNewBorn'
        };

        global.fetch = jest.fn(
          (): Promise<{ ok: 200; json: () => Promise<TUserResponse> }> =>
            Promise.resolve({
              ok: 200,
              json: () => Promise.resolve({ ...data, user: newUserData })
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(updateUserDataAsyncThunk(newUserData));

        expect(store.getState().auth.user).toEqual(newUserData);
        expect(store.getState().auth.isAuthorized).toEqual(true);
        expect(store.getState().auth.requestState).toEqual('success');
      });

      test('Testing failed response of the updateUserDataAsyncThunk', async () => {
        const newUserData = {
          email: 'mickeyNewBorn@email.com',
          name: 'MickeyNewBorn'
        };

        global.fetch = jest.fn(
          (): Promise<{ json: () => Promise<TUserResponse> }> =>
            Promise.resolve({
              json: () => Promise.resolve({ ...data, user: newUserData })
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(updateUserDataAsyncThunk(newUserData));

        expect(store.getState().auth.user).toEqual(data.user);
        expect(store.getState().auth.isAuthorized).toEqual(true);
        expect(store.getState().auth.requestState).toEqual('failed');
      });
    });

    describe('Testing loginAsyncThunk requests of the authSlice', () => {
      const userInputs = {
        email: data.user.email,
        password: '123123'
      };

      test('Testing fulfilled response of the loginAsyncThunk', async () => {
        after(() => {
          global.localStorage.clear();
        });

        global.fetch = jest.fn(
          (): Promise<{ ok: 200; json: () => Promise<TAuthResponse> }> =>
            Promise.resolve({
              ok: 200,
              json: () => Promise.resolve(data)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(loginAsyncThunk(userInputs));

        expect(store.getState().auth.user).toEqual(data.user);
        expect(store.getState().auth.isAuthorized).toBe(true);
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.requestState).toBe('success');
        expect(global.localStorage.getItem('refreshToken')).toBe(
          data.refreshToken
        );
      });

      test('Testing failed response of the loginAsyncThunk', async () => {
        before(() => {
          global.localStorage.clear();
        });
        global.fetch = jest.fn(
          (): Promise<{ json: () => Promise<TAuthResponse> }> =>
            Promise.reject({
              json: () => Promise.reject(data)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        await store.dispatch(loginAsyncThunk(userInputs));

        expect(store.getState().auth.user).toBe(null);
        expect(store.getState().auth.isAuthorized).toBe(false);
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.requestState).toBe('failed');
        expect(global.localStorage.getItem('refreshToken')).toBe(null);
      });
    });

    describe('Testing checkAuthAsyncThunk requests of the authSlice', () => {
      test('Testing checkAuthAsyncThunk user has accessToken and fulfilled response', async () => {
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;

        global.fetch = jest.fn(
          (): Promise<{ ok: 200; json: () => Promise<TUserResponse> }> =>
            Promise.resolve({
              ok: 200,
              json: () => Promise.resolve(data)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(data.accessToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(true);
        expect(store.getState().auth.user).toEqual(data.user);
      });
      test('Testing checkAuthAsyncThunk user has accessToken and refreshToken and rejected response', async () => {
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;

        global.fetch = jest.fn(
          (data): Promise<{ ok: boolean; json: () => Promise<typeof data> }> =>
            Promise.reject({
              ok: true,
              json: () => Promise.reject(data)
            })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(data.accessToken);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(false);
        expect(store.getState().auth.user).toEqual(null);
      });
      test('Testing checkAuthAsyncThunk user has accessToken and refreshToken, accessToken is not valid, but refreshToken is valid', async () => {
        let firstAuthChecked = false;

        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;
        global.fetch = jest.fn((url: string) => {
          if (url.includes('/auth/user')) {
            if (!firstAuthChecked) {
              firstAuthChecked = true;
              return Promise.reject({ ok: false, message: 'jwt expired' });
            }
          }
          if (url.includes('/auth/token')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(data)
            });
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(data)
          });
        }) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(data.accessToken);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(true);
        expect(store.getState().auth.user).toEqual(data.user);
      });
      test('Testing checkAuthAsyncThunk user has accessToken and refreshToken, both are invalid', async () => {
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;
        global.fetch = jest.fn((url: string) => {
          if (url.includes('/auth/user')) {
            return Promise.reject({ ok: false, message: 'jwt expired' });
          }
          if (url.includes('/auth/token')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(data)
            });
          }

          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(data)
          });
        }) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(data.accessToken);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(false);
        expect(store.getState().auth.user).toEqual(null);
      });

      test('Testing checkAuthAsyncThunk user has no accessToken but has refreshToken, refreshToken is valid', async () => {
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = '';
        global.fetch = jest.fn((url: string) =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(data)
          })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(undefined);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(true);
        expect(store.getState().auth.user).toEqual(data.user);
      });
      test('Testing checkAuthAsyncThunk user has no accessToken and has refreshToken, refreshToken is invalid', async () => {
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = '';
        global.fetch = jest.fn((url: string) => {
          if (url.includes('/auth/user')) {
            return Promise.reject({ ok: false });
          }
          if (url.includes('/auth/token')) {
            return Promise.resolve({
              ok: false,
              json: () => Promise.resolve(data)
            });
          }

          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve(data)
          });
        }) as jest.Mock;

        const store = configureStore({
          reducer: { auth: authSlice },
          preloadedState: {
            auth: {
              ...authInitialState,
              isAuthChecked: false,
              isAuthChecking: false,
              user: data.user,
              isAuthorized: true
            }
          }
        });

        // checking state reset
        expect(store.getState().auth.requestState).toBe(null);

        // check if there is the accessToken
        expect(getCookie('accessToken')).toBe(undefined);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(checkAuthAsyncThunk());

        // checking auth
        expect(store.getState().auth.isAuthChecked).toBe(true);
        expect(store.getState().auth.isAuthorized).toBe(false);
        expect(store.getState().auth.user).toEqual(null);
      });
    });
  });

  describe('Testing constructor reducer', () => {
    describe('Testing actions', () => {
      describe('Testing adding ingredients action', () => {
        test('Testing adding bun ingredient', () => {
          const expectedValue = {
            bun: ingredients[0],
            ingredients: []
          };

          const newState = burgerConstructorSlice(
            initialIngredientsState,
            addIngredientIntoConstructor(ingredients[0])
          );

          const { constructorItems } = newState;

          expect(constructorItems).toEqual(expectedValue);
        });

        test('Testing adding sauce and main ingredients', () => {
          let newState = burgerConstructorSlice(
            initialIngredientsState,
            addIngredientIntoConstructor(ingredients[1])
          );

          expect(newState.constructorItems).toEqual({
            bun: null,
            ingredients: [ingredients[1]]
          });

          newState = burgerConstructorSlice(
            initialIngredientsState,
            addIngredientIntoConstructor(ingredients[2])
          );

          expect(newState.constructorItems).toEqual({
            bun: null,
            ingredients: [ingredients[2]]
          });
        });
      });

      describe('Testing deleting  action', () => {
        test('Testing deleting bun ingredient', () => {
          const store = configureStore({
            reducer: { burgerConstructor: burgerConstructorSlice },
            preloadedState: {
              burgerConstructor: {
                constructorItems: {
                  bun: ingredients[0],
                  ingredients: [ingredients[1], ingredients[2]]
                },
                orderRequest: false,
                orderModalData: null
              }
            }
          });

          store.dispatch(removeIngredient({ item: ingredients[1] }));

          expect(store.getState().burgerConstructor.constructorItems).toEqual({
            bun: ingredients[0],
            ingredients: [ingredients[2]]
          });

          store.dispatch(removeIngredient({ item: ingredients[2] }));

          expect(store.getState().burgerConstructor.constructorItems).toEqual({
            bun: ingredients[0],
            ingredients: []
          });
        });
      });

      describe('Testing changing ingredients positions', () => {
        test('Setting ingredient higher', () => {
          const store = configureStore({
            reducer: { burgerConstructor: burgerConstructorSlice },
            preloadedState: {
              burgerConstructor: {
                constructorItems: {
                  bun: ingredients[0],
                  ingredients: [ingredients[1], ingredients[2], ingredients[3]]
                },
                orderRequest: false,
                orderModalData: null
              }
            }
          });

          store.dispatch(
            moveIngredient({
              ingredient: ingredients[3],
              place: 'up'
            })
          );

          expect(
            store.getState().burgerConstructor.constructorItems.ingredients[1]
          ).toEqual(ingredients[3]);

          store.dispatch(
            moveIngredient({
              ingredient: ingredients[3],
              place: 'up'
            })
          );

          expect(
            store.getState().burgerConstructor.constructorItems.ingredients[0]
          ).toEqual(ingredients[3]);
        });
        test('Setting ingredient lower', () => {
          const store = configureStore({
            reducer: { burgerConstructor: burgerConstructorSlice },
            preloadedState: {
              burgerConstructor: {
                constructorItems: {
                  bun: ingredients[0],
                  ingredients: [ingredients[1], ingredients[2], ingredients[3]]
                },
                orderRequest: false,
                orderModalData: null
              }
            }
          });

          store.dispatch(
            moveIngredient({
              ingredient: ingredients[1],
              place: 'down'
            })
          );

          expect(
            store.getState().burgerConstructor.constructorItems.ingredients[1]
          ).toEqual(ingredients[1]);

          store.dispatch(
            moveIngredient({
              ingredient: ingredients[1],
              place: 'down'
            })
          );

          expect(
            store.getState().burgerConstructor.constructorItems.ingredients[2]
          ).toEqual(ingredients[1]);
        });
      });
    });

    describe('Testing makeOrderAsyncThunk', () => {
      test('Testing makeOrderAsyncThunk fulfilled', async () => {
        const responseOrder: TNewOrderResponse = {
          name: 'testOrderName',
          order: {
            _id: 'testId',
            createdAt: 'testCreatedAt',
            ingredients: ['1', '2', '3'],
            name: 'testName',
            number: 3,
            status: 'testStatus',
            updatedAt: 'testUpdatedAt'
          },
          success: true
        };
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;
        global.fetch = jest.fn((url: string) =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(responseOrder)
          })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { burgerConstructor: burgerConstructorSlice },
          preloadedState: {
            burgerConstructor: {
              constructorItems: {
                bun: ingredients[0],
                ingredients: [ingredients[1], ingredients[2]]
              },
              orderRequest: false,
              orderModalData: null
            }
          }
        }) as Store<RootState> & { dispatch: AppDispatch };

        expect(getCookie('accessToken')).toBe(data.accessToken);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(
          makeOrderAsyncThunk([
            String(
              store.getState().burgerConstructor.constructorItems.bun?._id
            ),
            ...store
              .getState()
              .burgerConstructor.constructorItems.ingredients.map((item) =>
                String(item._id)
              )
          ])
        );

        expect(store.getState().burgerConstructor.orderRequest).toBe(false);
        expect(store.getState().burgerConstructor.constructorItems).toEqual({
          bun: null,
          ingredients: []
        });
        expect(store.getState().burgerConstructor.orderModalData).toEqual(
          responseOrder.order
        );
      });
      test('Testing makeOrderAsyncThunk rejected', async () => {
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;
        global.fetch = jest.fn((url: string) =>
          Promise.reject({
            ok: false,
            json: () => Promise.resolve()
          })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { burgerConstructor: burgerConstructorSlice },
          preloadedState: {
            burgerConstructor: {
              constructorItems: {
                bun: ingredients[0],
                ingredients: [ingredients[1], ingredients[2]]
              },
              orderRequest: false,
              orderModalData: null
            }
          }
        }) as Store<RootState> & { dispatch: AppDispatch };

        expect(getCookie('accessToken')).toBe(data.accessToken);

        expect(localStorage.getItem('refreshToken')).toBe(data.refreshToken);

        await store.dispatch(
          makeOrderAsyncThunk([
            String(
              store.getState().burgerConstructor.constructorItems.bun?._id
            ),
            ...store
              .getState()
              .burgerConstructor.constructorItems.ingredients.map((item) =>
                String(item._id)
              )
          ])
        );

        expect(store.getState().burgerConstructor.orderRequest).toBe(false);
        expect(store.getState().burgerConstructor.constructorItems).toEqual({
          bun: ingredients[0],
          ingredients: [ingredients[1], ingredients[2]]
        });
        expect(store.getState().burgerConstructor.orderModalData).toEqual(null);
      });
    });
  });

  describe('Testing feed reducer', () => {
    test('Testing getFeedsAsyncThunk fulfilled', async () => {
      const responseOrder: TFeedsResponse = {
        total: 999,
        totalToday: 10,
        orders: [
          {
            _id: 'order1id',
            createdAt: '20.06.1995',
            status: 'order1status',
            name: 'order1name',
            updatedAt: '25.06.1995',
            number: 10,
            ingredients: ['10', '20', '30']
          },
          {
            _id: 'order2id',
            createdAt: '20.07.1995',
            status: 'order2status',
            name: 'order2name',
            updatedAt: '25.07.1995',
            number: 20,
            ingredients: ['80', '50', '60']
          }
        ],
        success: true
      };

      global.fetch = jest.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(responseOrder)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { feed: feedSlice },
        preloadedState: {}
      }) as Store<RootState> & { dispatch: AppDispatch };

      await store.dispatch(getFeedsAsyncThunk());

      expect(store.getState().feed.feeds).toEqual(responseOrder.orders);
      expect(store.getState().feed.total).toBe(responseOrder.total);
      expect(store.getState().feed.totalToday).toBe(responseOrder.totalToday);
      expect(store.getState().feed.isLoading).toBe(false);
    });
    test('Testing getFeedsAsyncThunk rejected', async () => {
      global.fetch = jest.fn((url: string) =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve()
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { feed: feedSlice },
        preloadedState: {}
      }) as Store<RootState> & { dispatch: AppDispatch };

      await store.dispatch(getFeedsAsyncThunk());

      expect(store.getState().feed.feeds).toEqual([]);
      expect(store.getState().feed.total).toBe(0);
      expect(store.getState().feed.totalToday).toBe(0);
      expect(store.getState().feed.isLoading).toBe(false);
    });

    describe('Testing getOrderByIDAsyncThunk', () => {
      const responseOrders: TOrderResponse = {
        orders: [
          {
            _id: 'order1id',
            createdAt: '20.06.1995',
            status: 'order1status',
            name: 'order1name',
            updatedAt: '25.06.1995',
            number: 10,
            ingredients: ['10', '20', '30']
          },
          {
            _id: 'order2id',
            createdAt: '20.07.1995',
            status: 'order2status',
            name: 'order2name',
            updatedAt: '25.07.1995',
            number: 20,
            ingredients: ['80', '50', '60']
          }
        ],
        success: true
      };

      const ingredients = [
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        {
          _id: '643d69a5c3f7b9001cfa093e',
          name: 'Филе Люминесцентного тетраодонтимформа',
          type: 'main',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/meat-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
        }
      ];
      test('Testing getOrderByIDAsyncThunk fulfilled', async () => {
        global.fetch = jest.fn((url: string) =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(responseOrders)
          })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { feed: feedSlice, ingredients: ingredientsSlice },
          preloadedState: {
            feed: {
              ...feedInitialState,
              feeds: []
            },
            ingredients: {
              ...ingredientsInitialState,
              ingredients: ingredients
            }
          }
        }) as Store<RootState> & { dispatch: AppDispatch };

        await store.dispatch(getOrderByIDAsyncThunk(1));

        expect(store.getState().feed.isLoading).toBe(false);
        expect(store.getState().feed.selectedOrders).toEqual(
          responseOrders.orders
        );
      });
      test('Testing getOrderByIDAsyncThunk rejected', async () => {
        global.fetch = jest.fn((url: string) =>
          Promise.reject({
            ok: false,
            json: () => Promise.resolve(responseOrders)
          })
        ) as jest.Mock;

        const store = configureStore({
          reducer: { feed: feedSlice, ingredients: ingredientsSlice },
          preloadedState: {
            feed: {
              ...feedInitialState,
              feeds: []
            },
            ingredients: {
              ...ingredientsInitialState,
              ingredients: ingredients
            }
          }
        }) as Store<RootState> & { dispatch: AppDispatch };

        await store.dispatch(getOrderByIDAsyncThunk(1));

        expect(store.getState().feed.isLoading).toBe(false);
        expect(store.getState().feed.selectedOrders).toEqual([]);
      });
    });
  });

  describe('Testing user reducer', () => {
    describe('Testing getOrdersAsyncThunk', () => {
      const response: TFeedsResponse = {
        total: 5,
        totalToday: 10,
        orders: [
          {
            _id: 'order1id',
            createdAt: '20.06.1995',
            status: 'order1status',
            name: 'order1name',
            updatedAt: '25.06.1995',
            number: 10,
            ingredients: ['10', '20', '30']
          },
          {
            _id: 'order2id',
            createdAt: '20.07.1995',
            status: 'order2status',
            name: 'order2name',
            updatedAt: '25.07.1995',
            number: 20,
            ingredients: ['80', '50', '60']
          }
        ],
        success: true
      };

      test('Testing getOrdersAsyncThunk fulfilled', async () => {
        global.fetch = jest.fn((url: string) => {
          if (url.includes('/orders')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(response)
            });
          }
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(response)
          });
        }) as jest.Mock;
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;

        const store = configureStore({
          reducer: { user: userSlice },
          preloadedState: {}
        }) as Store<RootState> & { dispatch: AppDispatch };

        await store.dispatch(getOrdersAsyncThunk());

        expect(store.getState().user.orders).toEqual(response.orders);
        expect(store.getState().user.isLoading).toBe(false);
      });
      test('Testing getOrdersAsyncThunk rejected', async () => {
        global.fetch = jest.fn((url: string) =>
          Promise.reject({
            ok: false,
            json: () => Promise.resolve()
          })
        ) as jest.Mock;
        global.localStorage.setItem('refreshToken', data.refreshToken);
        global.document.cookie = `accessToken=${data.accessToken}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/;`;

        const store = configureStore({
          reducer: { user: userSlice },
          preloadedState: {}
        }) as Store<RootState> & { dispatch: AppDispatch };

        await store.dispatch(getOrdersAsyncThunk());

        expect(store.getState().user.orders).toEqual([]);
        expect(store.getState().user.isLoading).toBe(false);
      });
    });
  });
});
