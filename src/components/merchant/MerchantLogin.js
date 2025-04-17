import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../../style/forms.css";

const MerchantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in via Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check role from Firestore
      const userDocRef = doc(db, 'users', user.uid); // Use 'users' collection or adjust if using 'merchants'
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData.role === 'merchant') {
          localStorage.setItem('merchantId', user.uid); // Store UID if needed
          navigate('/merchant-dashboard');
        } else {
          alert('Not a merchant account');
        }
      } else {
        alert('Merchant data not found');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Merchant Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Merchant Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default MerchantLogin;
