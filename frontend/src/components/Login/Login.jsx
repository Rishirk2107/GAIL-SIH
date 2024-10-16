import { useState, useContext } from 'react';
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link,useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context'; // Import Context
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { updateUsername } = useContext(Context); // Extract updateUsername from context

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("User is signing in with data:", data);
    setLoading(true);
    setServerError(null);

    try {
      const { email, password } = data;

      // Special handling for admin credentials
      if (email === 'admin@gail.com' && password === 'admin@gail123') {
        console.log('Admin credentials detected');
        updateUsername('Admin'); // Update username in context if needed
        navigate('/signup'); // Redirect to admin dashboard
        return;
      }

      // Normal sign-in for other users
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Sign-in successful, navigating to OTP verification');

        // Update the username in the context after successful sign-in
        updateUsername(result.username);

        navigate('/otp'); // Redirect to OTP verification page
      } else {
        const { message } = await response.json();
        setServerError(message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setServerError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb]">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="inputBox">
            <label htmlFor="email" className="text-white">Email</label>
            <div className="flex items-center">
              <FiMail className="icon text-white mr-2" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                {...register('email')}
                className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="inputBox relative">
            <label htmlFor="password" className="text-white">Password</label>
            <div className="flex items-center">
              <RiLockPasswordLine className="icon text-white mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Password"
                {...register('password')}
                className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <AiFillEye className="text-white" /> : <AiFillEyeInvisible className="text-green-400" />}
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-red-500 text-center mt-4">{serverError}</p>}

          <div className="divBtn">
            <button
              type="submit"
              className="loginBtn w-full py-3 bg-gradient-to-r from-[#bd4b37] to-[#125151] hover:from-[#9c3f30] hover:to-[#0a3939] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'SIGN IN'}
            </button>
            <div className='dont mt-8 text-center text-gray-400'>
          <p>Are you an Admin? <Link to="/admin-create-user"><span className="text-[#bd4b37] hover:text-[#9c3f30] transition duration-300 ease-in-out">Create Users</span></Link></p>
        </div>
          </div>
        </form>

        <div className="dont mt-8 text-center text-gray-400">
        </div>
      </div>
    </div>
  );
};

export default Login;
