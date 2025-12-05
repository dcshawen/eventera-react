import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const PurchaseTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    ticketCount: 1,
    purchaserName: '',
    purchaserEmail: '',
    purchaserPhone: '',
    purchaserStreetNo: '',
    purchaserStreetName: '',
    purchaserCity: '',
    purchaserProvince: '',
    purchaserPostalCode: '',
    purchaserCountry: '',
    creditNumber: '',
    expDate: '',
    creditKey: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event", err);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.purchaserName) newErrors.purchaserName = 'Name is required';
    
    if (!formData.purchaserEmail) newErrors.purchaserEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.purchaserEmail)) newErrors.purchaserEmail = 'Email is invalid';
    
    if (!formData.purchaserPhone) newErrors.purchaserPhone = 'Phone is required';
    
    if (!formData.purchaserStreetNo) newErrors.purchaserStreetNo = 'Street No is required';
    if (!formData.purchaserStreetName) newErrors.purchaserStreetName = 'Street Name is required';
    if (!formData.purchaserCity) newErrors.purchaserCity = 'City is required';
    if (!formData.purchaserProvince) newErrors.purchaserProvince = 'Province is required';
    if (!formData.purchaserPostalCode) newErrors.purchaserPostalCode = 'Postal Code is required';
    if (!formData.purchaserCountry) newErrors.purchaserCountry = 'Country is required';

    if (!formData.creditNumber) newErrors.creditNumber = 'Credit Card Number is required';
    else if (!/^\d{16}$/.test(formData.creditNumber.replace(/\s/g, ''))) newErrors.creditNumber = 'Invalid Credit Card Number (16 digits)';

    if (!formData.expDate) newErrors.expDate = 'Expiry Date is required';
    else {
        const today = new Date();
        const exp = new Date(formData.expDate);
        if (exp < today) newErrors.expDate = 'Card has expired';
    }

    if (!formData.creditKey) newErrors.creditKey = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.creditKey)) newErrors.creditKey = 'Invalid CVV';

    if (formData.ticketCount < 1) newErrors.ticketCount = 'At least one ticket is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage(null);

    try {
      // We will send one request per ticket if count > 1, or just one request if the backend handles it.
      // Since we don't know if the backend handles bulk, and the model is singular Ticket,
      // we will assume for this exercise that we are creating a ticket record.
      // If the user asked for "number of tickets", we might need to loop.
      // Let's try to loop and send N requests if count > 1, to be safe and actually fulfill the "number of tickets" requirement logically.
      
      const count = parseInt(formData.ticketCount);
      const requests = [];

      for (let i = 0; i < count; i++) {
        const payload = {
            AstronomicalEventId: parseInt(eventId),
            PurchaserName: formData.purchaserName,
            PurchaseDateTime: new Date().toISOString(),
            CreditNumber: formData.creditNumber,
            ExpDate: formData.expDate,
            CreditKey: formData.creditKey,
            PurchaserEmail: formData.purchaserEmail,
            PurchaserPhone: formData.purchaserPhone,
            PurchaserStreetNo: formData.purchaserStreetNo,
            PurchaserStreetName: formData.purchaserStreetName,
            PurchaserCity: formData.purchaserCity,
            PurchaserProvince: formData.purchaserProvince,
            PurchaserPostalCode: formData.purchaserPostalCode,
            PurchaserCountry: formData.purchaserCountry
        };
        requests.push(api.post('/events', payload));
      }

      await Promise.all(requests);

      setMessage({ type: 'success', text: `Successfully purchased ${count} ticket(s)!` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to purchase ticket(s). Please check your details and try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (message && message.type === 'success') {
    return (
      <div className="container mt-5">
        <div className="alert alert-success">
          <h4>Success!</h4>
          <p>{message.text}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2>Purchase Ticket {event ? `for ${event.title}` : ''}</h2>
      
      {message && message.type === 'error' && (
        <div className="alert alert-danger">{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="needs-validation">
        
        <div className="card mb-4">
            <div className="card-header">Order Details</div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Event ID</label>
                    <input type="text" className="form-control" value={eventId} readOnly disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label">Number of Tickets</label>
                    <input 
                        type="number" 
                        className={`form-control ${errors.ticketCount ? 'is-invalid' : ''}`}
                        name="ticketCount" 
                        value={formData.ticketCount} 
                        onChange={handleChange} 
                        min="1"
                    />
                    {errors.ticketCount && <div className="invalid-feedback">{errors.ticketCount}</div>}
                </div>
            </div>
        </div>

        <div className="card mb-4">
            <div className="card-header">Customer Contact Details</div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.purchaserName ? 'is-invalid' : ''}`}
                        name="purchaserName" 
                        value={formData.purchaserName} 
                        onChange={handleChange} 
                    />
                    {errors.purchaserName && <div className="invalid-feedback">{errors.purchaserName}</div>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className={`form-control ${errors.purchaserEmail ? 'is-invalid' : ''}`}
                            name="purchaserEmail" 
                            value={formData.purchaserEmail} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserEmail && <div className="invalid-feedback">{errors.purchaserEmail}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input 
                            type="tel" 
                            className={`form-control ${errors.purchaserPhone ? 'is-invalid' : ''}`}
                            name="purchaserPhone" 
                            value={formData.purchaserPhone} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserPhone && <div className="invalid-feedback">{errors.purchaserPhone}</div>}
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Street No</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserStreetNo ? 'is-invalid' : ''}`}
                            name="purchaserStreetNo" 
                            value={formData.purchaserStreetNo} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserStreetNo && <div className="invalid-feedback">{errors.purchaserStreetNo}</div>}
                    </div>
                    <div className="col-md-8 mb-3">
                        <label className="form-label">Street Name</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserStreetName ? 'is-invalid' : ''}`}
                            name="purchaserStreetName" 
                            value={formData.purchaserStreetName} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserStreetName && <div className="invalid-feedback">{errors.purchaserStreetName}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">City</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserCity ? 'is-invalid' : ''}`}
                            name="purchaserCity" 
                            value={formData.purchaserCity} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserCity && <div className="invalid-feedback">{errors.purchaserCity}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Province</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserProvince ? 'is-invalid' : ''}`}
                            name="purchaserProvince" 
                            value={formData.purchaserProvince} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserProvince && <div className="invalid-feedback">{errors.purchaserProvince}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Postal Code</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserPostalCode ? 'is-invalid' : ''}`}
                            name="purchaserPostalCode" 
                            value={formData.purchaserPostalCode} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserPostalCode && <div className="invalid-feedback">{errors.purchaserPostalCode}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Country</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.purchaserCountry ? 'is-invalid' : ''}`}
                            name="purchaserCountry" 
                            value={formData.purchaserCountry} 
                            onChange={handleChange} 
                        />
                        {errors.purchaserCountry && <div className="invalid-feedback">{errors.purchaserCountry}</div>}
                    </div>
                </div>
            </div>
        </div>

        <div className="card mb-4">
            <div className="card-header">Payment Details</div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Credit Card Number</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.creditNumber ? 'is-invalid' : ''}`}
                        name="creditNumber" 
                        value={formData.creditNumber} 
                        onChange={handleChange} 
                        placeholder="16 digits"
                    />
                    {errors.creditNumber && <div className="invalid-feedback">{errors.creditNumber}</div>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Expiry Date</label>
                        <input 
                            type="date" 
                            className={`form-control ${errors.expDate ? 'is-invalid' : ''}`}
                            name="expDate" 
                            value={formData.expDate} 
                            onChange={handleChange} 
                        />
                        {errors.expDate && <div className="invalid-feedback">{errors.expDate}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">CVV (Credit Key)</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.creditKey ? 'is-invalid' : ''}`}
                            name="creditKey" 
                            value={formData.creditKey} 
                            onChange={handleChange} 
                            placeholder="3 or 4 digits"
                        />
                        {errors.creditKey && <div className="invalid-feedback">{errors.creditKey}</div>}
                    </div>
                </div>
            </div>
        </div>

        <button type="submit" className="btn btn-success btn-lg w-100" disabled={loading}>
          {loading ? 'Processing...' : 'Purchase Tickets'}
        </button>
      </form>
    </div>
  );
};

export default PurchaseTicket;
