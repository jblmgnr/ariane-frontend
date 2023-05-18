import { createSlice } from "@reduxjs/toolkit";
import { showObject } from "../modules/util";

const initialState = {
  value: [],
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state, action) => {
      console.log("In reducer : action.payload : ", action.payload);
      state.value.push(action.payload);

      console.log("After addMember in reducer ");
      console.log(state.value);
      showObject(state.value);
    },
    setMembers: (state, action) => {
      console.log(
        "Udpdate list of memeber is reducer with ",
        action.payload.length,
        " members "
      );
      // console.log("In reducer : action.payload : ", action.payload);
      state.value = [...action.payload];

      for (let i = 0; i < state.value.length; i++) {
        showObject(state.value[i], "  In reducer " + i);
      }
    },
  },
});

export const { addMember, setMembers } = membersSlice.actions;
export default membersSlice.reducer;
