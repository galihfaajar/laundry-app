import React from 'react';
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
import { notifications } from '../constants/mockData';
import { useTheme } from '../constants/ThemeContext';

export default function NotificationsScreen() {
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
          <Text style={styles.headerTitle}>Notifikasi</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {notifications.map((group) => (
            <View key={group.id}>
              <Text style={styles.groupLabel}>{group.group}</Text>
              {group.items.map((item) => (
                <View key={item.id} style={styles.notifCard}>
                  <View style={styles.notifIcon}>
                    <Ionicons name={item.icon} size={18} color={Colors.accent} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifText}>{item.text}</Text>
                    <Text style={styles.notifTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
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
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 20,
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
  groupLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 6,
  },
  notifCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifText: {
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  notifTime: { color: Colors.textSecondary, fontSize: 11 },
});

