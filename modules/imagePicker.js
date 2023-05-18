import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // square image
    quality: 0.3,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  } else {
    return null;
  }
};
