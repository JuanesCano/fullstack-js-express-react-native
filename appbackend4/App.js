import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Navigation } from "./src/navigation/Navigation";
import axios from 'axios';
import { UserProvider } from './src/context/UserContext';

axios.defaults.baseURL = "http://192.168.0.9:9000"

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="Light" />
        <Navigation />
      </NavigationContainer>
    </UserProvider>
  );
}
