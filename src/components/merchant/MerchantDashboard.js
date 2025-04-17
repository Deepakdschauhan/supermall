import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../../firebase';
import "../../style/forms.css";
import {
  collection,
  addDoc,
  getDocs,
  query,
  serverTimestamp
} from 'firebase/firestore';

const MerchantDashboard = () => {
  const [merchantId, setMerchantId] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Get current merchant's UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setMerchantId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch merchant's items
  const fetchItems = useCallback(async () => {
    if (!merchantId) return;

    const q = query(collection(db, 'merchants', merchantId, 'items'));
    const snapshot = await getDocs(q);
    const itemsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(itemsData);
  }, [merchantId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async () => {
    if (!name || !price || !discount || !imageUrl || !merchantId) {
      return alert('Please fill all fields');
    }

    const item = {
      name,
      price: parseFloat(price),
      discount: parseFloat(discount),
      imageUrl,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'merchants', merchantId, 'items'), item);
    alert('Item added!');
    setName('');
    setPrice('');
    setDiscount('');
    setImageUrl('');
    fetchItems(); // Refresh list
  };

  return (
    <div>
      <h2>Merchant Dashboard</h2>

      <h3>Add New Item</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Discount (%)"
        value={discount}
        onChange={e => setDiscount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <button onClick={handleAddItem}>Add Item</button>

      <h3>Your Items</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              width: '200px',
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h4>{item.name}</h4>
            <p>
              Price: ₹{item.price} <br />
              Discount: {item.discount}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantDashboard;