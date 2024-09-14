import { useContext, useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context'; // Ensure this is the correct path
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; 
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; // Import the default CSS for react-toastify

const OtpVerification = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(Context); // Access login method from context
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // Timer set for 5 minutes (300 seconds)
  const [timerActive, setTimerActive] = useState(true); // To control timer status

  useEffect(() => {
    let timerInterval;
    if (timerActive && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer <= 0) {
      toast.error('OTP has expired. Please request a new OTP.', {
        className: 'bg-red-600 text-white border border-red-700 shadow-lg rounded-lg',
        bodyClassName: 'text-base font-semibold',
        progressClassName: 'bg-red-400'
      }); // Toast for expired OTP
      setTimerActive(false); // Stop the timer
    }
    return () => clearInterval(timerInterval);
  }, [timer, timerActive]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (timer <= 0) return; // Do not submit if OTP has expired

    setLoading(true); // Show loading state
    setError(''); // Clear any previous error messages

    try {
      const response = await fetch('http://localhost:3001/auth/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }), // Send OTP as JSON to backend
      });

      const data = await response.json(); // Parse the JSON response from the server
      if (response.ok) {
        toast.success('OTP verified successfully!', {
          className: 'bg-green-600 text-white border border-green-700 shadow-lg rounded-lg',
          bodyClassName: 'text-base font-semibold',
          progressClassName: 'bg-green-500'
        }); // Success toast
        setTimeout(() => {
          handleLogin(data.email, ''); // Call the login function from the context
          navigate('/chatbot'); // Redirect the user to the chatbot page after the toast
        }, 2000); // Delay redirect to allow toast to show
      } else {
        toast.error(data.message || 'Invalid OTP. Please try again.', {
          className: 'bg-red-600 text-white border border-red-700 shadow-lg rounded-lg',
          bodyClassName: 'text-base font-semibold',
          progressClassName: 'bg-red-400'
        }); // Error toast if verification fails
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast.error('Internal server error', {
        className: 'bg-red-600 text-white border border-red-700 shadow-lg rounded-lg',
        bodyClassName: 'text-base font-semibold',
        progressClassName: 'bg-red-400'
      }); // Display an error toast if the request fails
    } finally {
      setLoading(false); // Hide the loading state
    }
  };

  // Convert seconds to MM:SS format for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white"> 
      {/* Header with 2FA icon and new heading at the top of the page */}
      <header className="w-full py-6 bg-opacity-90 bg-[#000] shadow-md text-center flex justify-center items-center fixed top-0 left-0 z-50">
        <SecurityOutlinedIcon className="mr-2 text-white" fontSize="large" />
        <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb]">
          Two-Factor Authentication
        </h1>
      </header>
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb]">
          OTP Verification
        </h2>
        {error && <div className="bg-red-700 text-white px-4 py-2 rounded mb-4">{error}</div>}
        <p className="text-white mb-4">Time remaining: {formatTime(timer)}</p> {/* Timer display */}
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
          <button
            type="submit"
            className={`w-full py-3 bg-gradient-to-r from-[#bd4b37] to-[#125151] hover:from-[#9c3f30] hover:to-[#0a3939] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading || timer <= 0} // Disable button if OTP expired
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    // Add functionality to handle OTP resend here
    setTimer(300); // Reset the timer to 5 minutes
    setTimerActive(true); // Reactivate the timer
    toast.info('OTP resent successfully!', {
      className: 'bg-blue-600 text-white border border-blue-700 shadow-lg rounded-lg',
      bodyClassName: 'text-base font-semibold',
      progressClassName: 'bg-blue-400',
    });
  }}
  className={`block w-full text-center mt-4 text-sm font-semibold text-black bg-gradient-to-r from-[#2db495] to-[#0b8181] hover:from-[#1c6d61] hover:to-[#0a6e62] transition duration-300 ease-in-out px-4 py-2 rounded-lg ${loading || timer > 0 ? 'pointer-events-none bg-gray-500' : ''}`}
>
  Resend OTP
</a>

        </form>
      </div>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default OtpVerification;
