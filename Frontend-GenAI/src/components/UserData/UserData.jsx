import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const UserData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log("User Data Submitted:", data);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('User data saved successfully');
        navigate('/chatbot'); // Redirect to chatbot page
      } else {
        console.error('Error saving user data');
      }
    } catch (error) {
      console.error('Error during data submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/chatbot');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb] ">
          Fill Your Details
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              {/* Group Taken in 12th Std */}
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Group Taken in 12th Std"
                  {...register('group')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* Physics Mark */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="Physics Mark"
                  {...register('physics')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* Chemistry Mark */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="Chemistry Mark"
                  {...register('chemistry')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>

            <div>
              {/* Maths Mark (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="Maths Mark (Optional)"
                  {...register('maths')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* Biology Mark (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="Biology Mark (Optional)"
                  {...register('biology')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* JEE Mains Mark */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="JEE Mains Mark"
                  {...register('jeeMains')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>

            <div>
              {/* 10th Std Percentage */}
              <div className="inputBox">
                <input
                  type="number"
                  step="0.01"
                  placeholder="10th Std Percentage"
                  {...register('tenthPercentage')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* 12th Std Percentage */}
              <div className="inputBox">
                <input
                  type="number"
                  step="0.01"
                  placeholder="12th Std Percentage"
                  {...register('twelfthPercentage')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>

              {/* Government Exams Undertaken (Optional) */}
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Government Exams Undertaken "
                  {...register('govtExams')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              {/* BITSAT Score (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="BITSAT Score (Optional)"
                  {...register('bitsatScore')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>

            <div>
              {/* JEE Advanced AIR (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="JEE Advanced AIR (Optional)"
                  {...register('jeeAdvancedAIR')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>

            <div>
              {/* MET Exam Marks (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="MET Exam Marks (Optional)"
                  {...register('metMarks')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              {/* Total Parental Income (Optional) */}
              <div className="inputBox">
                <input
                  type="number"
                  placeholder="Total Parental Income (Optional)"
                  {...register('parentalIncome')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>
            <div>
              {/* Preferred Stream of Study */}
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Preferred Stream of Study"
                  {...register('preferredStream')}
                  className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#b6412d] to-[#9d120d] hover:from-[#af2828] transition duration-300 ease-in-out"
            >
              Skip for now , Parent/Others 
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#208a4f] to-[#0d9d36] hover:from-[#3f8a1d] transition duration-300 ease-in-out flex items-center justify-center"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'I am a Student , Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserData;
