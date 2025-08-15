import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PackageBooking() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  // Try to get package id from navigation state or URL params
  const pkgId = location.state?.package?.id || params.id;

  const [pkg, setPkg] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    travelDate: '',
    specialRequest: '',
  });
  const [booking, setBooking] = useState(null);
  const [printed, setPrinted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pkgId) return;
    setLoading(true);
    axios.get(`http://localhost:3000/packages/${pkgId}`)
      .then(res => {
        setPkg(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load package details.');
        setLoading(false);
      });
  }, [pkgId]);

  if (!pkgId) {
    return <div className="text-center mt-5">No package selected. Please go back and select a package.</div>;
  }
  if (loading) {
    return <div className="text-center mt-5">Loading package details...</div>;
  }
  if (!pkg) {
    return <div className="text-center mt-5">Package not found.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.travelDate) {
      toast.warning('Please fill all required fields.');
      return;
    }
    const bookingData = {
      ...form,
      packageId: pkg.id,
      pkg_place: pkg.pkg_place,
      pkg_price: pkg.pkg_price,
      pkg_img: pkg.pkg_img,
      tot_day: pkg.tot_day,
      tot_person: pkg.tot_person,
      bookingDate: new Date().toISOString(),
      id: Date.now().toString(),
    };
    try {
      await axios.post('http://localhost:3000/package_booking', bookingData);
      setBooking(bookingData);
      toast.success('Booking successful! You can now print your receipt.');
    } catch (err) {
      toast.error('Failed to book package.');
    }
  };

  const handlePrint = async () => {
    setPrinted(true);
    window.print();
    // Send email after print
    try {
      await axios.post('http://localhost:5000/send-package-receipt', {
        email: form.email,
        name: form.name,
        packageName: pkg.pkg_place,
        travelDate: form.travelDate,
        persons: pkg.tot_person,
        price: pkg.pkg_price,
        bookingId: booking.id,
        days: pkg.tot_day,
        totalPersons: pkg.tot_person,
      });
      toast.success('Receipt sent to your email!');
    } catch (err) {
      toast.error('Failed to send receipt email.');
    }
  };

  // For images in public, use process.env.PUBLIC_URL or just "/" as prefix
  const imgSrc = pkg.pkg_img.startsWith('http') ? pkg.pkg_img : `/${pkg.pkg_img.replace(/^\/*/, '')}`;

  return (
    <div>
      <Header />
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="bookingx rounded-3 p-5">
            <h1 className="text-white mb-4">Book Package: {pkg.pkg_place}</h1>
            <div className="row mb-4">
              <div className="col-md-4 text-center">
                <img src={imgSrc} alt={pkg.pkg_place} style={{ maxWidth: 200, borderRadius: 8 }} onError={e => e.target.style.display='none'} />
              </div>
              <div className="col-md-8">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating mb-2">
                      <input type="text" className="form-control" value={pkg.pkg_place} disabled />
                      <label>Place</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-2">
                      <input type="text" className="form-control" value={pkg.pkg_price} disabled />
                      <label>Price</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-2">
                      <input type="text" className="form-control" value={pkg.tot_day} disabled />
                      <label>Days</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-2">
                      <input type="text" className="form-control" value={pkg.tot_person} disabled />
                      <label>Persons</label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-floating mb-2">
                      <textarea className="form-control" value={pkg.pkg_desc} disabled style={{height: 80}} />
                      <label>Description</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!booking ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3 text-white">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control bg-transparent" name="name" value={form.name} onChange={handleChange} required />
                      <label>Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="email" className="form-control bg-transparent" name="email" value={form.email} onChange={handleChange} required />
                      <label>Your Email</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control bg-transparent" name="mobile" value={form.mobile} onChange={handleChange} required />
                      <label>Your Mobile No.</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="date" className="form-control bg-transparent" name="travelDate" value={form.travelDate} onChange={handleChange} required />
                      <label>Travel Date</label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-floating">
                      <textarea className="form-control bg-transparent" name="specialRequest" value={form.specialRequest} onChange={handleChange} />
                      <label>Special Request</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-outline-light w-100 py-3" type="submit">Book Now</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="card shadow p-4 rounded-4 bg-light mt-4">
                <h4 className="mb-3">Package Booking Receipt</h4>
                <div className="mb-2"><strong>Booking ID:</strong> {booking.id}</div>
                <div className="mb-2"><strong>Name:</strong> {booking.name}</div>
                <div className="mb-2"><strong>Email:</strong> {booking.email}</div>
                <div className="mb-2"><strong>Mobile:</strong> {booking.mobile}</div>
                <div className="mb-2"><strong>Travel Date:</strong> {booking.travelDate}</div>
                <div className="mb-2"><strong>Package:</strong> {pkg.pkg_place}</div>
                <div className="mb-2"><strong>Price:</strong> {pkg.pkg_price}</div>
                <div className="mb-2"><strong>Days:</strong> {pkg.tot_day}</div>
                <div className="mb-2"><strong>Persons:</strong> {pkg.tot_person}</div>
                <div className="mb-2"><strong>Description:</strong> {pkg.pkg_desc}</div>
                <div className="mb-2"><strong>Special Request:</strong> {booking.specialRequest}</div>
                <div className="text-center mt-4">
                  <button className="btn btn-primary" onClick={handlePrint} disabled={printed}>
                    Print Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default PackageBooking; 