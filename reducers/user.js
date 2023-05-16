import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    id: null,
    lastName: null,
    firstName: null,
    adress: null,
    email: null,
    password: null,
    tree_id: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddUser: (state, action) => {
      console.log("action.payload : ", action.payload);
      state.value.id = action.payload._id;
      state.value.lastName = action.payload.lastName;
      state.value.firstName = action.payload.firstName;
      state.value.adress = action.payload.adress;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
      state.value.tree_id = action.payload.tree;
    },

    setTreeId: (state, action) => {
      state.value.tree_id = action.payload;
    },
  },
});

export const { setAddUser, setTree } = userSlice.actions;
export default userSlice.reducer;
