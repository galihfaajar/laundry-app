import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { services, orderHistory } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

// ─── Data yang bisa dicari ───────────────────────────────────────────────────
const laundryPlaces = [
  {
    id: 'p1',
    type: 'tempat',
    name: 'Kinclong Laundry',
    address: 'Jl. Slamet Riyadi No. 12, Surakarta',
    rating: 4.9,
    tags: ['kinclong', 'laundry', 'solo', 'surakarta'],
    route: '/service/1',
  },
  {
    id: 'p2',
    type: 'tempat',
    name: 'Bersih Kilat Laundry',
    address: 'Jl. Brigjen Slamet Riyadi, Solo',
    rating: 4.7,
    tags: ['bersih', 'kilat', 'laundry', 'solo'],
    route: '/service/2',
  },
  {
    id: 'p3',
    type: 'tempat',
    name: 'Wangi Terus Laundry',
    address: 'Jl. Ahmad Yani No. 8, Surakarta',
    rating: 4.5,
    tags: ['wangi', 'terus', 'laundry', 'surakarta'],
    route: '/service/3',
  },
];

const suggestions = [
  'Cuci kilat', 'Setrika baju', 'Laundry terdekat',
  'Cuci sepatu', 'Dry clean', 'Paket hemat',
];

// ─── Normalize helper ─────────────────────────────────────────────────────────
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function matches(q, ...fields) {
  const nq = normalize(q);
  return fields.some((f) => normalize(f).includes(nq));
}

// ─── Komponen ServiceResult ───────────────────────────────────────────────────
function ServiceResult({ item, onPress, Colors, styles }) {
  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.resultIcon, { backgroundColor: Colors.accent }]}>
        <Ionicons name={item.iconName} size={20} color={Colors.accentText || "#000"} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>{item.price} {item.unit} · {item.time}</Text>
      </View>
      <View style={styles.resultBadge}>
        <Text style={styles.resultBadgeText}>Layanan</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Komponen PlaceResult ─────────────────────────────────────────────────────
function PlaceResult({ item, onPress, Colors, styles }) {
  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.resultIcon, { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border }]}>
        <Ionicons name="storefront-outline" size={20} color={Colors.textSecondary} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <View style={styles.placeSubRow}>
          <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.resultSubtitle} numberOfLines={1}>{item.address}</Text>
        </View>
      </View>
      <View style={styles.ratingPill}>
        <Ionicons name="star" size={11} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Komponen OrderResult ─────────────────────────────────────────────────────
