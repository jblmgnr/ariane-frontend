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

    removeMember: (state, action) => {
      const member = action.payload;
      state.value = state.value.filter((e) => e._id !== member.id);
    },
  },
});

export const { addMember, setMembers, removeMember } = membersSlice.actions;
export default membersSlice.reducer;
