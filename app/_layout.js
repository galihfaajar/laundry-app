import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../constants/ThemeContext';

// Komponen pembungkus transisi tema
function StackWrapper() {
  const { Colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={Colors.bg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StackWrapper />
    </ThemeProvider>
  );
}
