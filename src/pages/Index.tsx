
import { Navigate } from "react-router-dom";

const Index = () => {
  // This page simply redirects to the Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
