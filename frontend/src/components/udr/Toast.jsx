import React, { useEffect, useState } from 'react';
import './toast.css';

const Toast = ({ open, message, setOpen }) => {

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                //onClose();
                setOpen(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="toast toast-success">
            {message}
        </div>
    );
};

export default Toast;