import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import PixelVaultApp from './src/screens/PixelVaultApp';

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="dark" />
      <PixelVaultApp />
    </SafeAreaProvider>
  );
}
