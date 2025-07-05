import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 text-brand-blue font-bold text-xl">
      <img 
        src="/Fortitude_logo_new.png" 
        alt="Fortitude Network Logo" 
        className="h-8 w-8 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <span>Fortitude Network</span>
    </Link>
  );
};

export default Logo;