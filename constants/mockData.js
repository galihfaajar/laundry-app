export const services = [
  { id: '1', name: 'Pengeringan', iconName: 'thermometer-outline', time: '35 mnt', price: 'Rp 8.000', priceNum: 8000, unit: '/kilo', desc: 'Pengeringan suhu optimal untuk pakaian bebas bau, kusut, dan bakteri.' },
  { id: '2', name: 'Pemutih', iconName: 'shirt-outline', time: '25 mnt', price: 'Rp 12.000', priceNum: 12000, unit: '/potong', desc: 'Layanan spesifik pencuci serat noda membandel khusus pakaian putih kesayangan Anda.' },
  { id: '3', name: 'Cuci', iconName: 'water-outline', time: '45 mnt', price: 'Rp 10.000', priceNum: 10000, unit: '/kilo', desc: 'Pencucian kilat ekstra bersih untuk pakaian harian dengan deterjen wangi antibakteri.' },
  { id: '4', name: 'Setrika', iconName: 'flash-outline', time: '20 mnt', price: 'Rp 7.000', priceNum: 7000, unit: '/kilo', desc: 'Setrika uap premium yang memastikan baju Anda halus licin dan terhindar dari kuman.' },
  { id: '5', name: 'Lipat', iconName: 'layers-outline', time: '15 mnt', price: 'Rp 5.000', priceNum: 5000, unit: '/kilo', desc: 'Layanan pelipatan pakaian dengan presisi rapi siap dilelehkan lurus ke dalam lemari.' },
];

export const recentLaundry = [
  {
    id: '1',
    businessName: 'Kinclong Laundry',
    date: 'Hari ini, 25 Jun',
    status: 'Dicuci',
    eta: '1j 30m',
    startTime: '05:30',
    endTime: '06:30',
    nextStatus: 'Pengiriman',
    selectedServices: ['Cuci', 'Setrika', 'Pengeringan'],
    totalPriceNum: 27000,
    person: {
      name: 'Budi Santoso',
      role: 'Petugas Laundry',
      avatar: 'https://i.pravatar.cc/80?img=8',
    },
  },
  {
    id: '2',
    businessName: 'Bersih Kilat Co.',
    date: '28 Jun, 2026',
    status: 'Selesai',
    eta: null,
    startTime: null,
    endTime: null,
    nextStatus: null,
    selectedServices: ['Cuci'],
    totalPriceNum: 10000,
    person: null,
  },
];

export const laundryItems = [
  {
    id: '1',
    serviceName: 'Kinclong Laundry',
    category: 'Pakaian Campuran',
    description: 'Praktis dan cepat langsung di lokasi Anda.',
    price: 'Rp 35.500',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200&q=80',
  },
  {
    id: '2',
    serviceName: 'Kinclong Laundry',
    category: 'Pakaian Campuran',
    description: 'Praktis dan cepat langsung di lokasi Anda.',
    price: 'Rp 35.500',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&q=80',
  },
];

// Pindahkan ke dalam conversations individual

export const notifications = [
  {
    id: '1',
    group: '2 jam yang lalu',
    items: [
      {
        id: '1a',
        text: 'Pakaian Anda telah diambil dari lokasi Anda.',
        time: '2 jam yang lalu',
        icon: 'shirt-outline',
      },
    ],
  },
  {
    id: '2',
    group: '3 jam yang lalu',
    items: [
      {
        id: '2a',
        text: "Kabar gembira! Anda mendapatkan kupon diskon laundry sebesar Rp 15.000.",
        time: '3 jam yang lalu',
        icon: 'gift-outline',
      },
    ],
  },
  {
    id: '3',
    group: '6 jam yang lalu',
    items: [
      {
        id: '3a',
        text: "Pakaian bersih makin hemat. Kupon Rp 15.000 telah masuk ke akun Anda—jangan sampai kelewatan!",
        time: '6 jam yang lalu',
        icon: 'pricetag-outline',
      },
    ],
  },
  {
    id: '4',
    group: 'Kemarin',
    items: [
      {
        id: '4a',
        text: "Kabar gembira! Anda mendapatkan kupon diskon sebesar Rp 15.000.",
        time: '24/01/26',
        icon: 'gift-outline',
      },
      {
        id: '4b',
        text: 'Pakaian Anda baru saja diambil dari lokasi Anda.',
        time: '24/01/26',
        icon: 'shirt-outline',
      },
    ],
  },
];

