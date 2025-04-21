import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import "../../style/forms.css";

const AdminDashboard = () => {
  const [merchantName, setMerchantName] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [shopnum, setShopnum] = useState([]);
  const [shopfloor, setShopfloor] = useState([]);
  const [offer, setOffer] = useState([]);

  // Fetch all users with role = merchant
  const fetchMerchants = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.role === 'merchant');
    setMerchants(data);
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  // Create a new merchant with Firebase Auth + Firestore
  const handleAddMerchant = async () => {
    if (!merchantEmail || !merchantPassword || !merchantName || !shopnum || !shopfloor || !offer) {
      return alert("All fields required.");
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, merchantEmail, merchantPassword);
      const user = userCredential.user;

      // 2. Add merchant info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: merchantName,
        email: merchantEmail,
        role: 'merchant',
        shopnumber: shopnum,
        shopfloor: shopfloor,
        offer: offer,
      });

      // Clear form & refresh list
      setMerchantName('');
      setMerchantEmail('');
      setMerchantPassword('');
      setShopnum('');
      setShopfloor('');
      setOffer('');
      fetchMerchants();
    } catch (error) {
      alert(error.message);
    }
  };

  // Remove merchant from Firestore (and optionally Auth if you want)
  const handleRemoveMerchant = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchMerchants();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <h4>Add Merchant</h4>
        <input
          type="text"
          placeholder="Merchant Name"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Merchant Email"
          value={merchantEmail}
          onChange={(e) => setMerchantEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Merchant Password"
          value={merchantPassword}
          onChange={(e) => setMerchantPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="shop number"
          value={shopnum}
          onChange={(e) => setShopnum(e.target.value)}
        />
        <input
          type="number"
          placeholder="Shop Floor"
          value={shopfloor}
          onChange={(e) => setShopfloor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Offer Details"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <button onClick={handleAddMerchant}>Add Merchant And Shop Details</button>
      </div>

      <h4>Merchants List</h4>
      <ul>
        {merchants.map((merchant) => (
          <li key={merchant.id}>
            {merchant.name} - {merchant.email}
            <button onClick={() => handleRemoveMerchant(merchant.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
