import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  collectionGroup,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import '../../style/forms.css';

const UserDashboard = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [merchants, setMerchants] = useState({});

  // Filter states
  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minDiscount, setMinDiscount] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch merchant data
  useEffect(() => {
    const fetchMerchants = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs
        .filter(doc => doc.data().role === 'merchant')
        .reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
      setMerchants(data);
    };

    fetchMerchants();
  }, []);

  // Fetch item data after merchants are loaded
  useEffect(() => {
    const fetchItemsWithMerchantData = async () => {
      if (Object.keys(merchants).length === 0) return;

      const snapshot = await getDocs(collectionGroup(db, 'items'));
      const allItems = snapshot.docs.map((doc) => {
        const itemData = doc.data();
        const merchantId = doc.ref.parent.parent?.id;
        const merchant = merchants[merchantId];

        return {
          id: doc.id,
          ...itemData,
          merchantId,
          shopnumber: merchant?.shopnumber || 'N/A',
          shopfloor: merchant?.shopfloor || 'N/A',
          offer: merchant?.offer || 'N/A',
        };
      });

      setItems(allItems);
    };

    fetchItemsWithMerchantData();
  }, [merchants]);

  const handleBuy = async (item) => {
    if (!user) return alert('Please login to buy.');

    const order = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      imageUrl: item.imageUrl,
      userId: user.uid,
      userEmail: user.email,
      deliveryPartner: 'John Doe',
      contact: '+91-9876543210',
      status: 'Out for Delivery',
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'orders'), order);
    alert('Order placed successfully! Track in orders.');
  };

  const filteredItems = items.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesMinPrice = !minPrice || item.price >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || item.price <= parseFloat(maxPrice);
    const matchesDiscount = !minDiscount || item.discount >= parseFloat(minDiscount);
    return matchesName && matchesMinPrice && matchesMaxPrice && matchesDiscount;
  });

  return (
    <div>
      <h2>Welcome to SuperMall!</h2>

      <h3>Filter Items</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Discount %"
          value={minDiscount}
          onChange={(e) => setMinDiscount(e.target.value)}
        />
      </div>

      <h3>Available Items</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
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
                Discount: {item.discount}% <br />
                Offer: {item.offer} <br />
                Shop No: {item.shopnumber} <br />
                Floor: {item.shopfloor}
              </p>
              <button onClick={() => handleBuy(item)}>Buy</button>
            </div>
          ))
        ) : (
          <p>No items match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
