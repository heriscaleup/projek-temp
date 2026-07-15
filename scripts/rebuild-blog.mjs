import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { editorialPlans } from './blog-editorial-plans.mjs';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const UPDATED_AT = '2026-07-15';
const WHATSAPP_URL =
  'https://wa.me/6282124985339?text=Halo%20Raja%20Freeze%20Dried%20Food%2C%20saya%20ingin%20konsultasi%20setelah%20membaca%20blog';

const SOURCES = {
  science: {
    label: 'Review ilmiah tentang karakteristik dan tahapan freeze drying pada pangan',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7603155/',
  },
  plantScience: {
    label: 'Review freeze drying pada pangan berbasis tanaman dan pengaruhnya terhadap mutu',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7022747/',
  },
  waterActivity: {
    label: 'FDA: water activity pada pangan dan kaitannya dengan pertumbuhan mikroorganisme',
    url: 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-technical-guides/water-activity-aw-foods',
  },
  lowMoistureSafety: {
    label: 'FDA: sanitasi untuk pangan siap makan berkadar air rendah',
    url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/draft-guidance-industry-establishing-sanitation-programs-low-moisture-ready-eat-human-foods-and',
  },
  whoComplementaryFeeding: {
    label: 'WHO: panduan pemberian makanan pendamping untuk anak usia 6–23 bulan',
    url: 'https://www.who.int/publications/i/item/9789240081864',
  },
  bpomClaims: {
    label: 'BPOM: ketentuan klaim pada label dan iklan pangan olahan',
    url: 'https://jdih.pom.go.id/download/rule/1341/1/2022/Peraturan%20Badan%20Pengawas%20Obat%20dan%20Makanan%20Nomor%201%20Tahun%202022%20tentang%20Pengawasan%20Klaim%20pada%20Label%20dan%20Iklan%20Pangan%20Olahan',
  },
  bpomNutrition: {
    label: 'BPOM: informasi nilai gizi pada label pangan olahan',
    url: 'https://jdih.pom.go.id/download/rule/1758/10/2026/Peraturan%20Badan%20Pengawas%20Obat%20dan%20Makanan%20Nomor%2010%20Tahun%202026%20tentang%20Informasi%20Nilai%20Gizi%20pada%20Label%20Pangan%20Olahan',
  },
};

