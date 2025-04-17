import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../../style/forms.css";

const UserAuth = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !phone || !password || !confirmPassword)
      return alert('Please fill all fields');
    if (password !== confirmPassword)
      return alert('Passwords do not match');

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Set the document with UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        phone,
        role: 'user',
      });

      alert('Registration successful');
      navigate('/user-dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Fill in all fields');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/user-dashboard');
    } catch (error) {
      alert('Invalid login');
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'User Register' : 'User Login'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isRegistering && (
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>

      <p>
        {isRegistering ? 'Already have an account?' : 'New user?'}{' '}
        <button onClick={toggleForm}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default UserAuth;
