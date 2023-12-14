import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/Home';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { StopsMap } from './src/screens/StopsMap';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="StopsMap" component={StopsMap} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}