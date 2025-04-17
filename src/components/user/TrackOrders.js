import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={{ marginBottom: '20px' }}>
          <p>
            <strong>{order.name}</strong><br />
            Status: {order.status}<br />
            Delivery Partner: {order.deliveryPartner}<br />
            Contact: {order.contact}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrackOrders;
