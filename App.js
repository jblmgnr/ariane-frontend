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
import members from "./reducers/members";
import ConnectionScreen from "./screens/ConnectionScreen";
import GameScreen from "./screens/GameScreen";
import HomePageScreen from "./screens/HomePageScreen";
import MapGameScreen from "./screens/MapGameScreen";
import RelationGameScreen from "./screens/RelationGameScreen";
import InviteScreen from "./screens/InviteScreen";
import MembersScreen from "./screens/MembersScreen";
import CreateMemberScreen from "./screens/CreateMemberScreen";
import MemberProfileScreen from "./screens/MemberProfileScreen";
import { fontFamily } from "./modules/deco";

const reducers = combineReducers({ user, members });
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

          if (route.name === "Jeux") {
            iconName = "videogame-asset";
          } else if (route.name === "Inviter") {
            iconName = "add-box";
          } else if (route.name === "Membres") {
            iconName = "people";
          } else if (route.name === "Arbre") {
            iconName = "home";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#b2b2b2",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#7C4DFF",
        },
        tabBarLabelStyle: {
          fontFamily: "Quicksand",
        },
      })}
    >
      <Tab.Screen name="Arbre" component={HomePageScreen} />
      <Tab.Screen name="Jeux" component={GameScreen} />
      <Tab.Screen name="Membres" component={MembersScreen} />
      <Tab.Screen name="Inviter" component={InviteScreen} />
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
            <Stack.Screen name="MapGame" component={MapGameScreen} />
            <Stack.Screen name="RelationGame" component={RelationGameScreen} />
            <Stack.Screen
              name="MemberProfile"
              component={MemberProfileScreen}
            />
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
