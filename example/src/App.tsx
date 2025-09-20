import axios from 'axios';
import { Text } from 'react-native';
import { NetworkLoggerProvider } from 'react-native-fast-debugger';

const axiosInstance = axios.create({});
export default function App() {
  return (
    <NetworkLoggerProvider axiosInstance={axiosInstance}>
      <Text>Result</Text>
    </NetworkLoggerProvider>
  );
}
