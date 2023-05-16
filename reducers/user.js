import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    lastname: null,
    firstname: null,
    adress: null,
    email: null,
    password: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddUser: (state, action) => {
      state.value.lastname = action.payload.lastname;
      state.value.firstname = action.payload.firstname;
      state.value.adress = action.payload.adress;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
    },
  },
});

export const { setAddUser } = userSlice.actions;
export default userSlice.reducer;
