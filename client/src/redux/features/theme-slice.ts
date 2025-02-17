import { createSlice } from '@reduxjs/toolkit';

interface theme {
  mode: 'dark' | 'light';
}

const initialState: theme = {
  mode: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggle } = themeSlice.actions;
export default themeSlice.reducer;
