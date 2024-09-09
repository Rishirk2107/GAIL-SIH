import { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const UserProfile = () => {
    const { userProfile, updateUserProfile } = useContext(Context);
    const [profileData, setProfileData] = useState(userProfile);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile(profileData); // Update context with new profile data
        alert('Profile updated successfully!');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
            <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb] ">
                    User Profile
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.keys(profileData).map((key) => (
                            <div key={key} className="inputBox">
                                <input
                                    type="text"
                                    placeholder={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                    name={key}
                                    value={profileData[key]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#208a4f] to-[#0d9d36] hover:from-[#3f8a1d] transition duration-300 ease-in-out flex items-center justify-center"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
