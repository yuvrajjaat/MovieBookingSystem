import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../../lib/api';
import Link from 'next/link';

export default function CinemaPage() {
  const router = useRouter();
  const { id } = router.query;
  const [shows, setShows] = useState([]);

  useEffect(() => {
    if (!id) return;
    API.get(`/cinemas/${id}/screens/shows`).then(res => setShows(res.data));
  }, [id]);

  const grouped = shows.reduce((acc, s) => {
    const mid = s.Movie.id;
    acc[mid] = acc[mid] || { movie: s.Movie, shows: [] };
    acc[mid].shows.push(s);
    return acc;
  }, {});

  return (
    <div className="container">
      <Link href="/"><button className="btn">Back</button></Link>
      <h3>Movies & Showtimes</h3>
      {Object.values(grouped).map(g => (
        <div key={g.movie.id} className="movie-card">
          <strong>{g.movie.title}</strong>
          <div>{g.movie.description}</div>
          <div style={{marginTop: '15px'}}>
            {g.shows.map(sh => (
              <Link key={sh.id} href={`/show/${sh.id}`}>
                <button className="show-btn">
                  {new Date(sh.startTime).toLocaleString()} • ₹{sh.price}
                </button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
