import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {

        setToast({
            message,
            type
        });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };


    return (
        <ToastContext.Provider value={{ showToast }}>

            {children}

            {toast && (
                <div className={`toast toast-${toast.type}`}>

                    <span className="toast-icon">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>

                    <span>
                        {toast.message}
                    </span>

                </div>
            )}

        </ToastContext.Provider>
    );
}


export function useToast() {
    return useContext(ToastContext);
}