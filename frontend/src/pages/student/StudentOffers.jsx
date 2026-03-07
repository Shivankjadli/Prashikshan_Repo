import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { offerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Gift } from 'lucide-react';

export default function StudentOffers() {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState(null);

  const load = () => {
    offerAPI.getMyOffers()
      .then(r => setOffers(r.data.offers || []))
      .catch(() => toast.error('Failed to load offers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const respond = async (offerId, response) => {
    setActing(offerId + response);
    try {
      await offerAPI.respond(offerId, response);
      toast.success(`Offer ${response}!`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActing(null);
    }
  };

  return (
    <DashboardLayout title="My Offers">
      <div className="page-header">
        <h1>Offer Letters</h1>
        <p>Review and respond to job offers</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : offers.length === 0 ? (
        <div className="empty-state"><Gift /><h3>No offers received yet</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {offers.map(offer => (
            <div className="card" key={offer._id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold" style={{ fontSize: '1.05rem' }}>{offer.jobId?.title}</h3>
                  <p className="text-sm text-muted">{offer.jobId?.company}</p>
                </div>
                <StatusBadge status={offer.status} />
              </div>

              <div className="grid-3 gap-3 mb-4">
                <Info label="Package" value={`₹${offer.package} LPA`} />
                <Info label="Joining Date" value={new Date(offer.joiningDate).toLocaleDateString()} />
                <Info label="Issued On" value={new Date(offer.issuedAt).toLocaleDateString()} />
              </div>

              <div className="flex items-center gap-3">
                {offer.offerLetterUrl && (
                  <a href={offer.offerLetterUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    📄 View Offer Letter
                  </a>
                )}
                {offer.status === 'pending' && (
                  <>
                    <button className="btn btn-success btn-sm"
                      disabled={acting === offer._id + 'accepted'}
                      onClick={() => respond(offer._id, 'accepted')}>
                      {acting === offer._id + 'accepted' ? <span className="spinner" /> : '✓ Accept'}
                    </button>
                    <button className="btn btn-danger btn-sm"
                      disabled={acting === offer._id + 'rejected'}
                      onClick={() => respond(offer._id, 'rejected')}>
                      {acting === offer._id + 'rejected' ? <span className="spinner" /> : '✗ Reject'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function StatusBadge({ status }) {
  const map = { pending: 'badge-warning', accepted: 'badge-success', rejected: 'badge-danger' };
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
}

function Info({ label, value }) {
  return (
    <div style={{ background: 'var(--bg-glass)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
      <div className="text-xs text-muted">{label}</div>
      <div className="font-semibold text-sm mt-1">{value}</div>
    </div>
  );
}
