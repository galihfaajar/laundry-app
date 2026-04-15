import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  const handleGetStarted = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.bgGlow} />

      {/* Hero area */}
      <View style={styles.heroArea}>
        {/* Glow rings */}
        <View style={styles.glowOuter}>
          <View style={styles.glowMiddle}>
            <View style={styles.glowInner}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
                }}
                style={styles.machineImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={['transparent', Colors.bg + 'EE', Colors.bg]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Bottom content */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContent}>
        <Text style={styles.title}>Urus Laundry Anda{'\n'}Dari Mana Saja</Text>
        <Text style={styles.subtitle}>
          Atur jadwal, pantau status cucian, dan kelola semua pesanan langsung dari genggaman Anda.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Mulai Kelola Pakaian →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  bgGlow: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.accent + '12',
    transform: [{ translateX: -160 }],
  },
  heroArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glowOuter: {
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: Colors.accent + '10',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 20,
  },
  glowMiddle: {
    width: 248,
    height: 248,
    borderRadius: 124,
    backgroundColor: Colors.accent + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent + '50',
  },
  glowInner: {
    width: 208,
    height: 208,
    borderRadius: 104,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: Colors.accent + 'CC',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 15,
  },
  machineImage: { width: '100%', height: '100%' },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  bottomContent: { paddingHorizontal: 28, paddingBottom: 36 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 23,
    marginBottom: 36,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: { color: Colors.accentText || '#000000', fontSize: 16, fontWeight: '700' },
});

