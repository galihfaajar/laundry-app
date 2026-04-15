import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../constants/ThemeContext';
import {
  orderHistory,
  subscribeToOrders,
  paymentOptions,
  confirmPayment,
} from '../constants/mockData';

const { width } = Dimensions.get('window');

// ─── Status → Step index mapping ──────────────────────────────────────────────
const STATUS_TO_STEP = {
  'Menunggu Penjemputan':     0,
  'Item Diterima':            1,
  'Ditimbang & Dikonfirmasi': 2,
  'Sedang Dicuci':            3,
  'Selesai':                  4,
};

const STEP_DEFS = [
  {
    title: 'Pesanan Dikonfirmasi',
    subtitle: (order) => order?.date || 'Baru saja',
    icon: 'checkmark-circle-outline',
    note: null,
  },
  {
    title: 'Item Diterima di Toko',
    subtitle: () => 'Sedang dalam perjalanan ke toko...',
    icon: 'storefront-outline',
    note: null,
  },
  {
    title: 'Ditimbang & Dikonfirmasi',
    subtitle: (order) =>
      order?.realWeight
        ? `Berat aktual: ${order.realWeight} kg`
        : 'Petugas sedang menimbang...',
    icon: 'scale-outline',
    note: (order) =>
      order?.realWeight
        ? null
        : 'Notifikasi harga final dikirim setelah langkah ini.',
  },
  {
    title: 'Sedang Dicuci & Diproses',
    subtitle: () => 'Estimasi selesai dalam beberapa jam',
    icon: 'water-outline',
    note: null,
  },
  {
    title: 'Siap Dikirim / Diambil',
    subtitle: () => 'Pesanan selesai!',
    icon: 'bag-check-outline',
    note: null,
  },
];

// ─── Animated pulsing dot for active step ─────────────────────────────────────
function PulsingDot({ Colors }) {
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: Colors.accent,
        alignItems: 'center', justifyContent: 'center',
        opacity: pulse,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <Ionicons name="refresh-outline" size={18} color={Colors.accentText || '#000'} />
    </Animated.View>
  );
}

// ─── Step Icon ─────────────────────────────────────────────────────────────────
function StepIcon({ stepDef, stepIndex, activeIndex, order, Colors }) {
  const done   = stepIndex < activeIndex;
  const active = stepIndex === activeIndex;
  const pending = stepIndex > activeIndex;

  if (done) {
    return (
      <View style={[localIconStyle.base, { backgroundColor: Colors.accent }]}>
        <Ionicons name="checkmark" size={17} color={Colors.accentText || '#000'} />
      </View>
    );
  }
  if (active) return <PulsingDot Colors={Colors} />;
  return (
    <View style={[localIconStyle.base, { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border }]}>
      <Ionicons name={stepDef.icon} size={16} color={Colors.textSecondary} />
    </View>
  );
}

