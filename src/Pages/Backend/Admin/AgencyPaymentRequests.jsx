import React from 'react';
import PaymentRequests from './PaymentRequests'; // path relative to where I put it. I put PaymentRequests in Admin root, but putting these wrappers in Agencies/etc is confusing. I'll put them in Admin root or a new folder.

// Wait, I put PaymentRequests in src/Pages/Backend/Admin/PaymentRequests.jsx
// I should put these wrappers there too or organize better.
// I'll put them in src/Pages/Backend/Admin/Payments/ folder if possibly, or just Admin root.
// Let's stick to Admin root for now ease.

const AgencyPaymentRequests = () => {
    return <PaymentRequests category="agency" title="Agency Payment Requests" />;
};

export default AgencyPaymentRequests;