export const orderHistory = [
  {
    id: '1',
    businessName: 'Kinclong Laundry',
    date: 'Hari ini, 25 Jun 2026',
    status: 'Diproses',
    items: 3,
    price: 'Rp 65.500',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200&q=80',
  },
  {
    id: '2',
    businessName: 'Bersih Kilat Laundry',
    date: '20 Jun 2026',
    status: 'Selesai',
    items: 2,
    price: 'Rp 28.000',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&q=80',
  },
  {
    id: '3',
    businessName: 'Wangi Terus Laundry',
    date: '15 Jun 2026',
    status: 'Selesai',
    items: 5,
    price: 'Rp 52.300',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&q=80',
  },
];

export const conversations = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Petugas Laundry',
    lastMessage: 'Halo kak, pesanan Anda sudah diterima. Saat ini sedang saya proses...',
    time: '15:46',
    unread: 1,
    avatar: 'https://i.pravatar.cc/80?img=8',
    online: true,
    messages: [
      {
        id: '1',
        type: 'received',
        text: "Halo kak, pesanan Anda sudah diterima. Saat ini sedang saya proses pencuciannya dengan estimasi selesai kurang lebih besok pagi ya kak.",
        time: '15:45',
      }
    ],
  },
  {
    id: '2',
    name: 'Ratna Sari',
    role: 'Staf Laundry',
    lastMessage: 'Pesanan Anda sudah masuk dan sedang kami kerjakan segera.',
    time: '09:30',
    unread: 0,
    avatar: 'https://i.pravatar.cc/80?img=15',
    online: false,
    messages: [],
  },
  {
    id: '3',
    name: 'Ahmad Syahputra',
    role: 'Kurir Pengiriman',
    lastMessage: 'Halo kak, saya sedang di jalan ya.',
    time: '12:00',
    unread: 0,
    avatar: 'https://i.pravatar.cc/80?img=11',
    online: true,
    messages: [],
  },
  {
    id: '4',
    name: 'Admin Laundry',
    role: 'Admin Laundry',
    lastMessage: 'Halo! Ada yang bisa kami bantu? 😊',
    time: '',
    unread: 1,
    avatar: 'https://i.pravatar.cc/80?img=32',
    online: true,
    messages: [
      {
        id: 'admin-1',
        type: 'received',
        text: 'Halo Kak! Selamat datang di Kinclong Laundry 👋\nAda yang bisa kami bantu? Gunakan tombol cepat di bawah atau ketik pertanyaan Anda.',
        time: 'Sekarang',
      },
    ],
  },
];

// ─── Daftar metode pembayaran ────────────────────────────────────────────────
export const paymentOptions = [
  { id: '1', name: 'Dompet Digital',       icon: 'wallet-outline',     desc: 'OVO, GoPay, Dana, dll' },
  { id: '2', name: 'QRIS',                 icon: 'qr-code-outline',    desc: 'Scan & bayar semua QR' },
  { id: '3', name: 'Kartu Kredit / Debit', icon: 'card-outline',       desc: 'Visa, Mastercard, dll' },
  { id: '4', name: 'Transfer Bank',        icon: 'cash-outline',       desc: 'BCA, BRI, Mandiri, dll' },
  { id: '5', name: 'Bayar di Tempat',      icon: 'storefront-outline', desc: 'Tunai saat pengambilan' },
];

// ─── Preferensi user (singleton — persists selama sesi app) ──────────────────
export const userPreferences = {
  paymentMethodId: '1',   // default: Dompet Digital
};

// ─── Pub/Sub sederhana — dipakai untuk reaktivitas antar halaman ──────────────
const _subscribers = new Set();

export function subscribeToOrders(callback) {
  _subscribers.add(callback);
  return () => _subscribers.delete(callback); // return unsubscribe fn
}

function _notify() {
  _subscribers.forEach((cb) => cb());
}

// ─── Status progression (alur realistis 5 langkah) ──────────────────────────
const STATUS_STEPS = [
  { status: 'Menunggu Penjemputan', eta: '5 menit',  nextStatus: 'Item Diterima'           },
  { status: 'Item Diterima',        eta: '3 menit',  nextStatus: 'Ditimbang & Dikonfirmasi' },
  { status: 'Ditimbang & Dikonfirmasi', eta: '2 menit', nextStatus: 'Sedang Dicuci'        },
  { status: 'Sedang Dicuci',        eta: '8 menit',  nextStatus: 'Selesai'                 },
  { status: 'Selesai',              eta: null,        nextStatus: null                      },
];

/**
 * Mulai simulasi pesanan baru.
 * Alur: Menunggu Penjemputan → Item Diterima → Ditimbang & Dikonfirmasi → Sedang Dicuci → Selesai
 * @returns {string} orderId — ID pesanan baru, untuk diteruskan ke halaman track-order
 */