const TEMPLATE_COPY = {
  business: {
    contextTitle: 'Mulai dari keputusan bisnis, bukan dari mesin',
    context: (plan) =>
      `Produk freeze dried memiliki biaya proses, susut bobot, kebutuhan kemasan, dan risiko bahan baku yang berbeda dari snack biasa. Karena itu, ${plan.keyword} perlu dinilai dari permintaan yang benar-benar teruji, yield per batch, biaya energi, serta harga jual yang sanggup diterima pasar. Angka omzet tanpa data repeat order tidak cukup untuk menjadi dasar investasi.`,
    pitfallTitle: 'Kesalahan yang paling mahal',
    pitfall:
      'Kesalahan umum adalah membeli kapasitas terlalu besar sebelum spesifikasi produk stabil. Uji bahan, ukuran potong, profil proses, kemasan, dan penerimaan konsumen dalam batch kecil terlebih dahulu. Setelah hasilnya konsisten, barulah keputusan maklon, sewa kapasitas, atau membeli mesin dapat dibandingkan secara rasional.',
    sources: ['science', 'bpomClaims', 'bpomNutrition'],
  },
  mpasi: {
    contextTitle: 'Freeze dried bukan otomatis aman untuk bayi',
    context: (plan) =>
      `Metode pengeringan tidak menggantikan penilaian usia, tekstur, ukuran partikel, alergen, kebersihan, dan komposisi produk. Dalam konteks ${plan.keyword}, bahan perlu disajikan sesuai kemampuan makan anak dan menjadi bagian dari menu beragam—bukan satu-satunya sumber gizi. Produk utuh yang renyah untuk orang dewasa dapat tetap berisiko tersedak bagi bayi.`,
    pitfallTitle: 'Kapan perlu meminta saran tenaga kesehatan',
    pitfall:
      'Diskusikan dengan dokter anak atau dietisien bila anak lahir prematur, memiliki gangguan menelan, alergi, kondisi medis tertentu, atau pertumbuhan yang perlu dipantau. Artikel ini memberi kerangka umum dan tidak menggantikan penilaian individual.',
    sources: ['whoComplementaryFeeding', 'bpomClaims', 'bpomNutrition'],
  },
  storage: {
    contextTitle: 'Renyah saja belum membuktikan produk aman',
    context: (plan) =>
      `Kualitas ${plan.keyword} dipengaruhi kadar air, water activity, oksigen, suhu, cahaya, dan integritas seal. Produk dapat terasa kering tetapi tetap mengalami penurunan mutu bila kemasan berbarier rendah atau sering dibuka. Masa simpan harus mengikuti data produsen atau pengujian produk, bukan angka generik dari internet.`,
    pitfallTitle: 'Musuh utama setelah kemasan dibuka',
    pitfall:
      'Udara lembap cepat mengubah tekstur porous menjadi liat. Ambil porsi dengan alat kering, tutup kembali secepatnya, dan jangan mengandalkan desikan untuk menyelamatkan produk yang sudah basah, berbau asing, berubah warna tidak wajar, atau berjamur.',
    sources: ['waterActivity', 'lowMoistureSafety'],
  },
  outdoor: {
    contextTitle: 'Ringan tidak selalu berarti lengkap',
    context: (plan) =>
      `Keunggulan ${plan.keyword} adalah bobot yang ringan dan mudah dibagi per porsi. Namun kebutuhan perjalanan tetap harus dihitung dari durasi, intensitas aktivitas, akses air, dan menu utama. Buah freeze dried cocok sebagai snack atau komponen menu, bukan otomatis pengganti karbohidrat, protein, lemak, dan elektrolit.`,
    pitfallTitle: 'Jangan lupakan air dan sampah kemasan',
    pitfall:
      'Bawa air minum yang cukup, terutama saat mengonsumsi pangan sangat kering. Pisahkan porsi sebelum berangkat, lindungi kemasan dari tusukan, dan bawa kembali semua sampah. Untuk produk yang harus direhidrasi, hitung air tambahan di luar kebutuhan minum.',
    sources: ['waterActivity', 'science'],
  },
  comparison: {
    contextTitle: 'Bandingkan hasil, bukan hanya nama proses',
    context: (plan) =>
      `Perbedaan ${plan.keyword} muncul dari suhu, tekanan, waktu proses, pretreatment, dan kadar air akhir. Freeze drying umumnya menghasilkan struktur lebih porous dan rehidrasi lebih cepat, sedangkan pengeringan dengan panas dapat memberi tekstur lebih kenyal serta biaya lebih rendah. Tidak ada metode yang selalu menang untuk setiap produk.`,
    pitfallTitle: 'Klaim persentase tunggal sering menyesatkan',
    pitfall:
      'Retensi vitamin dan umur simpan berbeda menurut bahan, ketebalan potong, oksigen, cahaya, serta kondisi penyimpanan. Hindari persentase retensi atau umur simpan spesifik bila tidak berasal dari pengujian produk serta kemasan yang sama.',
    sources: ['science', 'plantScience', 'waterActivity'],
  },
  diet: {
    contextTitle: 'Nilai produk berdasarkan porsi yang benar-benar dimakan',
    context: (plan) =>
      `Air yang hilang membuat buah freeze dried sangat ringan, sehingga satu genggam dapat mewakili buah segar dalam jumlah lebih besar. Saat menilai ${plan.keyword}, bandingkan energi, karbohidrat, gula total, gula tambahan, serat, dan ukuran saji pada label. Istilah “alami” atau “tanpa pengawet” tidak otomatis membuat porsinya bebas batas.`,
    pitfallTitle: 'Posisikan sebagai pelengkap, bukan jalan pintas',
    pitfall:
      'Buah segar tetap memberi air, volume, dan pengalaman makan yang berbeda. Freeze dried berguna ketika kepraktisan dibutuhkan, tetapi pola makan seimbang tetap bergantung pada keseluruhan menu. Untuk kondisi medis atau target gizi khusus, gunakan saran tenaga kesehatan.',
    sources: ['bpomNutrition', 'bpomClaims', 'plantScience'],
  },
  quality: {
    contextTitle: 'Mutu dibangun sebelum mesin dinyalakan',
    context: (plan) =>
      `Hasil ${plan.keyword} ditentukan sejak pemilihan kematangan bahan, sortasi, pencucian, ukuran potong, pembekuan, pengeringan primer, pengeringan sekunder, hingga pengemasan. Mesin yang baik tidak dapat memperbaiki bahan rusak atau proses higienitas yang lemah. Setiap batch perlu kriteria penerimaan yang terukur.`,
    pitfallTitle: 'Parameter yang perlu dicatat per batch',
    pitfall:
      'Catat identitas bahan, berat masuk dan keluar, profil waktu-suhu-tekanan, hasil inspeksi visual, water activity atau parameter mutu yang tervalidasi, serta hasil pengecekan seal. Catatan ini penting untuk investigasi keluhan dan perbaikan proses.',
    sources: ['science', 'waterActivity', 'lowMoistureSafety'],
  },
  technology: {
    contextTitle: 'Tiga tahap yang membentuk hasil akhir',
    context: (plan) =>
      `Pada ${plan.keyword}, bahan dibekukan, tekanan ruang diturunkan, lalu es dikeluarkan terutama melalui sublimasi. Setelah sebagian besar es hilang, pengeringan sekunder membantu menurunkan kelembapan yang masih terikat. Profil proses harus disesuaikan dengan komposisi, ukuran, dan struktur bahan.`,
    pitfallTitle: 'Lebih dingin atau lebih lama belum tentu lebih baik',
    pitfall:
      'Siklus yang terlalu konservatif dapat meningkatkan energi dan waktu tanpa manfaat sebanding, sedangkan siklus terlalu agresif dapat merusak struktur. Optimasi memerlukan pengukuran produk, bukan sekadar menyalin resep bahan lain.',
    sources: ['science', 'plantScience'],
  },
  fruit: {
    contextTitle: 'Mulai dari rasa, tekstur, dan cara pakai',
    context: (plan) =>
      `Pilihan ${plan.keyword} sebaiknya tidak berhenti pada daftar “paling enak”. Varietas, kematangan, ketebalan potong, dan kadar gula alami memengaruhi rasa serta kerenyahan. Buah yang nikmat dimakan langsung belum tentu paling cocok sebagai topping, bubuk minuman, atau bahan pastry.`,
    pitfallTitle: 'Cara mencicipi dengan lebih objektif',
    pitfall:
      'Bandingkan sampel pada suhu ruang, gunakan porsi kecil, dan catat aroma, intensitas rasa, tingkat asam, ukuran pori, sisa serat, serta aftertaste. Cek juga komposisi untuk membedakan karakter buah dari pengaruh gula, minyak, atau perisa tambahan.',
    sources: ['plantScience', 'bpomNutrition'],
  },
  lifestyle: {
    contextTitle: 'Kepraktisan perlu diikuti kebiasaan yang masuk akal',
    context: (plan) =>
      `${plan.keyword} mudah disimpan dan dibawa, tetapi kemudahan itu juga membuat porsi cepat bertambah tanpa terasa. Gunakan wadah porsi, pasangkan dengan menu yang lebih lengkap, dan pilih produk berdasarkan daftar bahan serta informasi nilai gizi—bukan sekadar warna kemasan atau klaim pemasaran.`,
    pitfallTitle: 'Hindari efek “healthy halo”',
    pitfall:
      'Camilan yang dipersepsikan sehat sering dimakan tanpa memperhatikan jumlahnya. Tuangkan porsi ke mangkuk kecil alih-alih makan langsung dari kemasan, lalu evaluasi rasa kenyang dan kebutuhan aktivitas hari itu.',
    sources: ['bpomNutrition', 'bpomClaims'],
  },
  supply: {
    contextTitle: 'Nilai tambah harus menutup biaya proses',
    context: (plan) =>
      `Dalam ${plan.keyword}, freeze drying berpotensi mengurangi bobot logistik dan memperpanjang jendela pemanfaatan bahan. Namun prosesnya membutuhkan energi, waktu, kemasan berbarier, dan kontrol mutu. Teknologi ini paling masuk akal untuk bahan bernilai tinggi, sensitif panas, atau membutuhkan rehidrasi dan struktur tertentu.`,
    pitfallTitle: 'Jangan memindahkan masalah ke tahap lain',
    pitfall:
      'Umur simpan yang lebih panjang tidak otomatis menyelesaikan pasokan bahan tidak konsisten, sanitasi buruk, kemasan lemah, atau distribusi tanpa kontrol. Analisis harus mencakup rantai dari panen hingga konsumen.',
    sources: ['science', 'waterActivity', 'lowMoistureSafety'],
  },
  culinary: {
    contextTitle: 'Gunakan karakter porous sebagai alat kreatif',
    context: (plan) =>
      `${plan.keyword} dapat memberi tekstur renyah, aroma pekat, warna alami, atau kemampuan menyerap cairan dengan cepat. Bentuk potongan, remah, dan bubuk mempunyai perilaku berbeda. Uji dalam porsi kecil agar garnish tidak mendominasi rasa atau cepat melempem sebelum disajikan.`,
    pitfallTitle: 'Perhatikan waktu kontak dengan kelembapan',
    pitfall:
      'Komponen freeze dried sebaiknya ditambahkan mendekati waktu penyajian bila tujuannya mempertahankan kerenyahan. Untuk aplikasi rehidrasi, tentukan rasio cairan dan waktu diam berdasarkan hasil uji, bukan asumsi.',
    sources: ['science', 'plantScience'],
  },
};

