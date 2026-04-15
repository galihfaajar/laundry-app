import React from 'react';
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
import { useRouter } from 'expo-router';
import { laundryItems } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

export default function LaundryItemsScreen() {
  const router = useRouter();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Item Laundry</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>(0{laundryItems.length})</Text>
            </View>
          </View>
          <Text style={styles.totalPrice}>Rp 35.500</Text>
        </View>

        {/* Section Labels */}
        <Text style={styles.sectionLabel}>Daftar Item</Text>
        <Text style={styles.subLabel}>Pakaian Campuran</Text>

        {/* Items List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {laundryItems.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <Text style={styles.subLabel}>Pakaian Campuran</Text>}
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => router.push('/cart')}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Text style={styles.itemName}>{item.serviceName}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                  <View style={styles.itemBottom}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={13} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View
                      style={[
                        styles.deliveryIconBox,
                        index === laundryItems.length - 1 && styles.deliveryIconBoxAlt,
                      ]}
                    >
                      {index === laundryItems.length - 1 ? (
                        <Ionicons name="refresh-outline" size={15} color={Colors.accent} />
                      ) : (
                        <Ionicons name="bicycle-outline" size={15} color={Colors.accentText || "#000"} />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  countBadge: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  totalPrice: { color: Colors.accent, fontSize: 17, fontWeight: '700' },
  sectionLabel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subLabel: { color: Colors.textSecondary, fontSize: 12, marginBottom: 12, marginTop: 8 },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemImage: { width: 90, height: 90, borderRadius: 12, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemPrice: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  itemName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  itemDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
    flex: 1,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  deliveryIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryIconBoxAlt: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

