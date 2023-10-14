import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostScreen from "../screen/PostScreen";
import DetailScreen from "../screen/DetailScreen";
import PostActionsScreen from "../screen/PostActionsScreen";
import { SPACING } from "../config/spacing";
import { colors } from "../config/colors";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import { useUser } from "../hooks/userUser";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const {isLogin} = useUser()

  const PrivateRoutes = (screen) => {
    return isLogin? screen : LoginScreen
  };

  const PublicRoutes = (screen) => {
    return isLogin? PostScreen : screen
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingHorizontal: SPACING * 2,
          flex: 1,
          backgroundColor: colors.black,
        },
      }}
    >
      <Stack.Screen name="Login" component={PublicRoutes(LoginScreen)} />
      <Stack.Screen name="Register" component={PublicRoutes(RegisterScreen)} />

      <Stack.Screen name="HomeScreen" component={PrivateRoutes(PostScreen)} />
      <Stack.Screen name="DetailScreen" component={PrivateRoutes(DetailScreen)} />
      <Stack.Screen name="PostActionScreen" component={PrivateRoutes(PostActionsScreen)} />
    </Stack.Navigator>
  );
};

// export default Navigation;
