import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
//   const { token } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
//   console.log(id)

  useEffect(() => {
    const fetchProductDetail = async () => {
        const username = process.env.REACT_APP_TRACEABILITY_USERNAME; 
        const password = process.env.REACT_APP_TRACEABILITY_PASSWORD; 
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_TRACEABILITY_URL}/${id}`, {
            auth: {
                username,
                password,
            },
        });
        // console.log(id)
        console.log(response.data.result)
        setProduct(response.data.result);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  const renderFieldValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <ul className="ml-4 list-disc">
          {Object.entries(value).map(([subKey, subValue]) => (
            <li key={subKey}>
              <strong>{subKey.replace(/_/g, ' ')}:</strong> {renderFieldValue(subValue)}
            </li>
          ))}
        </ul>
      );
    } else {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Detail Produk</h1>
      {Object.keys(product).map((key) => (
        <div key={key} className="mb-4 p-4 bg-white rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Data {key}</h2>
          {Object.entries(product[key])
            .filter(([field]) => field === 'nama_perusahaan' || field === 'juru_sembelih')
            .map(([field, value]) => (
              <p key={field} className="text-gray-700">
                <strong>{field.replace(/_/g, ' ')}:</strong> {renderFieldValue(value)}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ProductDetail;