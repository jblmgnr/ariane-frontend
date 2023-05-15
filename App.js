import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import user from "./reducers/user";
import ConnectionScreen from "./screens/ConnectionScreen";
import GameScreen from "./screens/GameScreen";
import HomePageScreen from "./screens/HomePageScreen";
import InviteScreen from "./screens/InviteScreen";
import UsersParametersScreen from "./screens/UsersParametersScreen";
import CreateMemberScreen from "./screens/CreateMemberScreen";

const reducers = combineReducers({ user });
const persistConfig = {
  key: "Ariane",
  storage: AsyncStorage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Game") {
            iconName = "mdiGamepadVariant";
          } else if (route.name === "Invite") {
            iconName = "mdiPlusBox";
          } else if (route.name === "UserParameters") {
            iconName = "mdiAccountMultiple";
          } else if (route.name === "HomePage") {
            iconName = "mdiHome";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e8be4b",
        tabBarInactiveTintColor: "#b2b2b2",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Invite" component={InviteScreen} />
      <Tab.Screen name="UsersParameters" component={UsersParametersScreen} />
      <Tab.Screen name="HomePage" component={HomePageScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Connection" component={ConnectionScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="CreateMember" component={CreateMemberScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
