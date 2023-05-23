import React, { useState } from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Button, TextInput } from "@react-native-material/core";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fontFamily } from "../modules/deco";

import moment from "moment";
import localization from "moment/locale/fr";

const MyDatePicker = ({ defaultValue, setValueCallback }) => {
  // console.log("Default date", defaultValue);
  const [date, setDate] = useState(new Date(defaultValue));
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
    console.log("showDatepicker test");
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker}>
        <TextInput
          label="Date de naissance"
          variant="outlined"
          onChangeText={(value) => setMember({ ...member, job: value })}
          value={date ? moment(date).format("LL") : "Non renseignée"}
          style={styles.input}
          editable={false}
          onPress={onChange}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    fontFamily: fontFamily,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default MyDatePicker;
