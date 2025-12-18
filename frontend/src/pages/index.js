import ProtectedRoute from '../components/ProtectedRoute';
import DashboardPage from './DashboardPage';

/**
 * =====================================================
 * Root Page (/)
 * -----------------------------------------------------
 * - Protected
 * - Redirect handled by ProtectedRoute
 * =====================================================
 */

const HomePage = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default HomePage;
