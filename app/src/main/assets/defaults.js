/* Isi bawaan DRONE Autofill (dipakai halaman Atur isi dan pengisi form). */
(function () {
var KATEGORI = ["Achievement – pencapaian penting", "Issue – isu yang perlu perhatian", "Improvement", "Priority Follow-up"];
var K_ACH = KATEGORI[0], K_ISS = KATEGORI[1], K_IMP = KATEGORI[2], K_PFU = KATEGORI[3];
var DEFAULT_CONTENT = {
  A: {
    1: {
      talk: "Topik: Fit to work di awal pekan. Pesan: pastikan istirahat cukup dan badan sehat sebelum bekerja, serta segera melapor ke atasan bila merasa tidak fit.",
      a: "Inspeksi K3 di area kantor dan ruang kerja Biro PEI: jalur evakuasi, APAR, kabel listrik dan stop kontak, serta housekeeping meja kerja. Ditemukan 2 temuan minor (kabel terjuntai dan APAR terhalang lemari) dan keduanya sudah ditindaklanjuti hari ini.",
      b: "Review SOP Pengelolaan Dokumen Proses Bisnis untuk memastikan alur revisi, persetujuan, dan distribusi dokumen sesuai ketentuan terbaru. Dicatat 3 poin yang perlu disesuaikan sebagai bahan usulan revisi.",
      cat: K_ISS,
      saran: "Masih ditemukan kabel terjuntai dan APAR yang terhalang di beberapa ruang kerja. Disarankan inspeksi housekeeping rutin setiap minggu dengan PIC per ruangan, serta dukungan Management untuk penegakan tindak lanjut hasil inspeksi."
    },
    2: {
      talk: "Topik: Ergonomi kerja di depan komputer. Pesan: posisikan monitor sejajar mata, duduk tegak dengan punggung tersangga, dan lakukan peregangan singkat setiap 1 jam.",
      a: "Pemutakhiran dashboard monitoring KPI produksi harian (ore feed, produksi FeNi, dan availability peralatan) serta koordinasi dengan unit produksi untuk validasi data.",
      b: "Target: dashboard KPI terupdate H-1 untuk 3 parameter utama. Realisasi: 3 dari 3 parameter terupdate (100%), 1 selisih data ditemukan dan sudah dikoreksi bersama unit terkait.",
      cat: K_ACH,
      saran: "Dashboard KPI produksi harian sudah terupdate H-1. Disarankan Management menggunakan dashboard ini sebagai bahan rapat pagi agar pembahasan kinerja lebih cepat dan berbasis data yang sama."
    },
    3: {
      talk: "Topik: Safety driving di area kerja. Pesan: patuhi batas kecepatan, selalu gunakan sabuk pengaman, jaga jarak aman, dan jangan menggunakan ponsel saat berkendara.",
      a: "Identifikasi pemborosan kertas dan tinta printer di lingkungan biro, serta mendorong penggunaan dokumen digital dan tanda tangan elektronik untuk dokumen internal.",
      b: "Pemakaian cetak dokumen internal turun sekitar 30% dibanding minggu sebelumnya (estimasi dari 200 menjadi 140 lembar), sehingga biaya kertas dan tinta berkurang.",
      cat: K_IMP,
      saran: "Disarankan penerapan persetujuan dokumen internal secara digital (e-approval) di seluruh biro agar penggunaan kertas berkurang dan proses persetujuan lebih mudah dilacak."
    },
    4: {
      talk: "Topik: Pemilahan sampah dan limbah. Pesan: pisahkan sampah organik, anorganik, dan limbah B3 sesuai wadahnya, serta jangan membuang limbah sembarangan.",
      a: "Pengecekan pemilahan sampah di area kantor dan pantry, serta sosialisasi singkat kepada rekan kerja tentang pemisahan sampah organik, anorganik, dan limbah B3 (baterai, toner bekas).",
      b: "Tempat sampah terpilah tersedia di 4 dari 5 titik yang dicek (80%). 1 titik belum memiliki wadah limbah B3 dan sudah diajukan penambahannya ke bagian GA.",
      cat: K_PFU,
      saran: "Perlu tindak lanjut penyediaan wadah khusus limbah B3 (baterai, toner, lampu bekas) di setiap gedung kantor agar tidak tercampur dengan sampah domestik."
    },
    5: {
      talk: "Topik: Pelaporan near miss. Pesan: setiap kejadian hampir celaka, sekecil apa pun, wajib dilaporkan agar penyebabnya bisa dikendalikan sebelum menjadi kecelakaan.",
      a: "Fasilitasi pembahasan project improvement (PDCA) percepatan alur pelaporan data produksi harian dari unit ke manajemen, mulai dari pemetaan proses saat ini hingga identifikasi akar masalah keterlambatan.",
      b: "Pemetaan proses (as-is) selesai dan teridentifikasi 3 akar masalah (input manual berulang, format laporan berbeda, dan waktu verifikasi). Progress project 40%, tahap berikutnya penyusunan usulan solusi.",
      cat: K_IMP,
      saran: "Disarankan standarisasi format laporan produksi harian di seluruh unit dan pemanfaatan form digital terintegrasi agar waktu kompilasi laporan lebih singkat dan data lebih konsisten."
    }
  },
  B: {
    1: {
      talk: "Topik: Penggunaan APD yang benar. Pesan: gunakan APD sesuai area kerja (helm, sepatu safety, kacamata, masker), periksa kondisinya sebelum dipakai, dan ganti bila rusak.",
      a: "Inspeksi kepatuhan penggunaan APD dan kondisi rambu K3 di area kerja yang dikunjungi. Ditemukan 1 rambu K3 pudar dan 1 pekerja tidak memakai kacamata safety; sudah diingatkan dan dilaporkan ke pengawas area.",
      b: "Review WI Identifikasi Bahaya dan Pengendalian Risiko (IBPR) untuk memahami langkah penilaian risiko pada kegiatan observasi lapangan oleh tim PEI.",
      cat: K_ISS,
      saran: "Masih ditemukan rambu K3 yang pudar di beberapa titik. Disarankan inventarisasi dan penggantian rambu secara berkala, serta penambahan rambu di area dengan lalu lintas pejalan kaki tinggi."
    },
    2: {
      talk: "Topik: Heat stress dan hidrasi. Pesan: minum air putih secara rutin tanpa menunggu haus, istirahat di tempat teduh, dan kenali tanda kelelahan akibat panas.",
      a: "Analisis data downtime peralatan produksi minggu lalu untuk mengidentifikasi 5 penyebab downtime terbesar (Pareto) sebagai bahan pembahasan dengan tim maintenance.",
      b: "Target: analisis Pareto downtime 1 minggu selesai. Realisasi: selesai 100%, 5 penyebab utama teridentifikasi dan mencakup sekitar 70% total jam downtime.",
      cat: K_ACH,
      saran: "Hasil analisis Pareto menunjukkan sebagian besar downtime berasal dari beberapa penyebab berulang. Disarankan pembahasan rutin bersama maintenance untuk menetapkan rencana aksi prioritas."
    },
    3: {
      talk: "Topik: Bahaya terpeleset, tersandung, dan terjatuh. Pesan: jaga lantai tetap kering dan bersih, gunakan pegangan tangga, dan jangan berlari di area kerja.",
      a: "Review pemakaian listrik dan AC di ruang kantor, termasuk pengaturan jadwal mematikan AC dan lampu di ruangan yang tidak digunakan serta saat jam istirahat.",
      b: "Estimasi penghematan pemakaian listrik ruang kantor sekitar 10-15% per hari dari pengaturan jadwal AC dan lampu, tanpa mengganggu kenyamanan kerja.",
      cat: K_IMP,
      saran: "Disarankan kebijakan hemat energi di seluruh gedung kantor (suhu AC 24-25 derajat C dan mematikan peralatan saat tidak digunakan), disertai pemantauan pemakaian listrik bulanan."
    },
    4: {
      talk: "Topik: Penanganan tumpahan oli dan bahan kimia. Pesan: segera amankan area, gunakan spill kit yang tersedia, dan laporkan tumpahan kepada pengawas area.",
      a: "Pelaksanaan dan dokumentasi program 5R (Ringkas, Rapi, Resik, Rawat, Rajin) di area kerja biro, termasuk penataan arsip dan pemisahan barang yang tidak terpakai.",
      b: "Area kerja biro lebih tertata: 2 lemari arsip dirapikan dan sekitar 3 kotak dokumen kedaluwarsa dipisahkan untuk dimusnahkan sesuai prosedur.",
      cat: K_ACH,
      saran: "Program 5R di area biro berjalan baik. Disarankan Management menetapkan audit 5R bulanan antar biro dengan penilaian sederhana agar kebiasaan ini berkelanjutan."
    },
    5: {
      talk: "Topik: Kesiapsiagaan tanggap darurat. Pesan: kenali jalur evakuasi dan titik kumpul, ketahui lokasi APAR terdekat, dan simpan nomor darurat internal.",
      a: "Pengembangan form digital (Microsoft Forms dan Power Automate) untuk pengumpulan data improvement dari setiap unit agar tidak lagi melalui file Excel terpisah.",
      b: "Draft form digital dan alur notifikasi otomatis selesai dan sudah diuji coba di internal biro. Progress 60%, tahap berikutnya uji coba di 2 unit pilot.",
      cat: K_PFU,
      saran: "Perlu dukungan Management untuk menunjuk PIC di setiap unit pilot pengguna form digital improvement agar uji coba dapat berjalan minggu depan sesuai rencana."
    }
  },
  C: {
    1: {
      talk: "Topik: Housekeeping di area kerja. Pesan: area kerja yang bersih dan tertata mengurangi risiko tersandung dan kebakaran, serta memudahkan pekerjaan.",
      a: "Safety inspection fasilitas pendukung kantor (pantry, toilet, tangga, dan area parkir). Ditemukan 1 lampu penerangan tangga mati dan sudah dilaporkan ke bagian GA untuk perbaikan.",
      b: "Pendalaman SOP Manajemen Perubahan (Management of Change) untuk memastikan setiap usulan perubahan proses dari project improvement melalui evaluasi risiko sebelum diterapkan.",
      cat: K_PFU,
      saran: "Perbaikan penerangan di area tangga dan jalur pejalan kaki perlu diprioritaskan karena berpotensi menimbulkan risiko terjatuh, terutama saat malam dan kondisi hujan."
    },
    2: {
      talk: "Topik: Keselamatan listrik di kantor. Pesan: hindari penumpukan colokan pada satu stop kontak, matikan peralatan setelah dipakai, dan laporkan kabel yang terkelupas.",
      a: "Review dan pemutakhiran dokumen SOP yang sudah melewati masa review, serta koordinasi dengan pemilik proses terkait usulan perubahan.",
      b: "Target: review 3 dokumen SOP. Realisasi: 2 dokumen selesai direview (67%), 1 dokumen menunggu masukan dari pemilik proses.",
      cat: K_ISS,
      saran: "Beberapa SOP sudah melewati periode review. Disarankan Management menetapkan target penyelesaian review SOP per biro dan memantau progresnya dalam rapat bulanan."
    },
    3: {
      talk: "Topik: Bekerja di ketinggian. Pesan: gunakan full body harness yang terkait pada titik angkur yang kuat, pastikan izin kerja tersedia, dan jangan bekerja sendirian.",
      a: "Evaluasi penggunaan ATK dan barang habis pakai di biro serta penyusunan usulan pengadaan berdasarkan kebutuhan riil agar tidak terjadi penumpukan stok.",
      b: "Teridentifikasi beberapa item ATK dengan stok berlebih, sehingga usulan pengadaan bulan ini dapat ditekan sekitar 20% dibanding bulan sebelumnya.",
      cat: K_ACH,
      saran: "Disarankan pengadaan barang habis pakai di setiap biro mengacu pada rata-rata pemakaian 3 bulan terakhir agar stok efisien dan biaya dapat ditekan."
    },
    4: {
      talk: "Topik: Hemat energi dan air. Pesan: matikan lampu, AC, dan peralatan elektronik saat tidak digunakan, serta segera laporkan kebocoran air.",
      a: "Pengecekan kebocoran keran dan penggunaan air di fasilitas kantor, serta pendataan titik yang membutuhkan perbaikan untuk mendukung efisiensi penggunaan air.",
      b: "Dari 6 titik keran yang dicek, 1 titik bocor dan sudah dilaporkan untuk diperbaiki. Perbaikan ini mengurangi pemborosan air bersih.",
      cat: K_ISS,
      saran: "Disarankan pengecekan rutin fasilitas air (keran, pipa, toilet) setiap bulan agar kebocoran cepat terdeteksi dan pemakaian air lebih efisien."
    },
    5: {
      talk: "Topik: Lock Out Tag Out (LOTO). Pesan: pastikan sumber energi terisolasi dan terkunci sebelum perbaikan peralatan, dan hanya personel berwenang yang boleh melepas gembok LOTO.",
      a: "Evaluasi hasil penerapan improvement format laporan harian standar pada unit pilot, termasuk pengumpulan masukan pengguna terkait kemudahan pengisian.",
      b: "Waktu penyusunan laporan harian di unit pilot berkurang dari sekitar 45 menit menjadi 25 menit. Masukan pengguna sudah dihimpun untuk penyempurnaan format.",
      cat: K_ACH,
      saran: "Uji coba format laporan standar menunjukkan penghematan waktu yang signifikan. Disarankan Management mendukung perluasan penerapan ke unit lain secara bertahap."
    }
  },
  D: {
    1: {
      talk: "Topik: Bahaya kelelahan (fatigue). Pesan: kenali tanda kelelahan seperti mengantuk dan sulit fokus, ambil istirahat singkat, dan jangan memaksakan diri saat bekerja.",
      a: "Inspeksi kelengkapan peralatan tanggap darurat di gedung kantor: APAR (masa berlaku dan tekanan), kotak P3K, serta rambu jalur evakuasi. Semua APAR yang dicek dalam kondisi baik; 1 kotak P3K perlu dilengkapi isinya.",
      b: "Review WI Penanganan Keadaan Darurat untuk memahami peran dan langkah evakuasi personel kantor saat terjadi kebakaran atau gempa.",
      cat: K_PFU,
      saran: "Isi kotak P3K di beberapa ruang kerja perlu dilengkapi secara rutin. Disarankan penunjukan PIC P3K per lantai dan pengecekan isi setiap bulan."
    },
    2: {
      talk: "Topik: Komunikasi saat serah terima pekerjaan. Pesan: sampaikan kondisi pekerjaan, potensi bahaya, dan pekerjaan yang belum selesai secara jelas kepada rekan berikutnya.",
      a: "Verifikasi dan rekonsiliasi data realisasi produksi bulanan dengan data unit operasi dan laboratorium untuk memastikan konsistensi laporan kinerja.",
      b: "Target: rekonsiliasi data 1 bulan untuk 4 parameter. Realisasi: 4 parameter selesai (100%), ditemukan 2 selisih minor yang sudah dikonfirmasi dan dikoreksi.",
      cat: K_ACH,
      saran: "Rekonsiliasi data produksi bulan ini selesai tepat waktu. Disarankan penetapan satu sumber data resmi (single source of truth) untuk laporan kinerja agar selisih data antar unit dapat dihindari."
    },
    3: {
      talk: "Topik: Penggunaan alat kerja tangan yang aman. Pesan: gunakan alat sesuai fungsinya, periksa kondisinya sebelum dipakai, dan kembalikan ke tempatnya setelah selesai.",
      a: "Penerapan rapat koordinasi rutin secara daring/hybrid untuk agenda internal sehingga mengurangi kebutuhan perjalanan dan penggunaan kendaraan operasional.",
      b: "2 rapat koordinasi minggu ini dilakukan secara daring, menghemat pemakaian kendaraan operasional dan BBM serta waktu perjalanan peserta sekitar 1-2 jam.",
      cat: K_IMP,
      saran: "Disarankan rapat koordinasi rutin yang bersifat informasi dilakukan secara daring sebagai standar, sedangkan rapat tatap muka diprioritaskan untuk pengambilan keputusan penting."
    },
    4: {
      talk: "Topik: Pengendalian debu di area kerja. Pesan: gunakan masker yang sesuai, lakukan penyiraman jalan berdebu secara berkala, dan tutup material agar tidak tertiup angin.",
      a: "Dukungan kegiatan penghijauan dan pemeliharaan tanaman di sekitar area kantor, serta pemantauan kebersihan saluran drainase dari sampah.",
      b: "10 bibit tanaman ditanam di sekitar area kantor dan 1 saluran drainase yang tersumbat sampah sudah dibersihkan sehingga aliran air kembali lancar.",
      cat: K_ACH,
      saran: "Disarankan program penghijauan dan bersih drainase dilakukan rutin setiap bulan dengan melibatkan seluruh biro sebagai bagian dari budaya Green Standard."
    },
    5: {
      talk: "Topik: Stop Work Authority. Pesan: setiap pekerja berhak dan wajib menghentikan pekerjaan bila melihat kondisi atau tindakan tidak aman, tanpa takut disalahkan.",
      a: "Pendampingan unit dalam penyusunan dokumen ide improvement (problem statement, analisis akar masalah, dan rencana perbaikan) untuk program inovasi perusahaan.",
      b: "2 dokumen ide improvement dari unit sudah lengkap sampai tahap analisis akar masalah. Progress pendampingan 50%, tahap berikutnya penyusunan rencana perbaikan dan target terukur.",
      cat: K_PFU,
      saran: "Perlu dukungan Management berupa alokasi waktu khusus bagi tim unit untuk mengerjakan project improvement agar penyelesaian ide inovasi sesuai target program."
    }
  }
};
window.DRONE_KATEGORI = KATEGORI;
window.DRONE_STATUS = ["Masuk Kerja", "Dinas", "Sakit", "SPPRM", "Cuti"];
window.DRONE_DEFAULTS = {
  formUrl: "https://forms.cloud.microsoft/pages/responsepage.aspx?id=WmHdwVqJEEaE-Hdl_k5efCGTcwIP8r1Lk-ox2tEexmFUMDI2Qks0RUxRTFo5NFhUQk1YSUNYQUI2RyQlQCN0PWcu&origin=lprLink&route=shorturl",
  identitas: { jabatan: "Specialist", nama: "MUHAMMAD DIMAS BAIHAQI", biro: "Process Excellence & Innovation", satker: "Process Excellence & Innovation", status: "Masuk Kerja" },
  jam: { awal: "08:00", akhir: "16:30" },
  content: DEFAULT_CONTENT
};
window.droneMerge = function (s) {
  var D = window.DRONE_DEFAULTS, c = JSON.parse(JSON.stringify(D)), k, v, d;
  if (!s || typeof s !== "object") return c;
  if (s.identitas) for (k in D.identitas) if (typeof s.identitas[k] === "string") c.identitas[k] = s.identitas[k];
  if (s.jam) ["awal", "akhir"].forEach(function (k) { if (/^\d{2}:\d{2}$/.test(s.jam[k] || "")) c.jam[k] = s.jam[k]; });
  if (s.content) for (v in D.content) for (d = 1; d <= 5; d++) ["talk", "a", "b", "cat", "saran"].forEach(function (f) {
    var x = s.content[v] && s.content[v][d] && s.content[v][d][f];
    if (typeof x === "string") c.content[v][d][f] = x;
  });
  return c;
};
})();