export function startOrderSimulation(orderData, onDone) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const newOrderId = 'sim-' + Date.now();
  const estimatedWeight = orderData.amount || 2;
  const pricePerUnit = orderData.pricePerUnit || 8000;

  // Simulasikan berat real: antara -0.5 hingga +1 kg dari estimasi
  const weightOffset = (Math.random() * 1.5 - 0.5).toFixed(1);
  const realWeight = Math.max(0.5, parseFloat((estimatedWeight + parseFloat(weightOffset)).toFixed(1)));
  const finalPrice = Math.round(realWeight * pricePerUnit + (orderData.expressFee || 0) + (orderData.deliveryFee || 0));
  const fmtRp = (n) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;

  // Tambahkan pesanan baru ke orderHistory
  const newOrderHistoryEntry = {
    id: newOrderId,
    businessName: 'Kinclong Laundry',
    date: 'Baru Saja',
    status: STATUS_STEPS[0].status,
    items: estimatedWeight,
    price: orderData.price || 'Rp 0',
    finalPrice: null,   // diisi saat step Ditimbang
    realWeight: null,   // diisi saat step Ditimbang
    paid: false,        // diisi saat customer bayar di track-order
    paymentMethod: null,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&q=80',
    // Data asli untuk struk:
    deliveryFee: orderData.deliveryFee || 0,
    expressFee: orderData.expressFee || 0,
    isExpress: orderData.expressFee > 0,
    isPickup: orderData.deliveryFee > 0,
    unit: orderData.unit || '/kilo',
    pricePerUnit: orderData.pricePerUnit || 8000,
    pickupAddress: orderData.pickupAddress || '',
  };
  orderHistory.unshift(newOrderHistoryEntry);
  _notify();

  // Step 1: Menunggu Penjemputan → Item Diterima (4 detik)
  const t1 = setTimeout(() => {
    const entry = orderHistory.find((o) => o.id === newOrderId);
    if (entry) entry.status = STATUS_STEPS[1].status;
    _notify();

    // Step 2: Item Diterima → Ditimbang & Dikonfirmasi (5 detik)
    const t2 = setTimeout(() => {
      const entry2 = orderHistory.find((o) => o.id === newOrderId);
      if (entry2) {
        entry2.status = STATUS_STEPS[2].status;
        entry2.realWeight = realWeight;
        entry2.finalPrice = finalPrice;
      }

      // Push notifikasi konfirmasi penimbangan
      notifications.unshift({
        id: 'weigh-' + newOrderId,
        group: 'Baru Saja',
        items: [
          {
            id: 'weigh-item-' + newOrderId,
            text: `✅ Cucian Anda sudah ditimbang! Berat aktual: ${realWeight} kg.\nTotal tagihan final: ${fmtRp(finalPrice)}.`,
            time: 'Baru saja',
            icon: 'scale-outline',
          },
        ],
      });
      _notify();

      // Step 3: Ditimbang → Sedang Dicuci (5 detik)
      const t3 = setTimeout(() => {
        const entry3 = orderHistory.find((o) => o.id === newOrderId);
        if (entry3) entry3.status = STATUS_STEPS[3].status;
        _notify();

        // Step 4: Dicuci → Selesai (8 detik)
        const t4 = setTimeout(() => {
          const entry4 = orderHistory.find((o) => o.id === newOrderId);
          if (entry4) {
            entry4.status = STATUS_STEPS[4].status;
            entry4.date = `Hari ini, ${dateStr}`;
          }

          // Tambah ke recentLaundry sebagai item teratas
          recentLaundry.unshift({
            id: newOrderId,
            businessName: 'Kinclong Laundry',
            date: `Hari ini, ${dateStr}`,
            status: 'Selesai',
            eta: null,
            startTime: timeStr,
            endTime: timeStr,
            nextStatus: null,
            selectedServices: orderData.selectedServices || [orderData.serviceName],
            totalPriceNum: finalPrice,
            person: null,
          });

          _notify();
          if (onDone) onDone();
        }, 8000);
      }, 5000);
    }, 5000);
  }, 4000);

  return newOrderId; // ← caller dapat track status via orderHistory.find(o => o.id === orderId)
}

/**
 * Konfirmasi pembayaran setelah harga final diketahui.
 * @param {string} orderId
 * @param {string} paymentMethodId  – id dari paymentOptions
 * @returns {boolean} true jika berhasil
 */
export function confirmPayment(orderId, paymentMethodId) {
  const entry = orderHistory.find((o) => o.id === orderId);
  if (!entry) return false;
  const method = paymentOptions.find((p) => p.id === paymentMethodId);
  entry.paid          = true;
  entry.paymentMethod = method?.name || paymentMethodId;
  _notify(); // trigger semua subscriber (termasuk track-order.js)
  return true;
}
