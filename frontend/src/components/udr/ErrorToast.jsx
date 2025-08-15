import  { useEffect } from 'react';
import './toast.css';

const ErrorToast = ({ open, message, setErrorOpen }) => {

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                //onClose();
                setErrorOpen(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="toast toast-error">
            {message}
        </div>
    );
};

export default ErrorToast;