import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { userPreferences, startOrderSimulation } from '../constants/mockData';
import { userProfile } from './(tabs)/profile';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

// ─── Stepper Component ────────────────────────────────────────────────────────
function Stepper({ value, min, max, onDecrement, onIncrement, suffix, Colors, styles }) {
  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity
        style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
        onPress={onDecrement}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={20} color={value <= min ? Colors.textSecondary : Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.stepValueWrap}>
        <Text style={styles.stepValue}>{value}</Text>
        <Text style={styles.stepSuffix}>{suffix}</Text>
      </View>
      <TouchableOpacity
        style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
        onPress={onIncrement}
        disabled={value >= max}
      >
        <Ionicons name="add" size={20} color={value >= max ? Colors.textSecondary : Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isPickup, setIsPickup] = useState(false); // default: Antar ke Toko (Gratis)
  const [isExpress, setIsExpress] = useState(false);
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  // Baca alamat dari singleton userProfile, refresh setiap kali layar fokus
  const [pickupAddress, setPickupAddress] = useState(userProfile.address);
  useFocusEffect(
    useCallback(() => {
      setPickupAddress(userProfile.address);
    }, [])
  );

  // Data dari service detail / custom package
  const pricePerUnit  = parseInt(params.basePrice) || 8000;
  const serviceName   = params.serviceName || 'Layanan Binatu';
  const unit          = params.unit || '/kilo';
  const potongExtra   = parseInt(params.potongExtra) || 0; // biaya /potong dari paket kustom
  const potongNote    = params.potongNote || '';
  const isByKilo      = unit === '/kilo';

  // State berat / quantity
  const [weight, setWeight] = useState(2);
  const [qty, setQty]       = useState(1);

  // Opsi kecepatan
  const EXPRESS_SURCHARGE = 5000;
  const expressEta  = 'Selesai hari ini (< 6 jam)';
  const standardEta = 'Selesai 1–2 hari kerja';

  // Kalkulasi harga
  const amount       = isByKilo ? weight : qty;
  const serviceTotal = pricePerUnit * amount + potongExtra;  // potongExtra flat (bukan per kg)
  const deliveryFee  = isPickup ? 2000 : 0;
  const expressFee   = isExpress ? EXPRESS_SURCHARGE : 0;
  const totalPrice   = serviceTotal + deliveryFee + expressFee;

  // Helper format
  const fmtRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;
  const displayUnit = isByKilo ? 'kg' : 'potong';

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Keranjang</Text>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Item Card */}
        <View style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.shirtBox}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&q=80' }}
                style={styles.shirtImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{serviceName}</Text>
              <Text style={styles.itemUnit}>
                {fmtRp(pricePerUnit)}{' '}
                <Text style={styles.itemUnitSmall}>{unit}</Text>
              </Text>
              <View style={styles.estimasiPill}>
                <Ionicons name="information-circle-outline" size={12} color={Colors.accent} />
                <Text style={styles.estimasiText}>Harga adalah estimasi</Text>
              </View>
            </View>
          </View>

          {isByKilo && (
            <View style={styles.weighingInfoBanner}>
              <Ionicons name="scale-outline" size={16} color={Colors.accent} />
              <Text style={styles.weighingInfoText}>
                <Text style={{ fontWeight: '700' }}>Tenang!</Text> Ini cukup estimasi aja.
                Berat asli akan ditimbang petugas — harga finalnya dikirim ke notifikasi kamu.
              </Text>
            </View>
          )}

          {/* ─── Weight / Qty Stepper ─── */}
          <View style={styles.weightSection}>
            <View style={styles.weightLabelRow}>
              <Ionicons
                name={isByKilo ? 'scale-outline' : 'shirt-outline'}
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.weightLabel}>
                {isByKilo ? 'Estimasi Berat Cucian' : 'Jumlah Pakaian'}
              </Text>
            </View>
            {isByKilo ? (
              <>
                <Stepper
                  value={weight}
                  min={1}
                  max={20}
                  suffix="kg"
                  onDecrement={() => setWeight((w) => Math.max(1, w - 1))}
                  onIncrement={() => setWeight((w) => Math.min(20, w + 1))}
                  Colors={Colors}
                  styles={styles}
                />
                <Text style={styles.weightHint}>
                  Berat aktual dikonfirmasi setelah ditimbang petugas
                </Text>
              </>
            ) : (
              <>
                <Stepper
                  value={qty}
                  min={1}
                  max={50}
                  suffix="potong"
                  onDecrement={() => setQty((q) => Math.max(1, q - 1))}
                  onIncrement={() => setQty((q) => Math.min(50, q + 1))}
                  Colors={Colors}
                  styles={styles}
                />
                <Text style={styles.weightHint}>
                  Jumlah aktual dikonfirmasi setelah diperiksa petugas
                </Text>
              </>
            )}
          </View>

          {/* ─── Delivery Option Toggle ─── */}
          <View style={styles.deliverySelector}>
            <TouchableOpacity
              style={[styles.deliveryOption, !isPickup && styles.deliveryOptionActive]}
              onPress={() => setIsPickup(false)}
            >
              <Text style={[styles.deliveryOptionText, !isPickup && styles.deliveryOptionTextActive]}>
                Antar ke Toko
              </Text>
              <Text style={[styles.deliveryOptionSub, !isPickup && styles.deliveryOptionSubActive]}>
                Gratis
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deliveryOption, isPickup && styles.deliveryOptionActive]}
              onPress={() => setIsPickup(true)}
            >
              <Text style={[styles.deliveryOptionText, isPickup && styles.deliveryOptionTextActive]}>
                Diambil (Pickup)
              </Text>
              <Text style={[styles.deliveryOptionSub, isPickup && styles.deliveryOptionSubActive]}>
                +Rp 2.000
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── Speed Option ─── */}
          <View style={styles.speedSectionLabel}>
            <Ionicons name="flash-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.speedSectionLabelText}>Kecepatan Pengerjaan</Text>
          </View>
          <View style={styles.deliverySelector}>
            <TouchableOpacity
              style={[styles.deliveryOption, !isExpress && styles.deliveryOptionActive]}
              onPress={() => setIsExpress(false)}
            >
              <View style={styles.speedOptionRow}>
                <Ionicons name="time-outline" size={13} color={!isExpress ? (Colors.accentText || '#000') : Colors.textSecondary} />
                <Text style={[styles.deliveryOptionText, !isExpress && styles.deliveryOptionTextActive]}>
                  Standar
                </Text>
              </View>
              <Text style={[styles.deliveryOptionSub, !isExpress && styles.deliveryOptionSubActive]}>
                Gratis
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deliveryOption, isExpress && styles.deliveryOptionActive]}
              onPress={() => setIsExpress(true)}
            >
              <View style={styles.speedOptionRow}>
                <Ionicons name="flash" size={13} color={isExpress ? (Colors.accentText || '#000') : Colors.textSecondary} />
                <Text style={[styles.deliveryOptionText, isExpress && styles.deliveryOptionTextActive]}>
                  Kilat
                </Text>
              </View>
              <Text style={[styles.deliveryOptionSub, isExpress && styles.deliveryOptionSubActive]}>
                +Rp 5.000
              </Text>
            </TouchableOpacity>
          </View>

          {/* Estimasi selesai */}
          <View style={styles.etaBadge}>
            <Ionicons
              name={isExpress ? 'flash' : 'time-outline'}
              size={13}
              color={isExpress ? Colors.accent : Colors.textSecondary}
            />
            <Text style={[styles.etaBadgeText, isExpress && { color: Colors.accent }]}>
              {isExpress ? expressEta : standardEta}
            </Text>
          </View>
        </View>

        {/* ─── Rincian Harga ─── */}
        <Text style={styles.sectionTitle}>Rincian Harga</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{serviceName}</Text>
            <Text style={styles.summaryValue}>{fmtRp(pricePerUnit)}{unit}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>× {amount} {displayUnit}</Text>
            <Text style={styles.summaryValue}>{fmtRp(pricePerUnit * amount)}</Text>
          </View>
          {potongExtra > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {potongNote ? `+ ${potongNote} (/potong)` : '+ Layanan /potong'}
              </Text>
              <Text style={styles.summaryValue}>{fmtRp(potongExtra)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Pickup</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee === 0 ? 'Gratis' : fmtRp(deliveryFee)}
            </Text>
          </View>
          {isExpress && (
            <View style={styles.summaryRow}>
              <View style={styles.expressBadgeInline}>
                <Ionicons name="flash" size={12} color={Colors.accent} />
                <Text style={styles.summaryLabel}>Layanan Kilat</Text>
              </View>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                +{fmtRp(EXPRESS_SURCHARGE)}
              </Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryTotalLabel}>Total Estimasi</Text>
              <Text style={styles.summaryTotalNote}>
                *Final dikonfirmasi setelah ditimbang
              </Text>
            </View>
            <Text style={styles.summaryTotalValue}>{fmtRp(totalPrice)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          {/* Sistem Pembayaran — di dalam kotak rincian harga */}
          <View style={styles.payLaterInfo}>
            <View style={styles.payLaterIconWrap}>
              <Ionicons name="cash-outline" size={18} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payLaterTitle}>Sistem Pembayaran</Text>
              <Text style={styles.payLaterInfoText}>
                Bayar setelah cucian ditimbang & harga final dikonfirmasi petugas.
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Address (if pickup) — kotak terpisah ─── */}
        {isPickup && (
          <View style={styles.infoGroupCard}>
            <View style={styles.pickupHeader}>
              <Ionicons name="location-outline" size={18} color={Colors.textPrimary} />
              <Text style={styles.pickupTitle}>Alamat Penjemputan</Text>
            </View>
            <View style={styles.addressCard}>
              <View style={styles.mapContainer}>
                <Image
                  source={require('../assets/map-solo.png')}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
                <View style={styles.mapPinWrapper}>
                  <View style={styles.mapPinDot}>
                    <Ionicons name="location" size={22} color={Colors.accent} />
                  </View>
                </View>
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.addressRow}>
                  <View style={styles.addressLeft}>
                    <Text style={styles.addressLabel}>Rumah</Text>
                    <Text style={styles.addressText}>{pickupAddress}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ─── Checkout CTA ─── */}
      <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Estimasi</Text>
            <Text style={styles.totalSub}>{amount} {displayUnit} × {fmtRp(pricePerUnit)}</Text>
          </View>
          <Text style={styles.totalPrice}>{fmtRp(totalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            router.push({
              pathname: '/receipt',
              params: {
                isPickup: String(isPickup),
                pickupAddress,
                serviceName,
                pricePerUnit: String(pricePerUnit),
                unit,
                amount: String(amount),
                serviceTotal: String(serviceTotal),
                deliveryFee: String(deliveryFee),
                totalPrice: String(totalPrice),
                potongExtra: String(potongExtra),
                potongNote,
                isExpress: String(isExpress),
                expressFee: String(expressFee),
                eta: isExpress ? expressEta : standardEta,
              },
            });
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Kirim Pesanan</Text>
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
    paddingBottom: 16,
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

  // Item Card
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemRow: { flexDirection: 'row', marginBottom: 18 },
  shirtBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#3D5C00',
    marginRight: 12,
  },
  shirtImage: { width: '100%', height: '100%' },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  itemUnit: { color: Colors.accent, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  itemUnitSmall: { color: Colors.textSecondary, fontSize: 12, fontWeight: '400' },
  estimasiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accent + '15',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  estimasiText: { color: Colors.accent, fontSize: 11, fontWeight: '600' },

  // Weight Section
  weightSection: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weightLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  weightLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  weightHint: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },

  weighingInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.accent + '15',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  weighingInfoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepValueWrap: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepValue: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  stepSuffix: { color: Colors.textSecondary, fontSize: 13 },

  // Delivery selector
  deliverySelector: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliveryOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  deliveryOptionActive: { backgroundColor: Colors.accent },
  deliveryOptionText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  deliveryOptionTextActive: { color: Colors.accentText || '#000', fontWeight: '700' },
  deliveryOptionSub: { fontSize: 11, color: Colors.textSecondary },
  deliveryOptionSubActive: { color: Colors.accentText || '#000', opacity: 0.8 },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  deliveryText: { color: Colors.textSecondary, fontSize: 13 },
  editText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },

  // Speed Section
  speedSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  speedSectionLabelText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  speedOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etaBadgeText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '500' },
  expressBadgeInline: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  // Summary Card
  sectionTitle: { color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 14 },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: 14 },
  summaryValue: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  summaryTotalLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  summaryTotalNote: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  summaryTotalValue: { color: Colors.accent, fontSize: 20, fontWeight: '800' },

  // Address / Info Group
  infoGroupCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoGroupDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  payLaterInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  payLaterIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payLaterTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  payLaterInfoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  pickupSection: {},
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  pickupTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  addressCard: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapContainer: { height: 150, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  mapPinWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card + 'DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  addressInfo: { padding: 14 },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressLeft: { flex: 1, marginRight: 12 },
  addressLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  addressText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  // CTA
  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 2 },
  totalSub: { color: Colors.textSecondary, fontSize: 11 },
  totalPrice: { color: Colors.accent, fontSize: 20, fontWeight: '800' },
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

  // Metode Pembayaran
  paymentList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  paymentOptionActive: {
    backgroundColor: Colors.accent + '12',
  },
  paymentOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentIconWrapActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  paymentName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  paymentNameActive: { color: Colors.textPrimary },
  paymentDesc: { color: Colors.textSecondary, fontSize: 12 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  radioOuterActive: { borderColor: Colors.accent },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
});
