import { createSlice } from "@reduxjs/toolkit";
import { Gender, RelationShip } from "../modules/common";

const initialState = {
  value: {
    id: null,
    lastName: "",
    firstName: "",
    nickname: "",
    birthDate: "",
    deathDate: "",
    gender: Gender.Undefined,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddUser: (state, action) => {
      console.log("In reducer : action.payload : ");
      console.log(action.payload);
      state.value.id = action.payload._id;
      state.value.lastName = action.payload.lastName;
      state.value.firstName = action.payload.firstName;
      state.value.adress = action.payload.adress;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
      state.value.tree_id = action.payload.tree;

      console.log("After addUser in reducer ");
      console.log(state.value);
    },

    setTreeId: (state, action) => {
      state.value.tree_id = action.payload;
    },
  },
});

export const { setAddUser, setTreeId } = userSlice.actions;
export default userSlice.reducer;
