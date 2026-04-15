import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { paymentOptions, userPreferences } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { Colors } = useTheme();
  const styles = useStyles(Colors);
  // Baca pilihan aktif dari userPreferences (singleton global)
  const [selected, setSelected] = useState(userPreferences.paymentMethodId);

  const handleSave = () => {
    // Simpan ke singleton — akan terbaca di Receipt & Profile
    userPreferences.paymentMethodId = selected;
    router.back();
  };

  const activeMethod = paymentOptions.find((p) => p.id === selected);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Metode Pembayaran</Text>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Info aktif */}
        {activeMethod && (
          <View style={styles.activeInfoBox}>
            <View style={styles.activeIconWrap}>
              <Ionicons name={activeMethod.icon} size={20} color={Colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.activeInfoLabel}>Metode Aktif</Text>
              <Text style={styles.activeInfoName}>{activeMethod.name}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>Pilih Metode Pembayaran</Text>

        {paymentOptions.map((option) => {
          const isSelected = option.id === selected;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.payCard, isSelected && styles.payCardSelected]}
              onPress={() => setSelected(option.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.payIconBox, isSelected && styles.payIconBoxSelected]}>
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={isSelected ? (Colors.accentText || '#000') : Colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.payName, isSelected && styles.payNameSelected]}>
                  {option.name}
                </Text>
                <Text style={[styles.payDesc, isSelected && styles.payDescSelected]}>
                  {option.desc}
                </Text>
              </View>
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={Colors.accentText || "#000"} style={{ marginRight: 8 }} />
          <Text style={styles.ctaText}>Simpan Perubahan</Text>
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

  activeInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.accent + '50',
  },
  activeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '60',
  },
  activeInfoLabel: { color: Colors.textSecondary, fontSize: 11, marginBottom: 2 },
  activeInfoName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  activeBadge: { marginLeft: 8 },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  payCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
  },
  payCardSelected: {
    backgroundColor: Colors.accent + '12',
    borderColor: Colors.accent,
  },
  payIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  payIconBoxSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  payName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  payNameSelected: { color: Colors.textPrimary },
  payDesc: { color: Colors.textSecondary, fontSize: 12 },
  payDescSelected: { color: Colors.textSecondary },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  radioOuterSelected: { borderColor: Colors.accent },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.accent,
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
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaText: { color: Colors.accentText || '#000', fontSize: 16, fontWeight: '700' },
});

