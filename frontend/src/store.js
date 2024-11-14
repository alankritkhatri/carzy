// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load persisted state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: loadState() || {
    username: "",
    isAuthenticated: false,
    role: "",
    token: "",
  },
  reducers: {
    setUserData: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem("userState", JSON.stringify(state));
    },
    clearUserData: (state) => {
      state.username = "";
      state.role = "";
      state.token = "";
      state.isAuthenticated = false;

      // Save to localStorage
      localStorage.setItem("userState", JSON.stringify(state));
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
