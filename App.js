import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import user from "./reducers/user";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import HomePageScreen from "./screens/HomePageScreen";
import InviteScreen from "./screens/InviteScreen";
import UserParametersScreen from "./screens/UserParametersScreen";
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
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Game') {
          iconName = 'camera';
        } else if (route.name === 'Gallery') {
          iconName = 'image';
        } else if (route.name === 'Invite') {
          iconName = 'user-plus';
        } else if (route.name === 'UserParameters') {
          iconName = 'user';
        } else if (route.name === 'HomePage') {
          iconName = 'home';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e8be4b',
      tabBarInactiveTintColor: '#b2b2b2',
      headerShown: false,
    })}>
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Invite" component={InviteScreen} />
      <Tab.Screen name="UserParameters" component={UserParametersScreen} />
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
          <Stack.Screen name="Home" component={HomeScreen} />
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
