import { useState } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// Validation schema
const schema = yup.object().shape({
  fullname: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[\W_]/, 'Password must contain a special character')
    .required('Password is required'),
});

const AdminSignup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Admin is creating a user with data:", data);
    setLoading(true);
    setServerError(null);
    
    try {
      const response = await fetch('http://localhost:3001/auth/signup', { // Adjust endpoint for admin action
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('User created successfully');
        navigate('/'); // Redirect to admin dashboard or another appropriate page
      } else {
        const { message } = await response.json();
        setServerError(message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during user creation:', error);
      setServerError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb] ">
           Create User
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name Field */}
          <div className="inputBox">
            <label htmlFor="fullname" className="text-white">Full Name</label>
            <div className="flex items-center">
              <AiOutlineUser className='icon text-white mr-2' />
              <input
                type='text'
                name="fullname"
                id="fullname"
                placeholder='Full Name'
                {...register('fullname')}
                className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
              />
            </div>
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
          </div>

          {/* Email Field */}
          <div className="inputBox">
            <label htmlFor="email" className="text-white">Email</label>
            <div className="flex items-center">
              <FiMail className='icon text-white mr-2' />
              <input
                type="email"
                name="email"
                id="email"
                placeholder='Email'
                {...register('email')}
                className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="inputBox relative">
            <label htmlFor="password" className="text-white">Password</label>
            <div className="flex items-center">
              <RiLockPasswordLine className='icon text-white mr-2' />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder='Password'
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

          {/* Server error display */}
          {serverError && <p className="text-red-500 text-center mt-4">{serverError}</p>}

          {/* Submit Button */}
          <div className='divBtn'>
            <button type="submit" className='loginBtn w-full py-3 bg-gradient-to-r from-[#bd4b37] to-[#125151] hover:from-[#9c3f30] hover:to-[#0a3939] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg' disabled={loading}>
              {loading ? 'Creating User...' : 'CREATE USER'}
            </button>
          </div>
        </form>

        <div className='dont mt-8 text-center text-gray-400'>
          <p>Want to manage users? <Link to="/admin-dashboard"><span className="text-[#bd4b37] hover:text-[#9c3f30] transition duration-300 ease-in-out">Go to Dashboard</span></Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
