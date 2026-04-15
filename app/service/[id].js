import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { services } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  const service = services.find((s) => s.id === id) || services[0];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Layanan</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.artisticArea}>
          <View style={styles.circleBg}>
            <Ionicons name={service.iconName} size={50} color={Colors.accentText || "#000"} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDesc}>{service.desc}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Ionicons name="time-outline" size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.statLabel}>Estimasi Waktu</Text>
                <Text style={styles.statValue}>{service.time}</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Ionicons name="pricetag-outline" size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.statLabel}>Tarif Layanan</Text>
                <Text style={styles.statValue}>
                  {service.price} <Text style={{ fontSize: 13, color: Colors.textSecondary }}>{service.unit}</Text>
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPriceLabel}>Estimasi Biaya</Text>
          <Text style={styles.bottomPrice}>{service.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push({ pathname: '/cart', params: { serviceName: service.name, basePrice: service.priceNum, unit: service.unit }})}>
          <Text style={styles.bookBtnText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  artisticArea: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 32,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  circleBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
  },
  serviceName: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  serviceDesc: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  statsRow: {
    gap: 16,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  bottomPrice: {
    color: Colors.accent,
    fontSize: 22,
    fontWeight: '800',
  },
  bookBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  bookBtnText: {
    color: Colors.accentText || '#000',
    fontSize: 15,
    fontWeight: '700',
  },
});

