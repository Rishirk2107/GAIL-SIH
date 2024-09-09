
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import the Chart.js library

// Import the image from assets
import { assets } from '../../assets/assets'; // Adjust the path as needed

// Data for colleges in Rajasthan
const collegeData = [
  {
    name: 'Birla Institute of Technology and Science (BITS), Pilani',
    rank: 1,
    placementRecord: '95%',
    hostelLife: 'Excellent',
    feeStructure: 500000
  },
  {
    name: 'Malaviya National Institute of Technology (MNIT), Jaipur',
    rank: 2,
    placementRecord: '90%',
    hostelLife: 'Very Good',
    feeStructure: 150000
  },
  {
    name: 'Indian Institute of Technology (IIT), Jodhpur',
    rank: 3,
    placementRecord: '85%',
    hostelLife: 'Very Good',
    feeStructure: 250000
  },
  {
    name: 'Manipal University, Jaipur',
    rank: 4,
    placementRecord: '80%',
    hostelLife: 'Good',
    feeStructure: 200000
  },
  {
    name: 'Rajasthan Technical University (RTU), Kota',
    rank: 5,
    placementRecord: '70%',
    hostelLife: 'Good',
    feeStructure: 100000
  }
];

// Bar chart data for fee structure
const feeChartData = {
  labels: collegeData.map((college) => college.name),
  datasets: [
    {
      label: 'Fee Structure (INR)',
      data: collegeData.map((college) => college.feeStructure),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

const Graph = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#276e62] to-[#0c3a35]   p-8">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-8">
        College of Engineering and Technology, Udaipur
      </h1>
      
      {/* Display Image from Assets */}
      <div className="mb-8 ">
        <img 
          src={assets.graph_icon} // Use the imported image here
          alt="College Campus"
          className="w-full max-w-md rounded-lg shadow-xl"
        />
      </div>
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-8">
        Top NIRF/NAAC colleges  Table and Graph Respresentation
      </h1>
      {/* Table for College Data */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-6 mb-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIRF/NAAC Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Record</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel Life</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Structure (INR)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collegeData.map((college, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{college.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{college.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{college.placementRecord}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{college.hostelLife}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{college.feeStructure.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Fee Structure Graph */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-6">
        <Bar data={feeChartData} />
      </div>
    </div>
  );
};

export default Graph;
