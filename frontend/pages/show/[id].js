import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import API from '../../lib/api';
import io from 'socket.io-client';

let socket;

function seatId(r, c){ return `R${r}C${c}`; }

export default function ShowPage(){
  const router = useRouter();
  const { id } = router.query;
  const [show, setShow] = useState(null);
  const [booked, setBooked] = useState([]);
  const [blocked, setBlocked] = useState([]); // from sockets
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const userRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mb_user') || 'null');
    userRef.current = stored;
  }, []);

  useEffect(() => {
    if (!id) return;
    API.get(`/shows/${id}`).then(res => {
      setShow(res.data);
      if (res.data.Screen) {
        setRows(res.data.Screen.rows || 10);
        setCols(res.data.Screen.cols || 10);
      }
    });
    loadBooked();
    // socket init
    socket = io('http://localhost:4000');
    socket.emit('joinShow', { showId: id });
    socket.on('seatsBlocked', ({ seats }) => setBlocked(prev => Array.from(new Set([...prev, ...seats]))));
    socket.on('seatsUnblocked', ({ seats }) => setBlocked(prev => prev.filter(s => !seats.includes(s))));
    socket.on('seatsBooked', ({ seats }) => {
      setBooked(prev => Array.from(new Set([...prev, ...seats])));
      setSelected(prev => prev.filter(s => !seats.includes(s)));
      setBlocked(prev => prev.filter(s => !seats.includes(s)));
    });
    return () => { socket.disconnect(); socket = null; };
  }, [id]);

  async function loadBooked(){
    const res = await API.get(`/shows/${id}/booked-seats`);
    setBooked(res.data.booked || []);
    setBlocked(res.data.blocked || []);
  }

  function toggleSelect(r,c){
    const sid = seatId(r,c);
    if (booked.includes(sid) || blocked.includes(sid)) return;
    if (selected.includes(sid)){
      setSelected(s => { const next = s.filter(x=>x!==sid); 
        // inform server to unblock seat
        if (socket) socket.emit('unblockSeats', { showId: id, seats: [sid] });
        return next;
      });
    } else {
      if (selected.length >= 6) { alert('Max 6 seats'); return; }
      setSelected(s => {
        const ns = [...s, sid];
        // inform server to block seat with TTL
        if (socket) socket.emit('blockSeats', { showId: id, seats: [sid], ttl: 120000 });
        return ns;
      });
    }
  }

  async function handlePay(){
    const user = JSON.parse(localStorage.getItem('mb_user') || 'null');
    if (!user) { alert('No user'); return; }
    if (selected.length === 0) { alert('Select seats'); return; }
    
    console.log('Socket ID:', socket?.id);
    console.log('Selected seats:', selected);
    
    try {
      const payload = { 
        userId: user.id, 
        showId: Number(id), 
        seats: selected,
        socketId: socket?.id 
      };
      console.log('Booking payload:', payload);
      
      const res = await API.post('/bookings', payload);
      alert('Booking Confirmed!');
      router.push('/bookings');
    } catch (e) {
      console.error('Booking error:', e.response?.data || e.message);
      alert('Error: ' + (e.response?.data?.error || e.message));
      // reload booked seats
      loadBooked();
    }
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={()=>router.back()}>Back</button>
      
      {!show ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          Loading show details...
        </div>
      ) : (
        <div>
          <h3>{show.Movie?.title}</h3>
          <div className="small" style={{marginBottom: '15px'}}>
            Screen: {show.Screen?.name} • {new Date(show.startTime).toLocaleString()}
          </div>
          
          <div className="notice">
            Select up to 6 seats. Yellow seats are temporarily blocked by other users.
          </div>

          <div style={{display:'flex', gap:'20px', alignItems:'flex-start'}}>
            <div>
              <SeatGrid rows={rows} cols={cols} booked={booked} blocked={blocked} selected={selected} onToggle={toggleSelect} />
            </div>

            <div className="booking-summary">
              <h4>Booking Summary</h4>
              <div style={{marginBottom: '10px'}}>
                <strong>Selected:</strong> {selected.join(', ') || 'None'}
              </div>
              <div style={{marginBottom: '10px'}}>
                <strong>Price:</strong> ₹{show.price || 100} each
              </div>
              <div style={{marginBottom: '10px'}}>
                <strong>Quantity:</strong> {selected.length}
              </div>
              <div className="total-amount">
                Total: ₹{(selected.length * (show.price || 100)).toFixed(2)}
              </div>
              <button 
                className="btn btn-success" 
                onClick={handlePay}
                disabled={selected.length === 0}
                style={{width: '100%', opacity: selected.length === 0 ? 0.5 : 1}}
              >
                {selected.length === 0 ? 'Select Seats' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeatGrid({rows, cols, booked, blocked, selected, onToggle}){
  const grid = [];
  for (let r=1;r<=rows;r++){
    const row = [];
    for (let c=1;c<=cols;c++){
      row.push({ r, c, id: `R${r}C${c}` });
    }
    grid.push(row);
  }

  return (
    <div>
      <div className="screen"></div>
      <div className="grid">
        {grid.map((row, ri) => (
          <div className="row" key={ri}>
            {row.map(s => {
              const isBooked = booked.includes(s.id);
              const isBlocked = blocked.includes(s.id);
              const isSelected = selected.includes(s.id);
              const cls = isBooked ? 'seat booked' : isSelected ? 'seat selected' : isBlocked ? 'seat blocked' : 'seat available';
              return <div key={s.id} className={cls} onClick={() => onToggle(s.r, s.c)}>{s.r}-{s.c}</div>;
            })}
          </div>
        ))}
      </div>
      
      {/* Seat Legend */}
      <div style={{marginTop: '15px', display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '0.85rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <div className="seat available" style={{margin: 0}}></div>
          <span>Available</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <div className="seat selected" style={{margin: 0}}></div>
          <span>Selected</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <div className="seat blocked" style={{margin: 0}}></div>
          <span>Blocked</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <div className="seat booked" style={{margin: 0}}></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
