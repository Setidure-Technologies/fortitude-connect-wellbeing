import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 text-brand-blue font-bold text-xl">
      <img 
        src="/Fortitude_logo.png" 
        alt="Fortitude Network Logo" 
        className="h-10 w-auto object-contain"
        onError={(e) => {
          e.currentTarget.src = '/Fortitude_logo.png';
        }}
      />
      <span>Fortitude Network</span>
    </Link>
  );
};

export default Logo;