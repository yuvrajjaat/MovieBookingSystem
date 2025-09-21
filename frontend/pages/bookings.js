import { useEffect, useState } from 'react';
import API from '../lib/api';
import Link from 'next/link';

export default function Bookings(){
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mb_user') || 'null');
    if (!stored) return;
    setUser(stored);
    API.get(`/users/${stored.id}/bookings`).then(res => setBookings(res.data));
  }, []);

  if (!user) return <div className="container">No user found.</div>;

  return (
    <div className="container">
      <Link href="/"><button className="btn">Back</button></Link>
      <h3>My Bookings</h3>
      {bookings.length === 0 && <div>No bookings yet.</div>}
      {bookings.map(b => (
        <div key={b.id} className="movie-card">
          <div><strong>Booking ID:</strong> {b.id}</div>
          <div><strong>Movie:</strong> {b.Show?.Movie?.title || '—'}</div>
          <div><strong>Screen:</strong> {b.Show?.Screen?.name || '—'}</div>
          <div><strong>Seats:</strong> {(b.seats || []).join(', ')}</div>
          <div><strong>Booked at:</strong> {new Date(b.createdAt).toLocaleString()}</div>
          <div><strong>Total:</strong> ₹{b.totalAmount}</div>
        </div>
      ))}
    </div>
  );
}
