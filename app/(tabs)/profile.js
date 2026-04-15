import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { userPreferences, paymentOptions } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

// ─── User Profile Singleton ───────────────────────────────────────────────────
// (Disimpan di modul level agar persist selama sesi app)
export const userProfile = {
  name: 'Galih Fajar',
  username: '@galihfajar',
  address: 'Jl. Melati No. 45, Banjarsari, Surakarta',
  avatar: null, // null = pakai default pravatar
};

const menuItems = [
  { id: '2', label: 'Metode Pembayaran', icon: 'card-outline', route: '/payment' },
  { id: '3', label: 'Notifikasi', icon: 'notifications-outline', route: '/notifications' },
  { id: '4', label: 'Bantuan dan Dukungan', icon: 'help-circle-outline', route: null },
];

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ visible, title, value, placeholder, onSave, onClose, Colors, styles, multiline }) {
  const [text, setText] = useState(value);

  useEffect(() => { if (visible) setText(value); }, [visible, value]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    Keyboard.dismiss();
    onClose();
  };

  const handleClose = () => { Keyboard.dismiss(); onClose(); };

  // Untuk iOS: KAV mengangkat sheet
  // Untuk Android: Modal window otomatis resize (adjustResize) saat keyboard muncul
  const Inner = (
    <View style={styles.modalContainer}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        <TextInput
          style={[styles.modalInput, multiline && styles.modalInputMultiline]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          autoFocus
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          returnKeyType={multiline ? 'default' : 'done'}
          onSubmitEditing={multiline ? undefined : handleSave}
        />
        <View style={styles.modalBtnRow}>
          <TouchableOpacity style={styles.modalBtnCancel} onPress={handleClose}>
            <Text style={styles.modalBtnCancelText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalBtnSave} onPress={handleSave}>
            <Text style={styles.modalBtnSaveText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {Inner}
        </KeyboardAvoidingView>
      ) : Inner}
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { Colors, isDark, toggleTheme } = useTheme();
  const styles = useStyles(Colors);

  // Profile state (synced to singleton)
  const [name, setName] = useState(userProfile.name);
  const [address, setAddress] = useState(userProfile.address);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  // Modal visibility
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editAddressVisible, setEditAddressVisible] = useState(false);

  // Re-render saat kembali dari halaman payment
  const [, forceUpdate] = useState(0);
  useFocusEffect(
    useCallback(() => { forceUpdate((n) => n + 1); }, [])
  );

  const activePayment = paymentOptions.find(
    (p) => p.id === userPreferences.paymentMethodId
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveName = (val) => {
    userProfile.name = val;
    setName(val);
  };

  const handleSaveAddress = (val) => {
    userProfile.address = val;
    setAddress(val);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Izinkan akses galeri untuk mengganti foto profil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      userProfile.avatar = result.assets[0].uri;
      setAvatar(result.assets[0].uri);
    }
  };

  const avatarUri = avatar || 'https://i.pravatar.cc/120?img=5';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar dengan tombol ganti foto */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto} activeOpacity={0.85}>
            <Image style={styles.profileAvatar} source={{ uri: avatarUri }} />
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={13} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Nama dengan tombol edit */}
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{name}</Text>
            <TouchableOpacity
              style={styles.inlineEditBtn}
              onPress={() => setEditNameVisible(true)}
            >
              <Ionicons name="pencil" size={13} color={Colors.accentText || '#000'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileUsername}>{userProfile.username}</Text>
        </View>

        {/* ─── Alamat Card ─── */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location-outline" size={17} color={Colors.accent} />
              <Text style={styles.addressTitle}>Alamat Utama</Text>
            </View>
            <TouchableOpacity
              style={styles.addressEditBtn}
              onPress={() => setEditAddressVisible(true)}
            >
              <Ionicons name="pencil-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.addressEditText}>Ubah</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {/* Settings List */}
        <View style={styles.menuList}>
          {/* Toggle Tema */}
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={19} color={Colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Mode Gelap</Text>
                <Text style={styles.menuSub}>{isDark ? 'Aktif' : 'Non-aktif'}</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.card}
            />
          </View>

          {/* Menu Lainnya */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => item.route && router.push(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.icon} size={19} color={Colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.id === '2' && activePayment && (
                    <Text style={styles.menuSub}>{activePayment.name}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={17} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ─── Edit Name Modal ─── */}
      <EditModal
        visible={editNameVisible}
        title="Edit Nama"
        value={name}
        placeholder="Masukkan nama lengkap..."
        onSave={handleSaveName}
        onClose={() => setEditNameVisible(false)}
        Colors={Colors}
        styles={styles}
        multiline={false}
      />

      {/* ─── Edit Address Modal ─── */}
      <EditModal
        visible={editAddressVisible}
        title="Edit Alamat"
        value={address}
        placeholder="Masukkan alamat lengkap..."
        onSave={handleSaveAddress}
        onClose={() => setEditAddressVisible(false)}
        Colors={Colors}
        styles={styles}
        multiline
      />
    </SafeAreaView>
  );
}

const useStyles = (Colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },

  // ── Profile Card ──
  profileCard: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#00000020',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0008',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.accentText || '#000',
  },
  inlineEditBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0001',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileUsername: { fontSize: 13, color: Colors.accentText || '#33400A', opacity: 0.75 },

  // ── Address Card ──
  addressCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  addressEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressEditText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  addressText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  // ── Menu List ──
  menuList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '500' },
  menuSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 1 },

  // ── Edit Modal ──
  // Container: flex-end supaya sheet ke bawah, paddingBottom dari JSX
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000065',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: Colors.bg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 20,
  },
  modalInputMultiline: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  modalBtnCancel: {
    flex: 1, paddingVertical: 15, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center',
  },
  modalBtnCancelText: { color: Colors.textPrimary, fontWeight: '600', fontSize: 15 },
  modalBtnSave: {
    flex: 1, paddingVertical: 15, borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  modalBtnSaveText: { color: Colors.accentText || '#000', fontWeight: '700', fontSize: 15 },
});
