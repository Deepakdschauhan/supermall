import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collectionGroup,
  addDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { auth } from '../../firebase';
import "../../style/forms.css";

const UserDashboard = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Track logged in user
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const fetchAllItems = async () => {
    const snapshot = await getDocs(collectionGroup(db, 'items'));
    const allItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(allItems);
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

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

  return (
    <div>
      <h2>Welcome to SuperMall!</h2>
      <h3>Available Items</h3>
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
            <button onClick={() => handleBuy(item)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
