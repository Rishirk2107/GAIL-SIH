// components/ProtectedRoute.js
import { useContext } from 'react';
import { Context } from '../../context/Context';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context); // Access authentication state from context

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Prop validation for ProtectedRoute component
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children should be a React node and is required
};

export default ProtectedRoute;