function truncate(value, max = 156) {
  if (value.length <= max) return value;
  const clipped = value.slice(0, max - 1);
  const clean = clipped
    .slice(0, clipped.lastIndexOf(' '))
    .replace(/[.,;:!?]+$/, '');
  return `${clean}…`;
}

const SEO_TITLE_OVERRIDES = {
  'bisnis-freeze-dried-panduan-memulai-2026-07':
    'Bisnis Freeze Dried 2026: Validasi hingga Produk Pertama',
  'bisnis-freeze-dried-peluang-usaha-2026-05':
    'Peluang Bisnis Freeze Dried: Uji Pasar Sebelum Beli Mesin',
  'bisnis-freeze-dried-peluang-usaha-2026-07':
    'Go-to-Market Freeze Dried: Reseller atau Private Label?',
  'buah-freeze-dried-camilan-nutrisi-2025-09':
    'Camilan Freeze Dried: Porsi untuk Profesional Sibuk',
  'freeze-dried-food-digital-market-2025-10':
    'Strategi Omnichannel Freeze Dried untuk Repeat Order',
  'freeze-dried-food-profesional-aktif-2024-10':
    'Freeze Dried untuk Traveler: Snack atau Bekal Darurat?',
  'freeze-dried-mpasi-bayi-aman-tidak-2026-06':
    'Freeze Dried untuk Bayi: Cek Bahan dan Gula Tambahan',
  'freeze-dried-revolusi-diabetes-2025-10':
    'Freeze Dried dan Diabetes: Cek Karbohidrat per Sajian',
  'freeze-dried-vs-kering-biasa-2026-06':
    'Nutrisi Freeze Dried vs Kering Biasa: Apa Bedanya?',
  'freeze-dried-vs-kering-biasa-perbandingan-2026-07':
    'Freeze Dried vs Kering Biasa: Panduan Sesuai Anggaran',
  'freeze-drying-buah-artisanal-2025-09':
    'Hampers Freeze Dried: Varian, Kemasan, dan Masa Simpan',
  'freeze-drying-inovasi-raja-2025-09':
    'Proses Inovasi Freeze Dried: Dari Uji Bahan ke Batch',
  'freeze-drying-keajaiban-kuliner-2025-10':
    'Freeze Dried untuk Pastry: Garnish, Bubuk, dan Tekstur',
  'makanan-kering-beku-keluarga-2024-02':
    'Bekal Freeze Dried untuk Liburan Keluarga',
  'makanan-kering-beku-olahraga-2024-02':
    'Camilan Freeze Dried untuk Olahraga: Peran dan Batasnya',
  'makanan-kering-beku-rumah-tangga-2024-02':
    'Freeze Dried di Dapur: Stok, Topping, dan Rehidrasi',
  'manfaat-freeze-dried-raja-brand-2025-10':
    'Memilih Mitra Freeze Dried: 12 Pertanyaan Penting',
  'manfaat-teknologi-freeze-drying-2025-10':
    'Freeze Drying untuk Industri: Mutu, Logistik, dan Biaya',
  'panduan-blog-freeze-dried-2025-08':
    'Panduan Freeze Dried: Teknologi, Keamanan, dan Bisnis',
  'perbandingan-freeze-dried-vs-kering-biasa-2026-07':
    'Harga Freeze Dried vs Buah Kering: Apa yang Dibayar?',
  'rahasia-makanan-sehat-freeze-drying-2025-10':
    'Cara Memilih Camilan Freeze Dried yang Masuk Akal',
  'rahasia-makanan-sehat-teknologi-2025-09':
    'Freeze Drying untuk Produk Sehat: Proses Bukan Klaim',
  'rahasia-nutrisi-maksimal-freeze-drying-2025-09':
    'Menjaga Mutu Gizi Freeze Dried: Bahan hingga Kemasan',
  'rahasia-nutrisi-optimal-freeze-drying-2025-09':
    'Mengukur Kualitas Freeze Dried di Luar Tekstur Renyah',
  'raja-freeze-dried-inovasi-2025-10':
    'Ide Produk Freeze Dried: Powder, Inclusion, dan Rehidrasi',
  'raja-freeze-dried-revolusi-2025-09':
    'Freeze Dried Food Indonesia: Peluang Tanpa Janji Berlebih',
  'raja-freeze-dried-teknologi-2025-10':
    'Spesifikasi Freeze Dryer yang Perlu Ditanya ke Produsen',
  'rekomendasi-buah-freeze-dried-terenak-2026-06':
    'Mangga vs Stroberi vs Pisang Freeze Dried: Pilih Mana?',
  'teknologi-freeze-drying-masa-depan-2025-09':
    'Masa Depan Freeze Drying: Energi, Sensor, dan Skala',
  'teknologi-freeze-drying-solusi-2025-10':
    'Kapan Freeze Drying Tepat dan Kapan Tidak?',
  'tren-freeze-dried-food-indonesia-2026-06':
    'Tren Freeze Dried Indonesia 2026: Produk dan Kanal',
};

