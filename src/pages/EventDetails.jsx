import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event) return <div className="alert alert-warning">Event not found.</div>;

	console.log(event.Filename);

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          {event.Filename ? (
            <img 
              src={event.Filename.startsWith('/') ? event.Filename : `http://localhost:8080/${event.Filename}`} 
              className="img-fluid rounded-start" 
              alt={event.Title} 
            />
          ) : (
            <div className="bg-secondary text-white d-flex align-items-center justify-content-center h-100">
              No Image
            </div>
          )}
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h2 className="card-title">{event.Title}</h2>
            <h5 className="text-muted">{new Date(event.StartDateTime).toLocaleString()}</h5>
            <p className="card-text"><strong>Location:</strong> {event.Location}</p>
            <p className="card-text">{event.Description}</p>
            {event.Category && (
                <p className="card-text"><small className="text-muted">Category: {event.Category.Title}</small></p>
            )}
            <Link to="/" className="btn btn-outline-secondary btn-lg mt-3 ms-2">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