const localIconStyle = StyleSheet.create({
  base: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function TrackOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  const orderId     = params.orderId;
  const serviceName = params.serviceName || 'Layanan Binatu';

  // ── Live order state ────────────────────────────────────────────────────────
  const [order, setOrder] = useState(() =>
    orderId ? orderHistory.find((o) => o.id === orderId) || null : null
  );

  useEffect(() => {
    if (!orderId) return;
    const unsub = subscribeToOrders(() => {
      const found = orderHistory.find((o) => o.id === orderId);
      setOrder(found ? { ...found } : null); // spread to trigger re-render
    });
    return unsub;
  }, [orderId]);

  const currentStatus = order?.status || 'Menunggu Penjemputan';
  const activeIndex   = STATUS_TO_STEP[currentStatus] ?? 0;

  const fmtRp  = (n) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;
  const isWeighed = activeIndex >= 2 && order?.realWeight != null;
  const isDone    = currentStatus === 'Selesai';

  // ── Payment state ─────────────────────────────────────────────────────────
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    () => paymentOptions.find(p => p.id !== 'pay-later')?.id || 'cash'
  );
  const [paying, setPaying] = useState(false);

  // Derived price display
  const priceLabel = isDone && order?.finalPrice
    ? fmtRp(order.finalPrice)
    : isWeighed && order?.finalPrice
      ? fmtRp(order.finalPrice)
      : params.totalPriceStr || 'Menunggu timbangan...';

  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll ke bawah otomatis saat kartu pembayaran muncul (setelah ditimbang)
    if (isWeighed && !order?.paid) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 600);
    }
  }, [isWeighed, order?.paid]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lacak Pesanan</Text>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.personOverlay}>
            <Image source={{ uri: 'https://i.pravatar.cc/80?img=8' }} style={styles.personAvatar} />
            <View style={styles.personInfo}>
              <Text style={styles.personName}>Budi Santoso</Text>
              <Text style={styles.personRole}>Petugas Laundry</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/chat/1')}>
              <Ionicons name="chatbubble-ellipses-outline" size={17} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { marginLeft: 8 }]}>
              <Ionicons name="call-outline" size={17} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Order Summary Card ─── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Layanan Dipilih</Text>
              <Text style={styles.summaryValue}>{serviceName}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>
                {isWeighed || isDone ? 'Harga Final' : 'Estimasi Harga'}
              </Text>
              <Text style={[
                styles.summaryPrice,
                (isWeighed || isDone) && { color: Colors.accent },
              ]}>
                {priceLabel}
              </Text>
            </View>
          </View>

          {/* Weighing pending notice (only before weighing step) */}
          {activeIndex < 2 && (
            <View style={styles.weighingCard}>
              <Ionicons name="scale-outline" size={16} color="#D97706" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.weighingCardTitle}>Menunggu Konfirmasi Berat</Text>
                <Text style={styles.weighingCardText}>
                  Harga final dikirim ke Notifikasi setelah petugas menimbang cucian Anda.
                </Text>
              </View>
            </View>
          )}

        </View>

        {/* ─── Progress Timeline ─── */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Status Laundry Anda</Text>

          {STEP_DEFS.map((stepDef, index) => {
            const done   = index < activeIndex;
            const active = index === activeIndex;
            const note   = typeof stepDef.note === 'function' ? stepDef.note(order) : stepDef.note;
            const subtitle = typeof stepDef.subtitle === 'function' ? stepDef.subtitle(order) : stepDef.subtitle;

            return (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <StepIcon
                    stepDef={stepDef}
                    stepIndex={index}
                    activeIndex={activeIndex}
                    order={order}
                    Colors={Colors}
                  />
                  {index < STEP_DEFS.length - 1 && (
                    <View style={[styles.stepLine, done && styles.stepLineDone]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                    styles.stepTitle,
                    !done && !active && { color: Colors.textSecondary },
                    active && { color: Colors.accent },
                    done && { color: Colors.textPrimary },
                  ]}>
                    {stepDef.title}
                  </Text>
                  {(done || active) && (
                    <Text style={styles.stepTime}>{subtitle}</Text>
                  )}
                  {active && note && (
                    <View style={styles.stepNote}>
                      <Text style={styles.stepNoteText}>{note}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          <View style={{ height: 10 }} />

          {/* ─── Payment CTA: muncul setelah ditimbang, sebelum bayar ─── */}
          {isWeighed && !order?.paid && (
            <View style={styles.paymentCard}>
              <View style={styles.paymentCardHeader}>
                <Ionicons name="card-outline" size={18} color={Colors.accent} />
                <Text style={styles.paymentCardTitle}>Konfirmasi & Bayar</Text>
              </View>
              <Text style={styles.paymentCardSub}>
                {'Berat aktual: '}
                <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{order.realWeight} kg</Text>
                {'  •  Total: '}
                <Text style={{ fontWeight: '700', color: Colors.accent }}>{fmtRp(order.finalPrice)}</Text>
              </Text>

              {/* Pilih Metode Pembayaran */}
              <View style={styles.paymentOptions}>
                {paymentOptions
                  .filter(p => p.id !== 'pay-later')
                  .map((p) => {
                    const active = p.id === selectedPaymentId;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.paymentOpt, active && styles.paymentOptActive]}
                        onPress={() => setSelectedPaymentId(p.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={p.icon}
                          size={16}
                          color={active ? Colors.accentText || '#000' : Colors.textSecondary}
                        />
                        <Text style={[styles.paymentOptText, active && styles.paymentOptTextActive]}>
                          {p.name}
                        </Text>
                        {active && (
                          <Ionicons name="checkmark-circle" size={15} color={Colors.accentText || '#000'} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>

              <TouchableOpacity
                style={[styles.payNowBtn, paying && { opacity: 0.6 }]}
                disabled={paying}
                onPress={() => {
                  setPaying(true);
                  setTimeout(() => {
                    confirmPayment(orderId, selectedPaymentId);
                    setPaying(false);
                  }, 800);
                }}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.accentText || '#000'} />
                <Text style={styles.payNowBtnText}>
                  {paying ? 'Memproses...' : `Bayar ${fmtRp(order.finalPrice)}`}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Konfirmasi pembayaran berhasil */}
          {order?.paid && (
            <View style={styles.paidCard}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.paidTitle}>Pembayaran Berhasil 🎉</Text>
                <Text style={styles.paidSub}>
                  {order.paymentMethod}  •  Total: {fmtRp(order.finalPrice)}
                </Text>
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* ─── Bottom Bar ─── */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.receiptBtn}
          onPress={() => router.push('/(tabs)/order')}
        >
          <Text style={styles.receiptBtnText}>Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.trackingBtn}
          onPress={() => router.push('/live-map')}
        >
          <Text style={styles.trackingBtnText}>Lacak Posisi</Text>
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
    paddingBottom: 12,
    paddingTop: 8,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  heroContainer: { position: 'relative' },
  heroImage: { width, height: 200 },
  personOverlay: {
    position: 'absolute', bottom: 12, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card + 'EE',
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  personAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  personInfo: { flex: 1 },
  personName:  { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  personRole:  { color: Colors.textSecondary, fontSize: 12 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: 12, marginBottom: 4 },
  summaryValue: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  summaryPrice: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },

  // Weighing pending card (amber)
  weighingCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#D9770610',
    borderRadius: 12, padding: 14, marginBottom: 4,
    borderWidth: 1, borderColor: '#D9770635',
  },
  weighingCardTitle: { color: '#D97706', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  weighingCardText:  { color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },

  // Weighing confirmed card (green)
  weighedCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#16A34A10',
    borderRadius: 12, padding: 14, marginBottom: 4,
    borderWidth: 1, borderColor: '#16A34A35',
  },
  weighedTitle: { color: '#16A34A', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  weighedText:  { color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },

  // Timeline
  content: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 26 },
  stepRow: { flexDirection: 'row', marginBottom: 0 },
  stepLeft: { alignItems: 'center', width: 44, marginRight: 16 },
  stepLine: { width: 2, height: 40, backgroundColor: Colors.border, marginTop: 4 },
  stepLineDone: { backgroundColor: Colors.accent },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4, color: Colors.textPrimary },
  stepTime:  { color: Colors.textSecondary, fontSize: 12 },
  stepNote: {
    backgroundColor: '#D9770612',
    borderRadius: 8, padding: 8, marginTop: 6,
    borderWidth: 1, borderColor: '#D9770630',
  },
  stepNoteText: { color: '#D97706', fontSize: 11, lineHeight: 17 },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
    gap: 12,
    backgroundColor: Colors.bg,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  receiptBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 32,
    alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  receiptBtnText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  trackingBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 32,
    alignItems: 'center',
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  trackingBtnText: { color: Colors.accentText || '#000', fontSize: 15, fontWeight: '700' },

  // ── Payment card (muncul setelah ditimbang) ──
  paymentCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  paymentCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  paymentCardTitle: {
    color: Colors.textPrimary, fontSize: 15, fontWeight: '700',
  },
  paymentCardSub: {
    color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 14,
  },
  paymentOptions: { gap: 8, marginBottom: 14 },
  paymentOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 12,
    backgroundColor: Colors.bg,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  paymentOptActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  paymentOptText: { flex: 1, color: Colors.textPrimary, fontSize: 14, fontWeight: '500' },
  paymentOptTextActive: { color: Colors.accentText || '#000', fontWeight: '700' },
  payNowBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  payNowBtnText: { color: Colors.accentText || '#000', fontSize: 15, fontWeight: '800' },

  // ── Paid confirmation ──
  paidCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#16A34A10',
    borderRadius: 12, padding: 14,
    marginHorizontal: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#16A34A35',
  },
  paidTitle: { color: '#16A34A', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  paidSub:   { color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },
});
