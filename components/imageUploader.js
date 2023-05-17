import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { pickImage } from "../modules/imagePicker";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Avatar } from "@react-native-material/core";

const ImageUploader = ({ uploadUrl, onUpload, enabled = true, diameter }) => {
  const [image, setImage] = useState(null);

  const handlePress = () => {
    if (enabled === false) {
      return;
    }
    pickImage().then((result) => {
      if (result) {
        setImage(result);

        let formData = new FormData();
        formData.append("photoFromFront", {
          uri: result,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        fetch(uploadUrl, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (onUpload) {
              onUpload(data);
            }
          })
          .catch((error) => {
            console.log("upload error: ", error);
          });
      }
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Avatar
          icon={(props) => <Icon name="account" {...props} />}
          autoColor
          size={diameter}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;
