import React, { useState } from 'react';

const slides = [
  {
    title: 'Apa itu Tampilan Graph?',
    content: 'Tampilan ini menunjukkan alur distribusi produk dari pelaku usaha hingga ke juru sembelih atau distributor lainnya.',
  },
  {
    title: 'Node dan Edge',
    content: 'Objek-objek bulat (Node) merupakan entitas individual yang berperan pada alur distribusi produk. \nGaris penghubung (Edge) menunjukkan alur pembelian atau kepemilikan',
    image: '/images/node_dan_edge.png',
  },
  {
    title: 'Jenis-Jenis Node',
    content: '🟠 Node oranye melambangkan pelaku usaha. Ini adalah titik awal distribusi produk. \n🟢 Node hijau melambangkan produk. \n🔵 Node biru melambangkan tempat rumah potong/juru sembelih',
    image: '/images/detail_trace_1.png',
    mode: 'horizontal'
  },
  {
    title: 'Jenis-Jenis Node',
    content: '🟡 Node kuning melambangkan bahan baku yang terdapat pada produk. Node ini hanya muncul pada mode trace detail dan hanya terdapat pada produk yang memiliki lebih dari 1 bahan baku.',
    image: '/images/node_kuning.png',
  },
  {
    title: 'Node Click',
    content: 'Saat salah satu node diclick, pop-up berisi detail node dan tombol menuju mode trace detail akan muncul. Alur distribusi node tersebut juga akan diperlihatkan dengan highlight berwarna merah.',
    image: '/images/node_tap.png',
  },
  {
    title: 'Trace Detail',
    content: 'Mode ini menampilkan detail alur distribusi pada node yang dipilih. Node bahan baku 🟡 juga akan muncul pada mode ini jika produk dengan lebih dari 1 bahan baku muncul pada distribusi node terpilih',
    image: '/images/detail_trace_mode.png',
  },
  {
    title: 'Tombol Kembali ke Filter',
    content: 'Tombol ini berada pada mode trace detail yang berfungsi untuk kembali ke state filter sebelum masuk ke mode trace detail.',
    image: '/images/kembali_ke_filter.png',
  },
  {
    title: 'Filter',
    content: 'Gunakan filter kategori bahan, provinsi, pembina, dan tanggal batch produksi di atas untuk menyesuaikan tampilan graph.',
    image: '/images/filter.png',
  },
  {
    title: 'Download Report',
    content: 'Report sederhana berupa file pdf tentang graph yang sedang ditampilkan bisa didownload dengan menekan tombol ini.',
    image: '/images/download_pdf.png',
  },
  {
    title: 'Lihat Statistik',
    content: 'Halaman berisi statistik sederhana akan muncul saat tombol ini ditekan.',
    image: '/images/statistik.png',
  },
];

const GraphGuide = ({ onClose }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

  const { title, content, image, mode } = slides[index];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] z-[2000] flex items-center justify-center"
      onClick={onClose}    
    >
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative text-center font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-purple-700 mb-2">{title}</h2>
        {mode === 'horizontal' ? (
  // Horizontal layout
        <div className="flex flex-col md:flex-row items-center gap-6">
            <img
            src={image}
            alt="Guide illustration"
            className="w-full md:w-1/2 max-h-[300px] object-contain"
            />
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
            {content}
            </p>
        </div>
        ) : (
        // Default vertical layout
        <>
            <img
            src={image}
            alt="Guide illustration"
            className="w-full max-h-[300px] object-contain mb-4"
            />
            <p className="text-gray-700 whitespace-pre-line text-sm">
            {content}
            </p>
        </>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={prev}
            className={`px-4 py-2 rounded bg-purple-200 text-purple-800 font-semibold ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={index === 0}
          >
            ← Sebelumnya
          </button>
          <button
            onClick={next}
            className={`px-4 py-2 rounded bg-purple-600 text-white font-semibold ${index === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={index === slides.length - 1}
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphGuide;
