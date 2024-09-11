import { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineUserAdd } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [ setNewUserId] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const navigate = useNavigate();

  // Fetch users created by the admin
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create user handler
  const handleCreateUser = async () => {
    setCreatingUser(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: 'New User', // Replace with actual data
          email: 'newuser@example.com', // Replace with actual data
          password: 'Password123!', // Replace with actual data
        }),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();
      setNewUserId(data.userId);
      setUsers((prevUsers) => [...prevUsers, data.user]); // Add new user to list
      setSuccess('User created successfully with ID: ' + data.userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-3xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb]">
          Admin Dashboard
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full table-auto text-center">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-white">Name</th>
                <th className="p-4 text-white">Email</th>
                <th className="p-4 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-500">
                  <td className="p-4">{user.fullname}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleCreateUser}
            className="loginBtn w-full py-3 bg-gradient-to-r from-[#bd4b37] to-[#125151] hover:from-[#9c3f30] hover:to-[#0a3939] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            disabled={creatingUser}
          >
            <AiOutlineUserAdd className="inline mr-2" />
            {creatingUser ? 'Creating User...' : 'Add New User'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/chatbot')}
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#125151] to-[#17bbbb] hover:from-[#0a3939] hover:to-[#0a6e62] text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Chat with Chatbot
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
