import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/AdminFeedback.css";

function AdminFeedback() {

    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });


    // =====================================================
    // TOAST
    // =====================================================

    const showToast = (message, type = "success") => {

        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: "",
                type: "success"
            });
        }, 3000);
    };


    // =====================================================
    // LOAD FEEDBACK
    // =====================================================

    useEffect(() => {

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin login required.");
            setLoading(false);
            return;
        }

        axios.get(
            "http://localhost:8080/admin/feedback",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {

            setFeedbackList(response.data);
            setLoading(false);

        })
        .catch((err) => {

            console.error(
                "Failed to load feedback:",
                err
            );

            setError("Unable to load feedback.");
            setLoading(false);

        });

    }, []);


    // =====================================================
    // DELETE MODAL
    // =====================================================

    const openDeleteModal = (feedback) => {

        setSelectedFeedback(feedback);
        setShowDeleteModal(true);

    };


    const closeDeleteModal = () => {

        if (deleteLoading) {
            return;
        }

        setShowDeleteModal(false);
        setSelectedFeedback(null);

    };


    // =====================================================
    // DELETE FEEDBACK
    // =====================================================

    const deleteFeedback = async () => {

        if (!selectedFeedback) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {

            showToast(
                "Admin login required.",
                "error"
            );

            return;
        }

        setDeleteLoading(true);

        try {

            await axios.delete(
                `http://localhost:8080/admin/feedback/${selectedFeedback.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // Remove from UI
            setFeedbackList((currentList) => {

                return currentList.filter(
                    (feedback) =>
                        feedback.id !== selectedFeedback.id
                );

            });


            setShowDeleteModal(false);
            setSelectedFeedback(null);

            showToast(
                "Feedback deleted successfully.",
                "success"
            );

        } catch (err) {

            console.error(
                "Failed to delete feedback:",
                err
            );

            showToast(
                "Unable to delete feedback.",
                "error"
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <main className="admin-feedback-root">

                <section className="admin-feedback-wrapper">

                    <div className="admin-feedback-state">

                        <div className="admin-spinner"></div>

                        <p>
                            Loading feedback...
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <main className="admin-feedback-root">

                <section className="admin-feedback-wrapper">

                    <div className="admin-feedback-state">

                        <div className="admin-state-icon">
                            ⚠️
                        </div>

                        <h2>
                            {error}
                        </h2>

                        <p>
                            Please login again to access feedback.
                        </p>

                    </div>

                </section>

            </main>
        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <main className="admin-feedback-root">

            <section className="admin-feedback-wrapper">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <header className="admin-feedback-header">

                    <div>

                        <span className="admin-feedback-eyebrow">
                            ADMIN PANEL
                        </span>

                        <h1>
                            TrackTally Feedback
                        </h1>

                        <p>
                            Review feedback submitted by TrackTally users.
                        </p>

                    </div>


                    <div className="admin-feedback-count">

                        <span>
                            Total
                        </span>

                        <strong>
                            {feedbackList.length}
                        </strong>

                    </div>

                </header>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {feedbackList.length === 0 && (

                    <div className="admin-feedback-empty">

                        <div className="admin-empty-icon">
                            💬
                        </div>

                        <h2>
                            No feedback yet
                        </h2>

                        <p>
                            User feedback will appear here when
                            someone submits the feedback form.
                        </p>

                    </div>

                )}


                {/* =================================================
                    FEEDBACK LIST
                ================================================= */}

                {feedbackList.length > 0 && (

                    <div className="admin-feedback-list">

                        {feedbackList.map((feedback) => (

                            <article
                                key={feedback.id}
                                className="admin-feedback-card"
                            >


                                {/* =================================
                                    CARD TOP
                                ================================= */}

                                <div className="admin-card-top">

                                    <div>

                                        <span className="admin-card-label">
                                            USER FEEDBACK
                                        </span>

                                        <div className="admin-rating">

                                            <span className="admin-stars">

                                                {"★".repeat(
                                                    feedback.rating || 0
                                                )}

                                                {"☆".repeat(
                                                    5 - (feedback.rating || 0)
                                                )}

                                            </span>

                                            <span className="admin-rating-number">
                                                {feedback.rating}/5
                                            </span>

                                        </div>

                                    </div>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            openDeleteModal(feedback)
                                        }
                                        aria-label="Delete feedback"
                                        title="Delete feedback"
                                    >
                                        🗑
                                    </button>

                                </div>


                                {/* =================================
                                    FEEDBACK CONTENT
                                ================================= */}

                                <div className="admin-feedback-content">


                                    <div className="admin-feedback-block">

                                        <span>
                                            GENERAL FEEDBACK
                                        </span>

                                        <p>
                                            {feedback.generalFeedback ||
                                                "No feedback provided."}
                                        </p>

                                    </div>


                                    <div className="admin-feedback-block">

                                        <span>
                                            BUG REPORT
                                        </span>

                                        <p>
                                            {feedback.bug ||
                                                "No bug reported."}
                                        </p>

                                    </div>


                                    <div className="admin-feedback-block">

                                        <span>
                                            SUGGESTION
                                        </span>

                                        <p>
                                            {feedback.suggestion ||
                                                "No suggestion provided."}
                                        </p>

                                    </div>


                                </div>


                                {/* =================================
                                    CARD FOOTER
                                ================================= */}

                                <footer className="admin-card-footer">

                                    <span>
                                        Feedback ID
                                    </span>

                                    <strong>
                                        #{feedback.id}
                                    </strong>

                                </footer>

                            </article>

                        ))}

                    </div>

                )}

            </section>


            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            {showDeleteModal && (

                <div
                    className="admin-modal-overlay"
                    onClick={closeDeleteModal}
                >

                    <div
                        className="admin-delete-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="admin-modal-icon">
                            🗑
                        </div>

                        <h2>
                            Delete feedback?
                        </h2>

                        <p>
                            This feedback will be permanently removed.
                            This action cannot be undone.
                        </p>

                        <div className="admin-modal-id">
                            Feedback #{selectedFeedback?.id}
                        </div>


                        <div className="admin-modal-actions">

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="admin-confirm-button"
                                onClick={deleteFeedback}
                                disabled={deleteLoading}
                            >

                                {deleteLoading
                                    ? "Deleting..."
                                    : "Delete"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                TOAST
            ===================================================== */}

            {toast.show && (

                <div
                    className={`admin-toast ${
                        toast.type === "error"
                            ? "admin-toast-error"
                            : "admin-toast-success"
                    }`}
                >

                    <span className="admin-toast-icon">

                        {toast.type === "error"
                            ? "!"
                            : "✓"
                        }

                    </span>

                    <span>
                        {toast.message}
                    </span>

                </div>

            )}

        </main>
    );
}

export default AdminFeedback;