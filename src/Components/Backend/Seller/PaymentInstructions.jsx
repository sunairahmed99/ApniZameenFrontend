import { usePaymentInfo } from '../../../hooks/usePaymentInfo';
import { FaInfoCircle } from 'react-icons/fa';

const PaymentInstructions = () => {
    const { data: instructions = [], isLoading: loading } = usePaymentInfo();

    if (loading) return <div className="spinner-border spinner-border-sm text-primary" role="status"><span className="visually-hidden">Loading...</span></div>;

    if (instructions.length === 0) {
        return (
            <div className="alert alert-info py-2 mb-3">
                <p className="mb-0 small fw-bold text-muted italic">
                    <FaInfoCircle className="me-2" />
                    Please transfer the amount to the official account and upload receipt below.
                </p>
            </div>
        );
    }

    return (
        <div className="alert alert-info py-2 mb-3">
            <h6 className="alert-heading small fw-bold mb-2">
                <FaInfoCircle className="me-2" />
                Payment Instructions:
            </h6>
            {instructions.map((info, idx) => (
                <p key={info._id} className={`mb-${idx === instructions.length - 1 ? '0' : '1'} small fw-bold`}>
                    • {info.text}
                </p>
            ))}
        </div>
    );
};

export default PaymentInstructions;
