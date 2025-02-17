import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ROLE = 'ADMIN' | 'USER' | 'OWNER';

// Define User Type
interface TUser {
  id: string;
  name: string;
  email: string;
  role: ROLE;
}

interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<TUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
