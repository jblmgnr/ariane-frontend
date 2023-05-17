import { createSlice } from "@reduxjs/toolkit";

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
    },
    setMembers: (state, action) => {
      // console.log("In reducer : action.payload : ", action.payload);
      state.value = [...action.payload];

      for (let i = 0; i < state.value.length; i++) {
        const str = JSON.stringify(state.value[i], null, 4);
        // console.log(`member[${i}] : `, str);
      }
    },
  },
});

export const { addMember, setMembers } = membersSlice.actions;
export default membersSlice.reducer;
