import React, { useState, useEffect } from "react";

export function PaidVotingModal({ freeVotesLeft }) {
  const [showModal, setShowModal] = useState(false);

  // Whenever freeVotesLeft changes, check if it's zero
  useEffect(() => {
    if (freeVotesLeft === 0) {
      setShowModal(true);
    }
  }, [freeVotesLeft]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleProceedToPayment = () => {
    console.log("Redirect to payment gateway here...");
    // Example:
    // navigate("/checkout");
    // or call your backend to start a payment session
  };

  if (!showModal) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>Free Votes Exhausted</h2>
        <p style={{ marginBottom: "20px" }}>
          You’ve used all your free votes. Want to continue voting?  
          Purchase paid votes to support your favorite contestant!
        </p>
        <button
          onClick={handleProceedToPayment}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Buy Votes
        </button>
        <button
          onClick={handleClose}
          style={{
            backgroundColor: "#ccc",
            color: "#333",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

