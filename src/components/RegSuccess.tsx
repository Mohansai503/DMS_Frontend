import React from "react";
import { useNavigate } from "react-router-dom"; 

const RegSuccess = () => {
  const navigate = useNavigate(); 
  const handleContinueClick = () => {
    navigate("/login"); 
}
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#eef7f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: 380,
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "40px 30px 30px",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Checkmark circle */}
        <div
          style={{
            width: 96,
            height: 96,
            backgroundColor: "#4CAF50",
            borderRadius: "50%",
            margin: "0 auto 25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontWeight: "700",
            fontSize: 22,
            marginBottom: 10,
            color: "#000",
          }}
        >
          Success
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 15,
            color: "#333",
            marginBottom: 30,
            lineHeight: 1.4,
          }}
        >
          Congratulation, Your account has been created successfully
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#ddd",
            marginBottom: 30,
          }}
        ></div>

        {/* Continue Button */}
        <button
          style={{
            backgroundColor: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "12px 40px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(37, 99, 235, 0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1E40AF")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563EB")
          }
          onClick={handleContinueClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RegSuccess;
