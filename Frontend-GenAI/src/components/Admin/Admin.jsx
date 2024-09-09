import { useState } from 'react';

const AdminPortal = () => {
  const [pdf, setPdf] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', pdf);

    try {
      const response = await fetch('http://localhost:3001/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus('Error uploading PDF');
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-[#125151] via-[#187eb9] to-[#0a6e62] font-verdana text-white">
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 flex items-center space-x-2 hover:text-gray-300 transition duration-300 ease-in-out"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png"
          alt="Gmail"
          className="w-8 h-8 border-2 bg-black rounded-full border-black transition-transform duration-300 ease-in-out"
        />
        <p className="text-black font-roboto">Gmail</p>
      </a>
      <div className="bg-[#000000] bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h1 className="text-3xl font-extrabold mb-6 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#c04934] to-[#17bbbb] animate-pulse">
          Admin Portal  
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <div className="inputBox">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 mt-2 text-gray-900 bg-gray-200 bg-opacity-90 border border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-[#bd4b37] focus:ring-opacity-50 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 mt-4 rounded-lg bg-gradient-to-r from-[#208a4f] to-[#0d9d36] hover:from-[#3f8a1d] transition duration-300 ease-in-out flex items-center justify-center"
          >
            Upload File 
          </button>
        </form>
        {status && <p className="mt-4 text-red-500">{status}</p>}
      </div>
    </div>
  );
};

export default AdminPortal;
