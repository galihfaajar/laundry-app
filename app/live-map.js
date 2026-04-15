import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function LiveMapScreen() {
  const router = useRouter();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  return (
    <View style={styles.container}>
      {/* Map Background (Local Image of Solo) */}
      <Image
        source={require('../assets/map-solo.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />
      
      {/* Overlay darkening */}
      <View style={styles.mapOverlay} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Lacak Posisi</Text>
            <Text style={styles.headerSubtitle}>Jalan Slamet Riyadi, Surakarta</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      {/* Live Pin */}
      <View style={styles.pinWrapper}>
        <View style={styles.pulseRing} />
        <View style={styles.pinDot}>
          <Ionicons name="bicycle" size={24} color={Colors.accentText || "#000"} />
        </View>
      </View>

      {/* Floating Bottom Card */}
      <View style={styles.bottomSheet}>
        <View style={styles.etaBox}>
          <Text style={styles.etaLabel}>Estimasi Tiba</Text>
          <Text style={styles.etaTime}>12 Menit</Text>
        </View>

        <View style={styles.courierCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/80?img=11' }} style={styles.avatar} />
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>Ahmad Syahputra</Text>
            <Text style={styles.courierRole}>Kurir Pengiriman</Text>
          </View>
          <TouchableOpacity 
            style={styles.callBtn}
            onPress={() => router.push({ 
              pathname: '/chat/3', 
              params: { initialMessage: 'Halo kak, saya Ahmad. Paket laundry kakak sudah saya bawa dan sedang dalam perjalanan ya. Mohon ditunggu! 🛵' } 
            })}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color={Colors.accentText || "#000"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, position: 'relative' },
  mapImage: { width: '100%', height: '100%', position: 'absolute' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000030' },
  headerSafe: { position: 'absolute', top: 0, width: '100%', zIndex: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: Colors.accent, 
    fontWeight: '700', 
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pinWrapper: {
    position: 'absolute',
    top: height / 2 - 40,
    left: width / 2 - 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent + '44',
  },
  pinDot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  etaBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etaLabel: { color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
  etaTime: { color: Colors.accent, fontSize: 20, fontWeight: '700' },
  courierCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 14 },
  courierInfo: { flex: 1 },
  courierName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  courierRole: { color: Colors.textSecondary, fontSize: 13 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

