import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { orderHistory, userPreferences, paymentOptions, startOrderSimulation } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

// ─── Barcode Dekoratif ────────────────────────────────────────────────────────
function BarcodeView() {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  const bars = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        width: i % 3 === 0 ? 4 : i % 5 === 0 ? 2 : 3,
        gap: i % 4 === 0 ? 4 : 2,
      })),
    []
  );

  return (
    <View style={styles.barcodeContainer}>
      <View style={styles.barcodeInner}>
        {bars.map((bar) => (
          <View
            key={bar.id}
            style={{
              width: bar.width,
              height: 70,
              backgroundColor: '#1A1F1A',
              marginRight: bar.gap,
            }}
          />
        ))}
      </View>
      <Text style={styles.barcodeNum}>LD1408287</Text>
    </View>
  );
}

// ─── Row item di struk ────────────────────────────────────────────────────────
function ReceiptRow({ label, value, bold, accent, dimLabel }) {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  return (
    <View style={styles.receiptRow}>
      <Text style={[styles.receiptRowLabel, dimLabel && { color: Colors.textSecondary + 'AA' }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.receiptRowValue,
          bold && { fontWeight: '800' },
          accent && { color: Colors.accent },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  // ─── Baca semua params dari cart ─────────────────────────────────────────
  const serviceName   = params.serviceName  || 'Layanan Binatu';
  const pricePerUnit  = parseInt(params.pricePerUnit)  || 8000;
  const unit          = params.unit         || '/kilo';
  const amount        = parseInt(params.amount)        || 2;
  const serviceTotal  = parseInt(params.serviceTotal)  || pricePerUnit * amount;
  const deliveryFee   = parseInt(params.deliveryFee)   || 0;
  const totalPrice    = parseInt(params.totalPrice)    || serviceTotal + deliveryFee;
  const potongExtra   = parseInt(params.potongExtra)   || 0;
  const potongNote    = params.potongNote   || '';
  const isPickupStr   = params.isPickup !== undefined ? String(params.isPickup) : 'true';
  const isPickup      = isPickupStr === 'true';
  const pickupAddress = params.pickupAddress || 'Alamat tidak tersedia';
  const isExpress     = params.isExpress === 'true';
  const expressFee    = parseInt(params.expressFee) || 0;
  const eta           = params.eta || (isExpress ? 'Selesai hari ini (< 6 jam)' : 'Selesai 1–2 hari kerja');
  const isByKilo     = unit === '/kilo';
  const displayUnit  = isByKilo ? 'kg' : 'potong';
  const fmtRp        = (n) => `Rp ${parseInt(n).toLocaleString('id-ID')}`;
  
  // Dibuka dari riwayat (bukan dari checkout baru)
  const fromHistory   = params.fromHistory === 'true';
  const isCompleted   = params.isCompleted === 'true';
  const paymentMethod = params.paymentMethod || '';
  const realWeight    = parseFloat(params.realWeight) || amount;

  // Tanggal & nomor pesanan
  const now     = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pesanan Diterima</Text>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ─── Badge Status Pesanan ─── */}
        {isCompleted ? (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.completedTitle}>Pesanan Selesai 🎉</Text>
              <Text style={styles.completedText}>
                {paymentMethod ? `Dibayar via ${paymentMethod}.` : ''}{' '}Terima kasih telah menggunakan Kinclong Laundry!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.weighingPendingBanner}>
            <Ionicons name="scale-outline" size={18} color="#D97706" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.weighingPendingTitle}>Menunggu Penimbangan</Text>
              <Text style={styles.weighingPendingText}>
                Petugas akan menimbang cucian dan mengirim konfirmasi berat + harga final ke notifikasi kamu. Pembayaran dilakukan setelah itu.
              </Text>
            </View>
          </View>
        )}

        {/* ─── Kartu Struk ─── */}
        <View style={styles.receiptCard}>
          {/* Header struk */}
          <View style={styles.receiptHeader}>
            <View style={styles.receiptLogoBox}>
              <Ionicons name="water-outline" size={22} color={Colors.accentText || '#000'} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.receiptBizName}>Kinclong Laundry</Text>
              <Text style={styles.receiptDate}>{dateStr} · {timeStr}</Text>
            </View>
            {isCompleted ? (
              <View style={[styles.statusPill, styles.statusPillDone]}>
                <Text style={[styles.statusPillText, { color: '#16A34A' }]}>Selesai</Text>
              </View>
            ) : (
              <View style={[styles.statusPill, styles.statusPillPending]}>
                <Text style={[styles.statusPillText, { color: '#D97706' }]}>Menunggu Timbang</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* ─── Rincian Layanan ─── */}
          <Text style={styles.sectionLabel}>Detail Layanan</Text>

          <ReceiptRow
            label={serviceName}
            value={`${fmtRp(pricePerUnit)} ${unit}`}
          />
          <ReceiptRow
            label={`× ${amount} ${displayUnit} (estimasi)`}
            value={fmtRp(pricePerUnit * amount)}
            dimLabel
          />
          {potongExtra > 0 && (
            <ReceiptRow
              label={`+ ${potongNote || 'Layanan /potong'}`}
              value={fmtRp(potongExtra)}
              dimLabel
            />
          )}

          <View style={styles.dividerLight} />

          {/* ─── Biaya Tambahan ─── */}
          <Text style={[styles.sectionLabel, { marginTop: 4 }]}>Biaya Tambahan</Text>
          <ReceiptRow
            label={isPickup ? 'Biaya Pickup' : 'Antar ke Toko'}
            value={deliveryFee === 0 ? 'Gratis' : fmtRp(deliveryFee)}
          />
          {isPickup && (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.addressRowText}>{pickupAddress}</Text>
            </View>
          )}
          {isExpress && (
            <ReceiptRow
              label="⚡ Layanan Kilat"
              value={`+${fmtRp(expressFee)}`}
              accent
            />
          )}

          <View style={styles.divider} />

          {/* ─── Total ─── */}
          <View style={styles.totalBox}>
            <View>
              <Text style={styles.totalBoxLabel}>Total Estimasi</Text>
              <Text style={styles.totalBoxNote}>
                {fmtRp(pricePerUnit)} × {amount} {displayUnit}
                {potongExtra > 0 ? ` + ${fmtRp(potongExtra)}` : ''}
                {deliveryFee > 0 ? ` + ${fmtRp(deliveryFee)}` : ''}
                {expressFee > 0 ? ` + ${fmtRp(expressFee)} (kilat)` : ''}
              </Text>
            </View>
            <Text style={styles.totalBoxValue}>{fmtRp(totalPrice)}</Text>
          </View>

          {/* Estimasi selesai */}
          <View style={styles.etaBanner}>
            <Ionicons
              name={isExpress ? 'flash' : 'time-outline'}
              size={15}
              color={isExpress ? Colors.accent : Colors.textSecondary}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.etaBannerLabel}>{isExpress ? '⚡ Layanan Kilat' : 'Layanan Standar'}</Text>
              <Text style={[styles.etaBannerEta, isExpress && { color: Colors.accent }]}>{eta}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ─── Barcode ─── */}
          <BarcodeView />

          <View style={styles.divider} />

          {/* ─── Petugas ─── */}
          <Text style={styles.sectionLabel}>Petugas Laundry</Text>
          <View style={styles.contactRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/80?img=8' }}
              style={styles.contactAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Budi Santoso</Text>
              <Text style={styles.contactRole}>Petugas Laundry</Text>
            </View>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => router.push('/chat/1')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={17} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Info kontak */}
          {[
            { icon: 'call-outline', text: '(021) 555-0113' },
            { icon: 'mail-outline', text: 'halo@kinclonglaundry.id' },
            { icon: 'location-outline', text: 'Jl. Slamet Riyadi No. 12, Surakarta' },
          ].map((item) => (
            <View key={item.icon} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={item.icon} size={14} color={Colors.textSecondary} />
              </View>
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}

          {/* Catatan berat */}
          <View style={styles.weightNote}>
            <Ionicons name="scale-outline" size={15} color={Colors.accentText || '#000'} />
            <Text style={styles.weightNoteText}>
              Berat yang digunakan dalam struk ini adalah estimasi Anda ({amount} {displayUnit}).
              Petugas akan menimbang ulang dan mengirimkan konfirmasi berat & harga final sebelum proses dimulai.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ─── CTA ─── */}
      <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => {
            if (fromHistory) {
              router.push('/(tabs)/order');
            } else {
              // Mulai simulasi & tangkap orderId
              const orderId = startOrderSimulation(
                {
                  serviceName,
                  price: fmtRp(totalPrice),
                  totalPrice,
                  amount,
                  unit,
                  pricePerUnit,
                  expressFee,
                  deliveryFee,
                  isPickup,
                  pickupAddress,
                  selectedServices: [serviceName],
                },
                null,
              );
              // Navigasi ke track-order dengan orderId agar bisa reaktif
              router.push({
                pathname: '/track-order',
                params: {
                  orderId,
                  serviceName,
                  totalPriceStr: fmtRp(totalPrice),
                },
              });
            }
          }}
        >
          <Text style={styles.ctaText}>
            {fromHistory ? 'Kembali ke Pesanan' : 'Lacak Pesanan Saya'}
          </Text>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  scrollView: { flex: 1, paddingHorizontal: 20 },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  addressRowText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },

  estimasiBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.accent + '15',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  estimasiText: { flex: 1, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },

  receiptCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptLogoBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  receiptBizName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  receiptDate: { color: Colors.textSecondary, fontSize: 12 },
  statusPill: {
    backgroundColor: Colors.accent + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  statusPillPending: {
    backgroundColor: '#D9770620',
    borderColor: '#D9770650',
  },
  statusPillDone: {
    backgroundColor: '#16A34A20',
    borderColor: '#16A34A50',
  },
  statusPillText: { color: Colors.accent, fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 16 },
  dividerLight: { height: 1, backgroundColor: Colors.border + '88', marginVertical: 10 },

  weighingPendingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#D9770615',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D9770640',
  },
  weighingPendingTitle: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  weighingPendingText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#16A34A15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#16A34A40',
  },
  completedTitle: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptRowLabel: { color: Colors.textSecondary, fontSize: 13, flex: 1, marginRight: 8 },
  receiptRowValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },

  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  totalBoxLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  totalBoxNote: { color: Colors.textSecondary, fontSize: 11, lineHeight: 16, maxWidth: 180 },
  totalBoxValue: { color: Colors.accent, fontSize: 22, fontWeight: '800' },

  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etaBannerLabel: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  etaBannerEta: { color: Colors.textSecondary, fontSize: 12 },

  barcodeContainer: { alignItems: 'center' },
  barcodeInner: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
  barcodeNum: { color: Colors.textSecondary, fontSize: 11, marginTop: 8, letterSpacing: 2 },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  contactAvatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  contactName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  contactRole: { color: Colors.textSecondary, fontSize: 12 },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoText: { color: Colors.textSecondary, fontSize: 13 },

  weightNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weightNoteText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },


  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaText: { color: Colors.accentText || '#000', fontSize: 16, fontWeight: '700' },
});
