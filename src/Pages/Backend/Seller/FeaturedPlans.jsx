import { useAgencyPlans, useUpgradeAgency } from '../../../hooks/useAgencies';

const FeaturedPlans = ({ agencyId, onUpgrade }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);

    const { data: plans = [] } = useAgencyPlans();
    const upgradeAgencyMutation = useUpgradeAgency();
    const loading = upgradeAgencyMutation.isPending;

    const handleFileChange = (e) => {
        setPaymentFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedPlan || !paymentFile) {
            alert("Please select a plan and upload a payment screenshot.");
            return;
        }

        const data = new FormData();
        data.append('agencyId', agencyId);
        data.append('planId', selectedPlan._id);
        data.append('paymentImage', paymentFile);

        try {
            await upgradeAgencyMutation.mutateAsync({ upgradeData: data });
            alert('Request Submitted! Admin will review your payment.');
            onUpgrade(); // Close modal
        } catch (err) {
            
            alert('Failed to submit request');
        }
    };

    return (
        <div className="mt-2">
            <h3>Boost Your Agency Visibility</h3>
            <p className="text-muted">Select a plan and upload your payment proof to get featured.</p>

            <div className="row mb-4">
                {plans.map(plan => (
                    <div className="col-md-4 mb-3" key={plan._id}>
                        <div
                            className={`card h-100 ${selectedPlan?._id === plan._id ? 'border-primary bg-light shadow' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body text-center">
                                <h5>{plan.name}</h5>
                                <h2 className="text-primary">Rs {plan.price.toLocaleString()}</h2>
                                <p>{plan.durationInDays} Days Coverage</p>
                                <p className="small">{plan.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className="border p-3 rounded bg-white">
                    <h5>Selected: {selectedPlan.name} (Rs {selectedPlan.price})</h5>
                    <PaymentInstructions />
                    <div className="mb-3 mt-3">
                        <label className="form-label">Upload Payment Screenshot</label>
                        <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <div className="text-end">
                        <button className="btn btn-warning" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Payment Proof'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturedPlans;
