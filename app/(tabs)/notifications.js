import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notifications } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

export default function NotificationsTab() {
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifikasi</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
              <Text style={styles.emptySub}>Notifikasi pesanan akan muncul di sini</Text>
            </View>
          )}

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
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },

  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  emptySub: { color: Colors.textSecondary, fontSize: 14 },

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