function createSeoTitle(plan) {
  return SEO_TITLE_OVERRIDES[plan.slug] ?? plan.title;
}

function asInlineInstruction(value) {
  const clean = value.replace(/[.!?]+$/, '').trim();
  return clean ? `${clean[0].toLowerCase()}${clean.slice(1)}` : clean;
}

function buildRelated(plan, allPlans) {
  const preferredTemplates = {
    business: ['quality', 'technology'],
    mpasi: ['quality', 'storage'],
    storage: ['quality', 'fruit'],
    outdoor: ['storage', 'lifestyle'],
    comparison: ['technology', 'quality'],
    diet: ['fruit', 'lifestyle'],
    quality: ['technology', 'storage'],
    technology: ['quality', 'supply'],
    fruit: ['storage', 'diet'],
    lifestyle: ['fruit', 'diet'],
    supply: ['business', 'quality'],
    culinary: ['fruit', 'quality'],
  }[plan.template] ?? ['quality', 'technology'];

  return preferredTemplates
    .map((template, index) => {
      const candidates = allPlans.filter(
        (candidate) => candidate.slug !== plan.slug && candidate.template === template,
      );
      return candidates[(plan.index + index) % candidates.length];
    })
    .filter(Boolean);
}

const STEP_GUIDANCE = [
  (plan, check) =>
    `${check} Jadikan hasilnya sebagai bukti sebelum melanjutkan keputusan berikutnya. Untuk ${plan.detailTitle.toLowerCase()}, simpan angka, foto, label, atau catatan batch yang relevan agar penilaian tidak hanya bergantung pada ingatan.`,
  (plan, check) =>
    `${check} Tetapkan kondisi yang dianggap lulus dan tidak lulus sebelum pengujian dimulai. Cara ini membuat evaluasi ${plan.keyword} lebih konsisten ketika ada beberapa produk, pemasok, porsi, atau batch yang harus dibandingkan.`,
  (plan, check) =>
    `${check} Kerjakan lebih dulu pada skala yang risikonya kecil, kemudian amati perubahan setelah produk dipakai pada situasi sebenarnya. Bila hasil berbeda dari target, ubah satu variabel saja supaya penyebabnya masih dapat ditelusuri.`,
  (plan, check) =>
    `${check} Tulis keputusan dan alasannya, termasuk informasi yang belum tersedia. Dokumentasi singkat membantu membedakan asumsi dari fakta dan memudahkan evaluasi ulang ketika harga, bahan, rute, kebutuhan pengguna, atau spesifikasi berubah.`,
  (plan, check) =>
    `${check} Gunakan pembanding yang setara agar hasilnya tidak bias. Pada ${plan.keyword}, perbedaan berat, ukuran saji, ketebalan bahan, kondisi simpan, atau aplikasi akhir dapat menghasilkan kesimpulan yang tampak bertentangan.`,
  (plan, check) =>
    `${check} Minta orang lain memeriksa hasil bila keputusan menyangkut keamanan, klaim, atau biaya besar. Pemeriksaan kedua sering menemukan data yang terlewat dan membantu menjaga bahasa komunikasi tetap sebanding dengan bukti yang tersedia.`,
  (plan, check) =>
    `${check} Hubungkan langkah ini dengan hasil yang dapat diamati, bukan istilah pemasaran. Indikator sederhana yang dipakai secara rutin biasanya lebih berguna daripada banyak parameter yang dicatat sekali lalu tidak pernah ditinjau.`,
  (plan, check) =>
    `${check} Beri tanggal pada catatan dan tentukan kapan hasil harus ditinjau ulang. Informasi tentang ${plan.keyword} dapat berubah setelah kemasan dibuka, skala diperbesar, resep diganti, atau produk melewati distribusi.`,
];

