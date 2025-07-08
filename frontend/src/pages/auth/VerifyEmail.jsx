// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("Invalid or missing verification token.");
        return;
      }

      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/auth/verify-email?token=${token}`
        );

        if (res.data.success) {
          toast.success(res.data.message);
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("Verification failed. Please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong during verification.");
        setStatus("Verification failed.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[80vh] text-xl font-medium">
      {status}
    </div>
  );
};

export default VerifyEmail;
