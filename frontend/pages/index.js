import { useEffect, useState } from 'react';
import API from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [cinemas, setCinemas] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/cinemas').then(res => setCinemas(res.data));
    // auto-create or load user from localStorage
    const stored = JSON.parse(localStorage.getItem('mb_user') || 'null');
    if (stored) setUser(stored);
    else {
      API.post('/users', { name: 'Local User', email: `yuvrajsogarwal@gmail.com` })
        .then(res => {
          localStorage.setItem('mb_user', JSON.stringify(res.data));
          setUser(res.data);
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2>Movie Booking</h2>
          <div className="small">Logged in as: {user ? user.email : '...'}</div>
        </div>
        <div className="topbar">
          <Link href="/bookings"><button className="btn">My Bookings</button></Link>
        </div>
      </div>

      <h3>Available Cinemas</h3>
      {cinemas.map(c => (
        <Link key={c.id} href={`/cinema/${c.id}`}>
          <div className="cinema-card">
            <strong>{c.name}</strong>
            <div className="small">{c.location}</div>
          </div>
        </Link>
      ))}
      
      {cinemas.length === 0 && (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>
          <p>No cinemas available at the moment.</p>
        </div>
      )}
    </div>
  );
}
