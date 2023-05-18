import { createSlice } from "@reduxjs/toolkit";
import { showObject } from "../modules/util";
const initialState = {
  value: {
    id: null,
    lastName: "",
    firstName: "",
    adress: "",
    email: "",
    password: "",
    tree: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("In reducer : action.payload : ");
      console.log(action.payload);
      state.value.id = action.payload._id;
      state.value.lastName = action.payload.lastName;
      state.value.firstName = action.payload.firstName;
      state.value.adress = action.payload.adress;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
      state.value.tree = action.payload.tree;

      console.log("After addUser in reducer ");
      console.log(state.value);
    },

    setTreeId: (state, action) => {
      state.value.tree = action.payload;
      console.log(state.value);
      showObject(state.value, "After set tree id in user reducer");
    },
  },
});

export const { setUser, setTreeId } = userSlice.actions;
export default userSlice.reducer;
