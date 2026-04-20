import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { services, recentLaundry, subscribeToOrders } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

function SearchBarButton({ onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <TouchableOpacity style={styles.searchBar} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
      <Text style={styles.searchPlaceholder}>Cari apa saja...</Text>
      <Ionicons name="options-outline" size={18} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

function ServiceChip({ item, onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <TouchableOpacity style={styles.serviceChip} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.chipIcon}>
        <Ionicons name={item.iconName} size={20} color={Colors.accentText || "#000"} />
      </View>
      <Text style={styles.chipTime}>{item.time}</Text>
      <Text style={styles.chipName}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function CustomPackageChip({ onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <TouchableOpacity style={styles.customChip} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.customChipIcon}>
        <Ionicons name="apps-outline" size={22} color={Colors.accentText || "#000"} />
      </View>
      <Text style={styles.customChipBadge}>CUSTOM</Text>
      <Text style={styles.customChipName}>Paket Kustom</Text>
      <Text style={styles.customChipSub}>Pilih sendiri</Text>
    </TouchableOpacity>
  );
}

function ActiveCard({ item, onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <TouchableOpacity style={styles.recentCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.cardIconsRow}>
          <View style={styles.smallIconBtn}>
            <Ionicons name="thermometer-outline" size={14} color={Colors.textSecondary} />
          </View>
          <View style={[styles.smallIconBtn, { marginLeft: 8 }]}>
            <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
          </View>
        </View>
      </View>
      <Text style={styles.businessName}>{item.businessName}</Text>
      {/* Status pill */}
      <View style={styles.statusPill}>
        <Text style={styles.statusLabel}>{item.status}</Text>
        <Text style={styles.statusEta}>  {item.eta}</Text>
        <Text style={styles.statusArrow}> ————→ </Text>
        <Text style={styles.statusNext}>{item.nextStatus}</Text>
      </View>
      <View style={styles.statusTimesRow}>
        <Text style={styles.statusTime}>{item.startTime}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.statusTime}>{item.endTime}</Text>
      </View>
      {item.person && (
        <View style={styles.personRow}>
          <Image source={{ uri: item.person.avatar }} style={styles.personAvatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.personName}>{item.person.name}</Text>
            <Text style={styles.personRole}>{item.person.role}</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-ellipses-outline" size={17} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { marginLeft: 8 }]}>
            <Ionicons name="call-outline" size={17} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

function PastCard({ item, onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <TouchableOpacity style={[styles.recentCard, styles.pastCard]} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.pastCardLeft}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.businessNameSmall}>{item.businessName}</Text>
        {item.selectedServices && (
          <Text style={styles.pastCardServices} numberOfLines={1}>
            {Array.isArray(item.selectedServices)
              ? item.selectedServices.join(' · ')
              : item.selectedServices}
          </Text>
        )}
        {item.totalPriceNum > 0 && (
          <Text style={styles.pastCardPrice}>
            Rp {item.totalPriceNum.toLocaleString('id-ID')}
          </Text>
        )}
      </View>
      <View style={styles.pastCardReceiptBtn}>
        <Ionicons name="receipt-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.pastCardHint}>Lihat{'\n'}Struk</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  // Re-render otomatis saat ada perubahan data pesanan
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const unsub = subscribeToOrders(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText}>Banjarsari, Surakarta</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.topActionBtn}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.topActionBtn, { marginLeft: 10 }]}>
              <Ionicons name="grid-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hai, Galih</Text>

        {/* Search */}
        <SearchBarButton onPress={() => router.push('/search')} />

        {/* Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={<CustomPackageChip onPress={() => router.push('/custom-package')} />}
          renderItem={({ item }) => <ServiceChip item={item} onPress={() => router.push(`/service/${item.id}`)} />}
          style={{ marginBottom: 28 }}
        />

        {/* Recent Laundry */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Laundry Terakhir</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        {recentLaundry.map((item) =>
          item.status !== 'Selesai' ? (
            <ActiveCard
              key={item.id}
              item={item}
              onPress={() => router.push({
                pathname: '/track-order',
                params: {
                  serviceName: item.selectedServices ? item.selectedServices.join(' + ') : 'Layanan Binatu',
                  totalPrice: item.totalPriceNum ? String(item.totalPriceNum) : '0',
                  businessName: item.businessName,
                },
              })}
            />
          ) : (
            <PastCard
              key={item.id}
              item={item}
              onPress={() => router.push({
                pathname: '/receipt',
                params: {
                  serviceName: item.serviceName || (Array.isArray(item.selectedServices)
                    ? item.selectedServices.join(' + ')
                    : (item.selectedServices || item.businessName)),
                  totalPrice: String(item.totalPriceNum || item.finalPrice || 0),
                  serviceTotal: String(item.serviceTotal || item.finalPrice || 0),
                  pricePerUnit: String(item.pricePerUnit || 0),
                  unit: item.unit || '/kilo',
                  amount: String(item.items || 1),
                  deliveryFee: String(item.deliveryFee || 0),
                  expressFee: String(item.expressFee || 0),
                  isPickup: String(item.isPickup || false),
                  isExpress: String(item.isExpress || false),
                  fromHistory: 'true',
                  isCompleted: 'true',
                  realWeight: String(item.realWeight || item.items || 1),
                  pickupAddress: item.pickupAddress || '',
                  potongExtra: String(item.potongExtra || 0),
                  potongNote: item.potongNote || '',
                  eta: item.eta || '',
                  // Preferences
                  prefDetergent: item.prefDetergent || '',
                  prefPerfume: item.prefPerfume || '',
                  prefPerfumeEmoji: item.prefPerfumeEmoji || '',
                  prefFragranceLevel: String(item.prefFragranceLevel || 0),
                  prefInstructions: item.prefInstructions || '',
                },
              })}
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: Colors.textSecondary, fontSize: 12 },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  topActionBtn: { padding: 4 },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 18,
    marginTop: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchPlaceholder: { flex: 1, color: Colors.textSecondary, fontSize: 14 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { color: Colors.textSecondary, fontSize: 13 },
  serviceChip: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 82,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chipTime: { color: Colors.textSecondary, fontSize: 11, marginBottom: 2 },
  chipName: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },
  customChip: {
    backgroundColor: Colors.accent + '18',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: Colors.accent + '66',
    borderStyle: 'dashed',
  },
  customChipIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  customChipBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  customChipName: { color: Colors.textPrimary, fontSize: 12, fontWeight: '700' },
  customChipSub: { color: Colors.textSecondary, fontSize: 10, marginTop: 1 },
  recentCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pastCard: { opacity: 0.85, flexDirection: 'row', alignItems: 'center' },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: { color: Colors.textSecondary, fontSize: 12 },
  cardIconsRow: { flexDirection: 'row' },
  smallIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessName: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    lineHeight: 27,
    maxWidth: '80%',
  },
  businessNameSmall: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusLabel: { color: Colors.accentText || '#000', fontSize: 13, fontWeight: '700' },
  statusEta: { color: Colors.accentText || '#000', fontSize: 13 },
  statusArrow: { color: (Colors.accentText || '#000') + '80', flex: 1, textAlign: 'center', fontSize: 12 },
  statusNext: { color: Colors.accentText || '#000', fontSize: 13, fontWeight: '700' },
  statusTimesRow: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  statusTime: { color: Colors.textSecondary, fontSize: 12 },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 10,
  },
  personAvatar: { width: 40, height: 40, borderRadius: 20 },
  personName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  personRole: { color: Colors.textSecondary, fontSize: 12 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pastCardLeft: { flex: 1 },
  pastCardServices: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  pastCardPrice: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  pastCardReceiptBtn: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: 12,
    gap: 4,
  },
  pastCardHint: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
