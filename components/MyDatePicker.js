import React, { useState } from "react";
import { View, Platform, TouchableOpacity, Text } from "react-native";
import { Button } from "@react-native-material/core";
import DateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment";
import localization from "moment/locale/fr";

const MyDatePicker = ({ defaultValue, setValueCallback }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    console.log("currentDate", currentDate);
    setValueCallback(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker}>
        <Text>Sélectionnez une date de naissance</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          style={{ width: 200 }}
        />
      )}
      <Text>Date de naissance choisie : {moment(date).format("LL")}</Text>
    </View>
  );
};

export default MyDatePicker;
