import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './components/Login/Login'; 
import Signup from './components/Signup/Signup';
import UserData from './components/UserData/UserData'; 
import UserProfile from './components/UserProfile/UserProfile';
import ChatHistory from './components/ChatHistory/ChatHistory';
import AdminPortal from './components/Admin/Admin';
import CallInterface from './components/ColdCall/ColdCall';
import Graph from './components/Graph/Graph';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdata" element={<UserData/>}/>
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/chathistory" element={<ChatHistory/>}/>
        <Route path="/admin-portal" element={<AdminPortal/>}/>
        <Route path="/cold-call" element={<CallInterface/>}/>
        <Route path="/graph" element={<Graph/>}/>
        {/* Protected Routes (Sidebar only visible here) */}
        <Route
          path="/chatbot"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <Main />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
