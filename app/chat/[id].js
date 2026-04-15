import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { conversations } from '../../constants/mockData';
import { useTheme } from '../../constants/ThemeContext';

const laundryQuickReplies = ['Kapan diproses?', 'Pakaian sudah dicuci?', 'Terima kasih'];
const courierQuickReplies = ['Sudah sampai mana?', 'Kira-kira berapa menit lagi?', 'Hati-hati di jalan'];
const adminQuickReplies = [
  'Daftar harga layanan?',
  'Estimasi waktu pengerjaan?',
  'Jam operasional?',
  'Cara pesan laundry?',
  'Bisa antar jemput?',
  'Promo saat ini?',
];

export default function ChatScreen() {
  const router = useRouter();
  const { id, initialMessage } = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  const { Colors } = useTheme();
  const styles = useStyles(Colors);

  const person = conversations.find((c) => c.id === id) || conversations[0];
  const isCourier = person.role === 'Kurir Pengiriman';
  const isAdmin = person.role === 'Admin Laundry';
  const firstName = person.name.split(' ')[0];
  const activeQuickReplies = isAdmin ? adminQuickReplies : (isCourier ? courierQuickReplies : laundryQuickReplies);

  useEffect(() => {
    // Jalankan pesan inisial hanya jika histori masih kosong (agar tidak duplikat)
    if (initialMessage && person.messages.length === 0) {
      const newInitial = {
        id: 'init-' + Date.now(),
        type: 'received',
        text: initialMessage,
        time: new Date().toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' }),
      };
      person.messages.push(newInitial);
      setMessages([...person.messages]);
    }
  }, [initialMessage, person]);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([...person.messages]);

  // Fungsi pembantu untuk sinkronisasi histori global
  const updateGlobalHistory = (newMsg) => {
    person.messages.push(newMsg);
    setMessages([...person.messages]);
    // Update last message di daftar chat
    person.lastMessage = newMsg.text;
    person.time = newMsg.time;
  };

  const generateBotResponse = (text) => {
    const msg = text.toLowerCase();

    // LOGIKA UNTUK ADMIN LAUNDRY
    if (isAdmin) {
      if (msg.includes('harga') || msg.includes('biaya') || msg.includes('tarif') || msg.includes('berapa') || msg.includes('daftar harga')) {
        return '📋 Berikut daftar harga layanan kami:\n\n🌀 Pengeringan — Rp 8.000/kilo (~35 mnt)\n👕 Cuci — Rp 10.000/kilo (~45 mnt)\n⚡ Setrika — Rp 7.000/kilo (~20 mnt)\n🧴 Pemutih — Rp 12.000/potong (~25 mnt)\n📦 Lipat — Rp 5.000/kilo (~15 mnt)\n\nMau paket kustom? Pilih "Paket Kustom" di halaman utama untuk gabung layanan ya Kak! 😊';
      }
      if (msg.includes('estimasi') || msg.includes('waktu') || msg.includes('lama') || msg.includes('kapan selesai') || msg.includes('pengerjaan')) {
        return '⏱️ Estimasi waktu pengerjaan:\n\n• Cuci saja: ±45 menit\n• Cuci + Setrika: ±65 menit\n• Paket lengkap: ±2 jam\n• Express (kilat): ±30 menit (biaya tambahan)\n\nPesanan masuk sebelum jam 12 siang biasanya selesai di hari yang sama kak!';
      }
      if (msg.includes('jam') || msg.includes('buka') || msg.includes('operasional') || msg.includes('tutup')) {
        return '🕐 Jam operasional kami:\n\nSenin – Sabtu: 07.00 – 21.00 WIB\nMinggu & Hari Libur: 08.00 – 18.00 WIB\n\nPesanan bisa masuk kapan saja lewat aplikasi, pengerjaan dimulai saat toko buka ya Kak 🙏';
      }
      if (msg.includes('cara pesan') || msg.includes('pesan') || msg.includes('order') || msg.includes('gimana') || msg.includes('bagaimana')) {
        return '📱 Cara pesan laundry:\n\n1️⃣ Buka menu Layanan di halaman utama\n2️⃣ Pilih layanan (atau Paket Kustom)\n3️⃣ Tap "Pesan Sekarang"\n4️⃣ Pilih pickup atau antar ke toko\n5️⃣ Checkout & tunggu konfirmasi!\n\nMudah banget kan Kak? 😄';
      }
      if (msg.includes('antar') || msg.includes('jemput') || msg.includes('pickup') || msg.includes('delivery')) {
        return '🛵 Layanan antar-jemput tersedia Kak!\n\n✅ Antar ke toko sendiri: Gratis\n🚀 Pickup ke lokasi kamu: +Rp 2.000\n📦 Antar kembali ke alamat: +Rp 2.000\n\nJangkauan: radius 5 km dari toko kami di Jl. Slamet Riyadi, Surakarta.';
      }
      if (msg.includes('promo') || msg.includes('diskon') || msg.includes('voucher') || msg.includes('kupon')) {
        return '🎉 Promo aktif bulan ini:\n\n🏷️ Diskon 15% untuk transaksi pertama\n💚 Gratis lipat untuk pembelian ≥ 5 kilo\n🎁 Kupon Rp 15.000 untuk referral teman\n\nCek notifikasi untuk kode kupon terbaru ya Kak! 🔔';
      }
      if (msg.includes('makasih') || msg.includes('terima kasih') || msg.includes('ok') || msg.includes('oke') || msg.includes('siap')) {
        return 'Sama-sama Kak! Kalau ada pertanyaan lain jangan sungkan ya 😊 Selamat mencoba layanan kami! 🧺';
      }
      if (msg.includes('halo') || msg.includes('hai') || msg.includes('hello')) {
        return 'Halo Kak! 👋 Senang bisa melayani. Ada yang bisa Admin bantu hari ini? Ketik pertanyaan atau gunakan tombol cepat di bawah!';
      }
      return 'Maaf Kak, Admin belum mengerti pertanyaannya 🙏 Silakan pilih opsi di bawah atau hubungi kami langsung jika mendesak ya!';
    }

    // LOGIKA UNTUK KURIR
    if (isCourier) {
      if (msg.includes('mana') || msg.includes('dimana') || msg.includes('posisi') || msg.includes('lokasi')) {
        return `Posisi saya sekarang di sekitaran Jl. Slamet Riyadi kak, ini lagi meluncur ke arah lokasi kakak. Tunggu sebentar ya!`;
      }
      if (msg.includes('menit') || msg.includes('lama') || msg.includes('jam') || msg.includes('kapan')) {
        return `Estimasi sekitar 5-10 menit lagi sampai kak kalau nggak macet. Saya kabari lagi kalau sudah di depan ya!`;
      }
      if (msg.includes('hati-hati') || msg.includes('oke') || msg.includes('siap') || msg.includes('sip')) {
        return `Siap kak, terima kasih ya! Saya usahakan secepatnya biar laundry kakak sampai dengan aman.`;
      }
      if (msg.includes('makasih') || msg.includes('terima kasih')) {
        return `Sama-sama kak! Senang bisa membantu. Saya lanjut jalan dulu ya 🛵`;
      }
      return `Halo kak, saya ${firstName} kurir laundry kakak. Ada yang bisa saya bantu terkait pengirimannya?`;
    }

    // LOGIKA UNTUK PETUGAS LAUNDRY (BUDI)
    if (msg.includes('kapan') || msg.includes('lama') || msg.includes('selesai') || msg.includes('beres') || msg.includes('dicuci') || msg.includes('proses')) {
      return 'Cucian kakak sedang kita amankan dan pastikan beres dalam 1x24 jam ya! Kalo butuh kilat, kabari aja biar kita gaspol! 🚀';
    }
    if (msg.includes('makasih') || msg.includes('terima kasih') || msg.includes('thanks') || msg.includes('matur nuwun')) {
      return `Sama-sama kak! Urusan pakaian kotor biar ${firstName} yang handle sampai tuntas dan wangi ya! Kalo butuh jemput kurir lagi tinggal chat aja 😉`;
    }
    if (msg.includes('harga') || msg.includes('biaya') || msg.includes('berapa')) {
      return 'Untuk harganya super santuy kok kak, mulai dari Rp 10.000/kilo aja. Makin berat timbangannya, makin murah jatuhnya! 💸';
    }
    if (msg.includes('halo') || msg.includes('hai') || msg.includes('pagi') || msg.includes('siang') || msg.includes('malam')) {
      return `Halo kak! ${firstName} sebagai petugas laundry di sini siap tangani cucian kotor kakak hari ini. 😊`;
    }
    return `Duh maaf kak, ${firstName} cuma staf laundry biasa nih, jadi cuma ngerti soal nyabun, setrika sama pakaian kotor hehe 😅`;
  };

  const simulateReply = (userText) => {
    setTimeout(() => {
      const botMsg = {
        id: String(Date.now() + 1),
        type: 'received',
        text: generateBotResponse(userText),
        time: new Date().toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' }),
      };
      updateGlobalHistory(botMsg);
    }, 1500);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const sentMsg = message.trim();
    
    const newMsg = {
      id: String(Date.now()),
      type: 'sent',
      text: sentMsg,
      time: new Date().toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' }),
    };

    updateGlobalHistory(newMsg);
    setMessage('');
    simulateReply(sentMsg);
  };

  const sendQuick = (text) => {
    const newMsg = {
      id: String(Date.now()),
      type: 'sent',
      text,
      time: new Date().toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' }),
    };

    updateGlobalHistory(newMsg);
    simulateReply(text);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Image source={{ uri: person.avatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>{person.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.onlineDot, !person.online && { backgroundColor: Colors.textSecondary }]} />
                <Text style={[styles.onlineText, !person.online && { color: Colors.textSecondary }]}>
                  {person.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="call-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ChatUnreadReset person={person} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          style={styles.messagesArea}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.dateLabel}>Hari ini</Text>
          {messages.map((msg) => (
            <View key={msg.id}>
              <Text
                style={[
                  styles.timeLabel,
                  msg.type === 'sent' && { textAlign: 'right' },
                ]}
              >
                {msg.time}
              </Text>
              <View
                style={[
                  styles.bubble,
                  msg.type === 'sent' ? styles.bubbleSent : styles.bubbleReceived,
                ]}
              >
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick replies */}
        <View style={styles.quickReplies}>
          {activeQuickReplies.map((r) => (
            <TouchableOpacity key={r} style={styles.quickChip} onPress={() => sendQuick(r)}>
              <Text style={styles.quickChipText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusBtn}>
            <Ionicons name="add" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan di sini..."
            placeholderTextColor={Colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="arrow-up" size={20} color={Colors.accentText || "#000"} />
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ChatUnreadReset({ person }) {
  useEffect(() => {
    if (person) {
      person.unread = 0;
    }
  }, [person]);
  return null;
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19 },
  headerName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  onlineText: { color: '#4CAF50', fontSize: 12 },
  messagesArea: { flex: 1, paddingHorizontal: 16 },
  dateLabel: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  timeLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 5,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 2,
  },
  bubbleReceived: {
    backgroundColor: Colors.card,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleSent: {
    backgroundColor: Colors.card,
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: { color: Colors.textPrimary, fontSize: 14, lineHeight: 21 },
  quickReplies: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  quickChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
    gap: 10,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});

