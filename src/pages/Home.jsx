import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <div className="py-4">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to Eventera</h1>
        </div>
      </div>

      <h2 className="mb-4 border-bottom pb-2">Upcoming Events</h2>
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {events.map(event => (
          <div className="col" key={event.AstronomicalEventID}>
            <div className="card h-100 shadow-sm">
              {event.Filename ? (
                 <img src={`http://localhost:8080/${event.Filename}`} className="card-img-top" alt={event.Title} style={{ height: '200px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <span>No Image</span>
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{event.Title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {new Date(event.StartDateTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h6>
                <p className="card-text flex-grow-1">
                  {event.Description && String(event.Description).substring(0, 100)}...
                </p>
                <div className="mt-auto">
                  <Link to={`/event/${event.AstronomicalEventID}`} className="btn btn-outline-primary w-100">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
