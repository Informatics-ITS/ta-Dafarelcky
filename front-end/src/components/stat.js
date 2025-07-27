import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatisticsPage() {
  // const { state } = useLocation();
  // const {
  //   raws,
  //   perusahaanMap,
  //   product_ingredient,
  //   filteredRaws,
  // } = state || {};

  const storedState = localStorage.getItem('statisticsState');
  const { raws, perusahaanMap, product_ingredient, filteredRaws, categorizedIngredients } = storedState
    ? JSON.parse(storedState)
    : {};

  const { companyStats, rphStats, categoryStats } = useMemo(() => {
    const companyProductMap = {};
    const rphBuyerMap = {};
    const categoryCountMap = {};

    for (const [productID, data] of Object.entries(filteredRaws)) {
      const fullData = raws[productID];
      const companyId = fullData?.id_perusahaan;

      if (companyId) {
        if (!companyProductMap[companyId]) companyProductMap[companyId] = [];
        companyProductMap[companyId].push(productID);
      }

      // Category counter
      const ingredients = product_ingredient[productID] || [];
      for (const [category, subs] of Object.entries(categorizedIngredients || {})) {
        if (subs.some(sub => ingredients.includes(sub))) {
          categoryCountMap[category] = (categoryCountMap[category] || 0) + 1;
          // break; // assume 1 category per product
        }
      }

      // RPH buyer map
      const track = fullData?.track || [];
      for (let i = 0; i < track.length - 1; i++) {
        const buyerName = track[i];
        const rphName = track[i + 1];

        const buyer = Object.values(perusahaanMap).find(p => p.nama_perusahaan === buyerName);
        const rph = Object.values(perusahaanMap).find(p => p.nama_perusahaan === rphName);

        if (buyer && rph?.jenis_usaha === 'rph') {
          if (!rphBuyerMap[rph.nama_perusahaan]) rphBuyerMap[rph.nama_perusahaan] = new Set();
          rphBuyerMap[rph.nama_perusahaan].add(buyer.nama_perusahaan);
        }
      }
    }

    const companyStatsData = Object.entries(companyProductMap).map(([id, productIDs]) => ({
      id,
      name: perusahaanMap[id]?.nama_perusahaan || id,
      alamat: perusahaanMap[id]?.alamat_usaha || [],
      jenis_usaha: perusahaanMap[id]?.jenis_usaha || [],
      count: productIDs.length,
      products: productIDs.map(pid => raws[pid]?.nama_produk || pid),
    }));

    const rphStatsData = Object.entries(rphBuyerMap).map(([rph, buyers]) => ({
      name: rph,
      count: buyers.size,
      buyers: Array.from(buyers),
    }));

    const categoryStatsData = Object.entries(categoryCountMap).map(([category, count]) => ({
      category,
      count
    }));

    return { companyStats: companyStatsData, rphStats: rphStatsData, categoryStats: categoryStatsData };
  }, [filteredRaws, perusahaanMap, raws, product_ingredient, categorizedIngredients]);


  const chartData = {
    labels: categoryStats.map(c => c.category),
    datasets: [
      {
        label: 'Jumlah Produk',
        data: categoryStats.map(c => c.count),
        backgroundColor: [
          '#8e44ad', '#9b59b6', '#a29bfe', '#dcd6f7', '#6c5ce7',
          '#b2bec3', '#ffeaa7', '#fab1a0', '#ff7675', '#fd79a8'
        ],
        borderWidth: 1,
      },
    ],
  };

  <style>
    {`
      .custom-table thead tr {
        background-color: #5f259f !important;
        color: white !important;
      }

      .custom-table th {
        padding: 12px !important;
        font-weight: 600;
        font-family: 'DM Sans', sans-serif;
      }

      .custom-table td {
        padding: 10px;
        font-family: 'DM Sans', sans-serif;
      }
    `}
  </style>

  return (
    <div style={{
      fontFamily: 'DM Sans, sans-serif',
      backgroundColor: '#f9f6fc',
      padding: '40px',
      minHeight: '100vh',
      color: '#333'
    }}>
      <h2 style={{ color: '#6c3bb5', fontSize: '20px', marginBottom: '10px' }}>
        Jumlah Produk per Kategori
      </h2>

      <div style={{ marginBottom: '40px', maxWidth: '500px' }}>
        <Doughnut data={chartData} />
      </div>

      <h2 style={{ color: '#6c3bb5', fontSize: '20px', marginBottom: '10px' }}>Produk per Perusahaan</h2>
      <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr className="bg-[#5f259f] text-white font-semibold">
            <th style={{ padding: '12px' }}>Nama Perusahaan</th>
            <th style={{ padding: '12px' }}>Alamat Perusahaan</th>
            <th style={{ padding: '12px' }}>Jenis Perusahaan</th>
            <th style={{ padding: '12px' }}>Jumlah Produk</th>
            <th style={{ padding: '12px' }}>Daftar Produk</th>
          </tr>
        </thead>
        <tbody>
          {companyStats.map(stat => (
            <tr key={stat.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{stat.name}</td>
              <td style={{ padding: '10px' }}>{stat.alamat}</td>
              <td style={{ padding: '10px' }}>{stat.jenis_usaha}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{stat.count}</td>
              <td style={{ padding: '10px' }}>
                <ul style={{ margin: 0, paddingLeft: '5px' }}>
                  {stat.products.map((p, idx) => <li key={idx}>{p}</li>)}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ color: '#6c3bb5', fontSize: '20px', marginBottom: '10px' }}>Pelaku Usaha per RPH</h2>
      <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr className="bg-[#5f259f] text-white font-semibold">
            <th style={{ padding: '12px' }}>Nama RPH</th>
            <th style={{ padding: '12px' }}>Jumlah Pelaku Usaha</th>
            <th style={{ padding: '12px' }}>Daftar Pelaku Usaha</th>
          </tr>
        </thead>
        <tbody>
          {rphStats.map(stat => (
            <tr key={stat.name} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{stat.name}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{stat.count}</td>
              <td style={{ padding: '10px' }}>
                <ul style={{ margin: 0, paddingLeft: '5px' }}>
                  {stat.buyers.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatisticsPage;
