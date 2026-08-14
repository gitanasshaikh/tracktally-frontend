import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Feedback() {

    const navigate = useNavigate();

    const { showToast } = useToast();

    const [rating, setRating] = useState(0);

    const [feedback, setFeedback] =
        useState("");

    const [bug, setBug] =
        useState("");

    const [suggestion, setSuggestion] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    // ========================================
    // SUBMIT FEEDBACK
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (rating === 0) {

            showToast(
                "Please select a rating",
                "error"
            );

            return;
        }

        setSubmitting(true);

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/feedback`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        rating: rating,

                        generalFeedback:
                            feedback,

                        bug:
                            bug,

                        suggestion:
                            suggestion

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to submit feedback"
                );

            }


            showToast(
                "Feedback submitted successfully 💜",
                "success"
            );


            setRating(0);
            setFeedback("");
            setBug("");
            setSuggestion("");


        } catch (error) {

            console.error(
                "Feedback submission error:",
                error
            );

            showToast(
                "Failed to submit feedback",
                "error"
            );


        } finally {

            setSubmitting(false);

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="feedback-page">

            <div className="feedback-card">

                <div className="feedback-header">

                    <span className="feedback-eyebrow">
                        YOUR FEEDBACK
                    </span>

                    <h2>
                        Help us improve TrackTally 💜
                    </h2>

                    <p>
                        Your feedback helps us find bugs,
                        improve features and make TrackTally better.
                    </p>

                </div>


                <form
                    className="feedback-form"
                    onSubmit={handleSubmit}
                >

                    {/* RATING */}

                    <div className="feedback-field">

                        <label>
                            How was your experience?
                        </label>

                        <div className="rating-options">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating
                                                ? "rating-star active"
                                                : "rating-star"
                                        }
                                        onClick={() =>
                                            setRating(star)
                                        }
                                        aria-label={
                                            `${star} star`
                                        }
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* GENERAL FEEDBACK */}

                    <div className="feedback-field">

                        <label htmlFor="feedback">
                            General Feedback
                        </label>

                        <textarea
                            id="feedback"
                            placeholder="Tell us what you liked or what we can improve..."
                            value={feedback}
                            onChange={(e) =>
                                setFeedback(
                                    e.target.value
                                )
                            }
                            maxLength={1000}
                            rows={5}
                        />

                        <small>
                            {feedback.length}/1000
                        </small>

                    </div>


                    {/* BUG */}

                    <div className="feedback-field">

                        <label htmlFor="bug">
                            Did you find any bug?
                        </label>

                        <textarea
                            id="bug"
                            placeholder="Describe the bug you found..."
                            value={bug}
                            onChange={(e) =>
                                setBug(
                                    e.target.value
                                )
                            }
                            maxLength={1000}
                            rows={4}
                        />

                        <small>
                            {bug.length}/1000
                        </small>

                    </div>


                    {/* SUGGESTION */}

                    <div className="feedback-field">

                        <label htmlFor="suggestion">
                            Any suggestion?
                        </label>

                        <textarea
                            id="suggestion"
                            placeholder="What feature would you like to see?"
                            value={suggestion}
                            onChange={(e) =>
                                setSuggestion(
                                    e.target.value
                                )
                            }
                            maxLength={1000}
                            rows={4}
                        />

                        <small>
                            {suggestion.length}/1000
                        </small>

                    </div>


                    {/* BUTTONS */}

                    <div className="feedback-actions">

                        <button
                            type="button"
                            className="feedback-cancel-button"
                            onClick={() =>
                                navigate(-1)
                            }
                            disabled={submitting}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="feedback-submit-button"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Sending..."
                                : "Send Feedback 💜"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default Feedback;