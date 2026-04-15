import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { services } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

function ServiceRow({ service, selected, onToggle, Colors, styles }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onToggle(service.id);
  }, [service.id, onToggle]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.serviceRow, selected && styles.serviceRowSelected]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        {/* Icon */}
        <View style={[styles.serviceIcon, selected && styles.serviceIconSelected]}>
          <Ionicons
            name={service.iconName}
            size={22}
            color={selected ? (Colors.accentText || '#000') : Colors.textSecondary}
          />
        </View>

        {/* Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceNameRow}>
            <Text style={[styles.serviceName, selected && styles.serviceNameSelected]}>
              {service.name}
            </Text>
            <View style={[styles.timeBadge, selected && styles.timeBadgeSelected]}>
              <Ionicons name="time-outline" size={11} color={selected ? (Colors.accentText || '#000') : Colors.textSecondary} />
              <Text style={[styles.timeText, selected && styles.timeTextSelected]}>
                {' '}{service.time}
              </Text>
            </View>
          </View>
          <Text style={styles.serviceDesc} numberOfLines={1}>{service.desc}</Text>
          <Text style={[styles.servicePrice, selected && styles.servicePriceSelected]}>
            {service.price}
            <Text style={styles.serviceUnit}> {service.unit}</Text>
          </Text>
        </View>

        {/* Checkbox */}
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Ionicons name="checkmark" size={16} color={Colors.accentText || "#000"} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CustomPackageScreen() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  const toggleService = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const selectedServices = services.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.priceNum, 0);
  const totalTime = selectedServices.reduce((acc, s) => {
    const mins = parseInt(s.time);
    return acc + (isNaN(mins) ? 0 : mins);
  }, 0);

  const serviceName = selectedServices.length > 0
    ? selectedServices.map((s) => s.name).join(' + ')
    : 'Paket Kustom';

  const priceBreakdown = selectedServices
    .map((s) => `${s.name} ${s.price}`)
    .join(' + ');

  const canOrder = selectedServices.length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Paket Kustom</Text>
            <Text style={styles.headerSub}>Pilih layanan sesukamu</Text>
          </View>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSelectedIds([])}
          >
            <Text style={styles.clearText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Selected summary pill */}
      {selectedServices.length > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryLeft}>
            <Ionicons name="layers-outline" size={16} color={Colors.accent} />
            <Text style={styles.summaryText}>
              {selectedServices.length} layanan dipilih
            </Text>
          </View>
          <Text style={styles.summarytime}>~{totalTime} mnt</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tip */}
        <View style={styles.tipBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.accent} />
          <Text style={styles.tipText}>
            Pilih satu atau beberapa layanan. Harga akan dijumlahkan secara otomatis.
          </Text>
        </View>

        {/* Services list */}
        <Text style={styles.sectionLabel}>Semua Layanan</Text>
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            selected={selectedIds.includes(service.id)}
            onToggle={toggleService}
            Colors={Colors}
            styles={styles}
          />
        ))}

        {/* Price breakdown */}
        {selectedServices.length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Rincian Harga</Text>
            {selectedServices.map((s) => (
              <View key={s.id} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Ionicons name={s.iconName} size={14} color={Colors.textSecondary} />
                  <Text style={styles.breakdownName}>{s.name}</Text>
                </View>
                <Text style={styles.breakdownPrice}>{s.price}</Text>
              </View>
            ))}
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownTotalRow}>
              <Text style={styles.breakdownTotalLabel}>Total Estimasi</Text>
              <Text style={styles.breakdownTotal}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </Text>
            </View>
            {selectedServices.length > 1 && (
              <Text style={styles.breakdownFormula}>
                {selectedServices.map((s) => `Rp ${s.priceNum.toLocaleString('id-ID')}`).join(' + ')} = Rp {totalPrice.toLocaleString('id-ID')}
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        {canOrder ? (
          <>
            <View style={styles.bottomPriceBlock}>
              <Text style={styles.bottomPriceLabel}>Total Tagihan</Text>
              <Text style={styles.bottomPrice}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.orderBtn}
              activeOpacity={0.85}
              onPress={() => {
                // Harga /kilo: jumlahkan semua layanan /kilo (berat bisa diatur di cart)
                // Harga /potong: tambahkan langsung (quantity diatur di cart jika ada)
                const kiloServices = selectedServices.filter((s) => s.unit === '/kilo');
                const potongServices = selectedServices.filter((s) => s.unit === '/potong');
                const kiloTotal = kiloServices.reduce((a, s) => a + s.priceNum, 0);
                const potongTotal = potongServices.reduce((a, s) => a + s.priceNum, 0);
                // Jika ada campuran: kirim ke cart dengan pricePerUnit = kiloTotal, potong sudah termasuk dalam nama
                router.push({
                  pathname: '/cart',
                  params: {
                    serviceName,
                    basePrice: String(kiloTotal > 0 ? kiloTotal : totalPrice),
                    unit: kiloTotal > 0 ? '/kilo' : '/potong',
                    potongExtra: String(potongTotal),
                    potongNote: potongServices.length > 0
                      ? potongServices.map((s) => s.name).join('+')
                      : '',
                  },
                });
              }}
            >
              <Text style={styles.orderBtnText}>Pesan Sekarang</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.accentText || "#000"} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyBottomBar}>
            <Ionicons name="hand-left-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.emptyBottomText}>Pilih minimal satu layanan untuk melanjutkan</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  headerSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 1 },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },

  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 4,
    backgroundColor: Colors.accent + '15',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryText: { color: Colors.accent, fontSize: 13, fontWeight: '700' },
  summarytime: { color: Colors.textSecondary, fontSize: 13 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 14 },

  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  tipText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
  },
  serviceRowSelected: {
    backgroundColor: Colors.accent + '15',
    borderColor: Colors.accent,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceIconSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  serviceInfo: { flex: 1 },
  serviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  serviceName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  serviceNameSelected: { color: Colors.textPrimary },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeBadgeSelected: {
    backgroundColor: Colors.accent + '30',
    borderColor: Colors.accent + '80',
  },
  timeText: { color: Colors.textSecondary, fontSize: 11 },
  timeTextSelected: { color: Colors.accent },
  serviceDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  servicePrice: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  servicePriceSelected: { color: Colors.accent },
  serviceUnit: { fontWeight: '400', fontSize: 12 },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  checkboxSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  breakdownCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownName: { color: Colors.textSecondary, fontSize: 14 },
  breakdownPrice: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  breakdownDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownTotalLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  breakdownTotal: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  breakdownFormula: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    lineHeight: 18,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  bottomPriceBlock: { flex: 1 },
  bottomPriceLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 3 },
  bottomPrice: { color: Colors.accent, fontSize: 22, fontWeight: '800' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 7,
  },
  orderBtnText: { color: Colors.accentText || '#000', fontSize: 15, fontWeight: '700' },

  emptyBottomBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  emptyBottomText: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    flex: 1,
  },
});

