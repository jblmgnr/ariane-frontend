import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    lastName: null,
    firstName: null,
    adress: null,
    email: null,
    password: null,
    tree: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddUser: (state, action) => {
      console.log("action.payload : ", action.payload);
      state.value.lastName = action.payload.lastname;
      state.value.firstName = action.payload.firstname;
      state.value.adress = action.payload.adress;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
      state.value.tree = action.payload.tree;
    },

    setTree: (state, action) => {
      state.value.tree = action.payload;
    },
  },
});

export const { setAddUser, setTree } = userSlice.actions;
export default userSlice.reducer;
