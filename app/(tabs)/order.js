import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { orderHistory, subscribeToOrders } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

// ─── Status config ────────────────────────────────────────────────────────────
const getStatusConfig = (Colors) => ({
  'Menunggu Kurir': { color: '#FF9800', icon: 'bicycle-outline',    label: 'Menunggu Kurir' },
  'Dicuci':         { color: Colors.accent, icon: 'water-outline',  label: 'Sedang Dicuci'  },
  'Diproses':       { color: Colors.accent, icon: 'reload-outline', label: 'Diproses'       },
  'Selesai':        { color: '#4CAF50', icon: 'checkmark-circle-outline', label: 'Selesai'  },
});

// ─── Dot animasi untuk status aktif ──────────────────────────────────────────
function PulseDot({ color }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: color,
        transform: [{ scale: pulse }],
        marginRight: 6,
      }}
    />
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onPress }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  const STATUS_CONFIG = getStatusConfig(Colors);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Diproses'];
  const isActive = order.status !== 'Selesai';

  return (
    <TouchableOpacity
      style={[styles.orderCard, isActive && styles.orderCardActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: order.image }} style={styles.orderImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderName} numberOfLines={1}>{order.businessName}</Text>
        <Text style={styles.orderItems}>{order.items} barang</Text>

        <View style={styles.orderBottom}>
          {/* Status badge */}
          <View style={[styles.statusBadge, { borderColor: cfg.color + '80', backgroundColor: cfg.color + '18' }]}>
            {isActive && <PulseDot color={cfg.color} />}
            {!isActive && (
              <Ionicons name="checkmark-circle" size={12} color={cfg.color} style={{ marginRight: 4 }} />
            )}
            <Text style={[styles.statusBadgeText, { color: cfg.color }]}>
              {cfg.label}
            </Text>
          </View>
          <Text style={[styles.orderPrice, isActive && { color: Colors.accent }]}>
            {order.price}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function OrderScreen() {
  const router = useRouter();
  const [, forceUpdate] = useState(0);
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  useEffect(() => {
    // Subscribe ke perubahan data order (dari simulasi)
    const unsub = subscribeToOrders(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  const activeOrders   = orderHistory.filter((o) => o.status !== 'Selesai');
  const completedOrders = orderHistory.filter((o) => o.status === 'Selesai');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pesanan Saya</Text>
          {activeOrders.length > 0 && (
            <View style={styles.activeBadge}>
              <PulseDot color={Colors.accent} />
              <Text style={styles.activeBadgeText}>{activeOrders.length} aktif</Text>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {/* ─── Pesanan Aktif ─── */}
          {activeOrders.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Sedang Berjalan</Text>
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() =>
                    router.push({
                      pathname: '/track-order',
                      params: {
                        serviceName: order.businessName,
                        totalPriceStr: order.price,
                      },
                    })
                  }
                />
              ))}
            </>
          )}

          {/* ─── Pesanan Selesai ─── */}
          {completedOrders.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: activeOrders.length > 0 ? 16 : 0 }]}>
                Selesai
              </Text>
              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => {
                    // Harga final jika sudah dibayar, atau estimasi jika belum
                    const displayPrice = order.finalPrice
                      ? String(order.finalPrice)
                      : order.price.replace(/[^0-9]/g, '');
                    router.push({
                      pathname: '/receipt',
                      params: {
                        serviceName: order.serviceName || order.businessName,
                        totalPrice: displayPrice,
                        pricePerUnit: String(order.pricePerUnit || 0),
                        unit: order.unit || '/kilo',
                        amount: String(order.items),
                        serviceTotal: String(order.serviceTotal || order.finalPrice || displayPrice),
                        deliveryFee: String(order.deliveryFee || 0),
                        expressFee: String(order.expressFee || 0),
                        isPickup: String(order.isPickup || false),
                        isExpress: String(order.isExpress || false),
                        fromHistory: 'true',
                        isCompleted: 'true',
                        paymentMethod: order.paymentMethod || '',
                        realWeight: String(order.realWeight || order.items),
                        pickupAddress: order.pickupAddress || '',
                        potongExtra: String(order.potongExtra || 0),
                        potongNote: order.potongNote || '',
                        eta: order.eta || '',
                        // Preferences
                        prefDetergent: order.prefDetergent || '',
                        prefPerfume: order.prefPerfume || '',
                        prefPerfumeEmoji: order.prefPerfumeEmoji || '',
                        prefFragranceLevel: String(order.prefFragranceLevel || 0),
                        prefInstructions: order.prefInstructions || '',
                      },
                    });
                  }}
                />
              ))}
            </>
          )}

          {/* ─── Empty state ─── */}
          {orderHistory.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
              <Text style={styles.emptySub}>Yuk, mulai laundry pertamamu!</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '20',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  activeBadgeText: { color: Colors.accent, fontSize: 12, fontWeight: '700' },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  orderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingRight: 12,
  },
  orderCardActive: {
    borderColor: Colors.accent + '60',
    borderWidth: 1.5,
  },
  orderImage: { width: 90, height: 100 },
  orderInfo: { flex: 1, padding: 12 },
  orderDate: { color: Colors.textSecondary, fontSize: 11, marginBottom: 3 },
  orderName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  orderItems: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8 },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  orderPrice: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },

  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  emptySub: { color: Colors.textSecondary, fontSize: 14 },
});
