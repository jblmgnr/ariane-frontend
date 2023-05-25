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
      state.value = [...action.payload];

      for (let i = 0; i < state.value.length; i++) {
        showObject(state.value[i], "  In reducer " + i);
      }
    },

    updateMember: (state, action) => {
      const member = action.payload;
      // First remove previous member matching the _id
      state.value = state.value.filter((e) => e._id !== member._id);

      // Add new member to replace it.
      state.value.push(member);
    },
    removeMember: (state, action) => {
      const member = action.payload;
      state.value = state.value.filter((e) => e._id !== member._id);
    },
  },
});

export const { addMember, setMembers, removeMember, updateMember } =
  membersSlice.actions;
export default membersSlice.reducer;
