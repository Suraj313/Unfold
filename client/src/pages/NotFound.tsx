import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F8F7F4] font-sans px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-main mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-main mb-3">
          Page not found
        </h2>
        <p className="text-text-secondary text-[15px] mb-8 max-w-sm mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
