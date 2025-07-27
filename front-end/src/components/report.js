import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdfReport = ({
  raws,
  filteredRaws,
  productIngredientMap,
  perusahaanMap,
  selectedIngredient,
  filteredIngredientList,
  selectedPembina,
  startDate,
  endDate,
  categorizedIngredients,
  loggedInUser
}) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const date = new Date();

  const isCategoryOnly =
    !selectedIngredient && filteredIngredientList.length > 0;

  const filterText = isCategoryOnly
    ? Object.entries(categorizedIngredients)
        .find(([_, subs]) =>
          subs.every((sub) => filteredIngredientList.includes(sub))
        )?.[0] || 'Semua'
    : selectedIngredient || filteredIngredientList.join(', ') || 'Semua';

  const pembinaText = selectedPembina
    ? perusahaanMap[selectedPembina]?.nama_perusahaan || 'Tidak ditemukan'
    : 'Semua';

  const dateText =
    startDate || endDate
      ? `${startDate || '-'} s/d ${endDate || '-'}`
      : '- s/d -';

  const totalProduk = Object.keys(filteredRaws).length;

  const allIngredients = new Set();
  const perusahaanTypeMap = {};

  Object.entries(filteredRaws).forEach(([productID, value]) => {
    const ingredients =
      Array.isArray(value) ? productIngredientMap[productID] || [] :
      value?.matchedIngredients || productIngredientMap[productID] || [];

    ingredients.forEach((bahan) => allIngredients.add(bahan));

    const track = Array.isArray(value) ? value : value?.track || [];

    track.forEach((namaPerusahaan) => {
      const found = Object.values(perusahaanMap).find(
        (p) => p.nama_perusahaan === namaPerusahaan
      );
      if (found) {
        const jenis = found.jenis_usaha || 'Lainnya';
        if (!perusahaanTypeMap[jenis]) perusahaanTypeMap[jenis] = new Set();
        perusahaanTypeMap[jenis].add(found._id);
      }
    });
  });

  const perusahaanCounts = {};
  for (const [jenis, idSet] of Object.entries(perusahaanTypeMap)) {
    perusahaanCounts[jenis] = idSet.size;
  }

  const totalUniqueBahan = allIngredients.size;

  const totalUniquePerusahaan = new Set(
    Object.entries(filteredRaws)
      .map(([_, value]) => {
        const track = Array.isArray(value) ? value : value?.track || [];
        return track
          .map((name) =>
            Object.values(perusahaanMap).find((p) => p.nama_perusahaan === name)
              ? name
              : null
          )
          .filter(Boolean);
      })
      .flat()
  ).size;

  // Header
  doc.setFontSize(16);
  doc.setTextColor('#4A148C');
  doc.text('Trace Halal', 40, 40);

  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Tanggal Generate: ${date.toLocaleString()}`, 40, 60);
  doc.text(`Login Sebagai: ${loggedInUser || '-'}`, 40, 75);
  doc.text(`Kategori Bahan: ${filterText}`, 40, 90);
  doc.text(`Pembina: ${pembinaText}`, 40, 105);
  doc.text(`Tanggal Batch Produksi: ${dateText}`, 40, 120);

  // Statistik Section
  doc.setFontSize(12);
  doc.setTextColor('#4A148C');
  doc.text('Statistik', 40, 145);

  const statistikRows = [
    ['Total Produk', totalProduk],
    ['Total Jenis Bahan', totalUniqueBahan],
    ['Total Perusahaan Terlibat', totalUniquePerusahaan],
  ];

  Object.entries(perusahaanCounts).forEach(([jenis, count]) => {
    statistikRows.push([`Jumlah ${jenis}`, count]);
  });
  

  autoTable(doc, {
    startY: 160,
    head: [['Keterangan', 'Jumlah']],
    body: statistikRows,
    theme: 'grid',
    headStyles: { fillColor: [108, 59, 181] },
    columnStyles: {
      0: { cellWidth: 250 },
      1: { cellWidth: 100, halign: 'right' },
    },
  });

  const nameToCompany = {};
  Object.values(perusahaanMap).forEach((p) => {
    const nameKey = p.nama_perusahaan?.toLowerCase().trim();
    if (nameKey) nameToCompany[nameKey] = p;
  });

  const rphToPelakuUsahaMap = {};

  // Object.values(perusahaanMap).forEach((company) => {
  //   if (company.jenis_usaha === 'rph') {
  //     rphToPelakuUsahaMap[company.nama_perusahaan] = new Set();
  //   }
  // });


  Object.entries(filteredRaws).forEach(([productID, value]) => {
    const track = Array.isArray(value) ? value : value?.track || [];

    for (let i = 0; i < track.length - 1; i++) {
      const fromName = track[i]?.toLowerCase().trim();
      const toName = track[i + 1]?.toLowerCase().trim();

      const from = nameToCompany[fromName];
      const to = nameToCompany[toName];

      if (to?.jenis_usaha === 'rph' && from?.nama_perusahaan) {
        if (!rphToPelakuUsahaMap[to.nama_perusahaan]) {
          rphToPelakuUsahaMap[to.nama_perusahaan] = new Set();
        }
        rphToPelakuUsahaMap[to.nama_perusahaan].add(from.nama_perusahaan);
      }
    }
  });


  const rphRows = Object.entries(rphToPelakuUsahaMap).map(([rphName, pelakuSet], index) => [
    index + 1,
    rphName,
    pelakuSet.size,
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 30,
    head: [['No.', 'Nama RPH', 'Jumlah Pelanggan']],
    body: rphRows,
    theme: 'grid',
    headStyles: { fillColor: [108, 59, 181] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 100 },
      2: { cellWidth: 120, halign: 'right' },
    },
  });

  // Prepare and sort produkRows
  const produkRows = Object.entries(filteredRaws)
  .map(([productID, trackObj]) => {
    const info = 
      Array.isArray(trackObj) // handle legacy flat array
        ? productIngredientMap[productID] || []
        : trackObj?.matchedIngredients || productIngredientMap[productID] || [];

    const track = Array.isArray(trackObj) ? trackObj : trackObj?.track || [];

    const perusahaan = perusahaanMap[Object.keys(perusahaanMap).find((id) =>
      perusahaanMap[id]?.nama_perusahaan === track[0]
    )];

    return {
      idHalal: productID,
      nama: (raws[productID]?.nama_produk || '-').toUpperCase(),
      perusahaan: perusahaan?.nama_perusahaan || '-',
      bahan: info.join(', ') || '-',
      kota: raws[productID]?.kota || '-',
      provinsi: raws[productID]?.provinsi || '-',
    };
  })
  .sort((a, b) => a.bahan.localeCompare(b.bahan));

  const finalProdukRows = produkRows.map((item, index) => [
    index + 1,
    item.nama,
    item.perusahaan,
    item.bahan,
    item.kota,
    item.provinsi,
    item.idHalal,
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    // margin: { left: 40, right: 40 },
    head: [['No.', 'Nama Produk', 'Perusahaan', 'Bahan', 'Kota', 'Provinsi', 'ID Halal']],
    body: finalProdukRows,
    styles: { halign: 'left', fontSize: 8, overflow: 'linebreak' },
    headStyles: { fillColor: [108, 59, 181], textColor: 255 },
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 100 },
      2: { cellWidth: 100 },
      3: { cellWidth: 100 },
      4: { cellWidth: 50 },
      5: { cellWidth: 55 },
      6: { cellWidth: 80 },
    }
  });

  doc.save(`Laporan_Jejak_Produk_Halal_${Date.now()}.pdf`);
};