function buildActionSteps(plan) {
  return plan.checks.flatMap((check, stepIndex) => {
    const title = check.replace(/[.!?]+$/, '');
    const guidance = STEP_GUIDANCE[(plan.index * 3 + stepIndex) % STEP_GUIDANCE.length](plan, check);
    return [`### ${stepIndex + 1}. ${title}`, '', guidance, ''];
  });
}

function buildDecisionTable(plan) {
  return [
    '| Bagian keputusan | Yang perlu dibuktikan |',
    '| --- | --- |',
    `| Tujuan | ${plan.detailTitle} |`,
    `| Pemeriksaan awal | ${plan.checks[0]} |`,
    `| Uji atau pembanding | ${plan.checks[1]} |`,
    `| Batas risiko | ${plan.checks[2]} |`,
    `| Tindak lanjut | ${plan.checks[3]} |`,
  ];
}

function buildBody(plan, allPlans) {
  const template = TEMPLATE_COPY[plan.template];
  if (!template) throw new Error(`Template tidak dikenal: ${plan.template}`);

  const related = buildRelated(plan, allPlans);
  const sources = template.sources.map((key) => SOURCES[key]);
  const shortAnswer = plan.verdict;

  return [
    `${plan.lead}`,
    '',
    `> **Jawaban singkat:** ${shortAnswer}`,
    '',
    `## ${template.contextTitle}`,
    '',
    template.context(plan),
    '',
    `## ${plan.detailTitle}`,
    '',
    plan.detail,
    '',
    '## Ringkasan kerangka keputusan',
    '',
    ...buildDecisionTable(plan),
    '',
    'Tabel ini bukan standar universal. Gunakan sebagai briefing awal, lalu sesuaikan parameter dengan bahan, pengguna, regulasi, fasilitas, serta tujuan produk yang sebenarnya.',
    '',
    '## Langkah penerapan',
    '',
    ...buildActionSteps(plan),
    `## ${template.pitfallTitle}`,
    '',
    template.pitfall,
    '',
    '## Checklist praktis',
    '',
    ...plan.checks.map((check) => `- ${check}`),
    '',
    '## Pertanyaan yang sering diajukan',
    '',
    `### ${plan.faqQuestion}`,
    '',
    plan.faqAnswer,
    '',
    `### Bagaimana memulai ${plan.detailTitle.toLowerCase()}?`,
    '',
    `Langkah awal yang disarankan: ${plan.checks[0]} Setelah itu, ${asInlineInstruction(plan.checks[1])} sebelum memakai hasilnya untuk keputusan yang lebih besar. Bila konteksnya menyangkut keamanan atau kondisi kesehatan, minta penilaian tenaga yang kompeten.`,
    '',
    '## Referensi dan bacaan lanjutan',
    '',
    ...sources.map((source) => `- [${source.label}](${source.url})`),
    '',
    '## Baca topik terkait',
    '',
    ...related.map((item) => `- [${item.title}](/blog/${item.slug})`),
    '',
    '## Ingin membahas kebutuhan produk?',
    '',
    `Setiap bahan dan target produk membutuhkan parameter yang berbeda. [Konsultasikan bahan, bentuk produk, volume, dan kebutuhan kemasan melalui WhatsApp](${WHATSAPP_URL}) agar pembahasannya dimulai dari spesifikasi yang jelas.`,
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

async function main() {
  const planBySlug = new Map(editorialPlans.map((plan, index) => [plan.slug, { ...plan, index }]));
  const entries = (await fs.readdir(BLOG_DIR)).filter((file) => file.endsWith('.md')).sort();

  if (entries.length !== editorialPlans.length) {
    throw new Error(`Jumlah artikel (${entries.length}) tidak sama dengan plan (${editorialPlans.length}).`);
  }

  for (const file of entries) {
    const filePath = path.join(BLOG_DIR, file);
    const slug = file.replace(/\.md$/, '');
    const plan = planBySlug.get(slug);
    if (!plan) throw new Error(`Plan tidak ditemukan untuk ${slug}`);

    const original = await fs.readFile(filePath, 'utf8');
    const parsed = matter(original);
    const excerpt = truncate(`${plan.verdict} ${plan.detail}`);
    const frontmatter = {
      title: plan.title,
      seoTitle: createSeoTitle(plan),
      date: parsed.data.date,
      updated: UPDATED_AT,
      excerpt,
      category: parsed.data.category,
      image: `/images/blog/${slug}.webp`,
      imageAlt: `Foto editorial tentang ${plan.keyword}`,
      slug,
      author: 'Tim Editorial Raja Freeze Dried Food',
      reviewer: plan.template === 'mpasi' || plan.template === 'diet' ? 'Tim Quality & Product' : 'Tim Produk Raja Freeze Dried Food',
      focusKeyword: plan.keyword,
      searchIntent: plan.intent,
      tags: [...new Set([plan.keyword, ...(plan.tags ?? []), 'freeze dried'])],
      published: true,
    };

    const body = buildBody(plan, editorialPlans);
    await fs.writeFile(filePath, matter.stringify(body, frontmatter), 'utf8');
  }

  console.log(`Rebuilt ${entries.length} blog articles.`);
}

await main();
