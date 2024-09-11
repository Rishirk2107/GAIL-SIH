import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        console.log('OTP verified successfully');
        navigate('/chatbot'); // Redirect to the chatbot page
      } else {
        const { message } = await response.json();
        setError(message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb]">
          OTP Verification
        </h2>
        
        {/* Error Alert */}
        {error && <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="inputBox">
            <label htmlFor="otp" className="text-white">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-gradient-to-r from-[#bd4b37] to-[#125151] hover:from-[#9c3f30] hover:to-[#0a3939] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