function OrderResult({ item, onPress, Colors, styles }) {
  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.resultIcon, { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border }]}>
        <Ionicons name="receipt-outline" size={20} color={Colors.textSecondary} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.businessName}</Text>
        <Text style={styles.resultSubtitle}>{item.date} · {item.price}</Text>
      </View>
      <View style={[styles.resultBadge, item.status === 'Selesai' ? styles.badgeDone : styles.badgeActive]}>
        <Text style={[styles.resultBadgeText, item.status !== 'Selesai' && { color: Colors.accent }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Komponen Not Found ────────────────────────────────────────────────────────
function NotFoundView({ query, onChatAdmin, Colors, styles }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(onChatAdmin);
  };

  return (
    <View style={styles.notFoundContainer}>
      {/* Ikon besar */}
      <View style={styles.notFoundIconWrap}>
        <Ionicons name="search-outline" size={40} color={Colors.textSecondary} />
      </View>
      <Text style={styles.notFoundTitle}>Tidak ditemukan</Text>
      <Text style={styles.notFoundDesc}>
        Hasil untuk{' '}
        <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>"{query}"</Text>
        {'\n'}tidak ada dalam daftar kami.
      </Text>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Butuh bantuan?</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Card Admin Chat */}
      <View style={styles.adminCard}>
        <View style={styles.adminCardTop}>
          <View style={styles.adminAvatarWrap}>
            <Ionicons name="headset-outline" size={24} color={Colors.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.adminName}>Admin Laundry</Text>
            <Text style={styles.adminStatus}>
              <Text style={{ color: '#4CAF50' }}>● </Text>Online · Respon cepat
            </Text>
          </View>
        </View>

        <Text style={styles.adminDesc}>
          Tanyakan langsung ke Admin untuk info harga, ketersediaan layanan, atau pertanyaan lainnya.
        </Text>

        {/* Quick topic chips */}
        <View style={styles.topicChips}>
          {['Daftar harga?', 'Estimasi waktu?', 'Promo?', 'Cara pesan?'].map((t) => (
            <View key={t} style={styles.topicChip}>
              <Text style={styles.topicChipText}>{t}</Text>
            </View>
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity style={styles.chatAdminBtn} onPress={handlePress} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accentText || "#000"} />
            <Text style={styles.chatAdminBtnText}>Chat dengan Admin</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    const svcResults = services.filter((s) =>
      matches(q, s.name, s.desc, s.price)
    );
    const placeResults = laundryPlaces.filter((p) =>
      matches(q, p.name, p.address, ...p.tags)
    );
    const orderResults = orderHistory.filter((o) =>
      matches(q, o.businessName, o.status, o.price)
    );
    return { services: svcResults, places: placeResults, orders: orderResults };
  }, [query]);

  const hasResults = results
    ? results.services.length + results.places.length + results.orders.length > 0
    : true;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cari Layanan</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Layanan, tempat laundry, pesanan..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* State: Belum mengetik */}
          {!query && (
            <>
              <Text style={styles.sectionLabel}>Pencarian Populer</Text>
              <View style={styles.suggestionsWrap}>
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.suggestionChip}
                    onPress={() => setQuery(s)}
                  >
                    <Ionicons name="trending-up-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 5 }} />
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionLabel}>Kategori Layanan</Text>
              {services.map((s) => (
                <ServiceResult
                  key={s.id}
                  item={s}
                  onPress={() => router.push(`/service/${s.id}`)}
                  Colors={Colors}
                  styles={styles}
                />
              ))}
            </>
          )}

          {/* State: Ada query, ada hasil */}
          {query && hasResults && results && (
            <>
              {results.services.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Layanan ({results.services.length})</Text>
                  {results.services.map((s) => (
                    <ServiceResult
                      key={s.id}
                      item={s}
                      onPress={() => router.push(`/service/${s.id}`)}
                      Colors={Colors}
                      styles={styles}
                    />
                  ))}
                </>
              )}

              {results.places.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Tempat Laundry ({results.places.length})</Text>
                  {results.places.map((p) => (
                    <PlaceResult
                      key={p.id}
                      item={p}
                      onPress={() => router.push(p.route)}
                      Colors={Colors}
                      styles={styles}
                    />
                  ))}
                </>
              )}

              {results.orders.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Riwayat Pesanan ({results.orders.length})</Text>
                  {results.orders.map((o) => (
                    <OrderResult
                      key={o.id}
                      item={o}
                      onPress={() => router.push('/track-order')}
                      Colors={Colors}
                      styles={styles}
                    />
                  ))}
                </>
              )}
            </>
          )}

          {/* State: Tidak ditemukan */}
          {query && !hasResults && (
            <NotFoundView
              query={query}
              onChatAdmin={() =>
                router.push({ pathname: '/chat/4' })
              }
              Colors={Colors}
              styles={styles}
            />
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const useStyles = (Colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 14,
    justifyContent: 'space-between',
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

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 14 },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },

  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: { color: Colors.textPrimary, fontSize: 13 },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  resultIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: { flex: 1 },
  resultTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  resultSubtitle: { color: Colors.textSecondary, fontSize: 12 },
  placeSubRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },

  resultBadge: {
    backgroundColor: Colors.bg,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeDone: { borderColor: Colors.border },
  badgeActive: { borderColor: Colors.accent + '50', backgroundColor: Colors.accent + '10' },
  resultBadgeText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },

  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '20',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
    gap: 3,
  },
  ratingText: { color: Colors.accent, fontSize: 12, fontWeight: '700' },

  // Not Found
  notFoundContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  notFoundIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notFoundTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  notFoundDesc: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 22,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontSize: 12 },

  adminCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.accent + '40',
  },
  adminCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adminAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
  },
  adminName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  adminStatus: { color: Colors.textSecondary, fontSize: 12 },
  adminDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },

  topicChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
  },
  topicChip: {
    backgroundColor: Colors.bg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicChipText: { color: Colors.textSecondary, fontSize: 12 },

  chatAdminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 32,
    paddingVertical: 14,
    gap: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  chatAdminBtnText: { color: Colors.accentText || '#000', fontSize: 15, fontWeight: '700' },
});

