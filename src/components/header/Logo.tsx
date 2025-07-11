import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 text-brand-blue font-bold text-xl">
      <img 
        src="/lovable-uploads/0e9eaab4-1c79-40b9-8025-4b972224eb9d.png" 
        alt="Fortitude Network Logo" 
        className="h-10 w-auto object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <span>Fortitude Network</span>
    </Link>
  );
};

export default Logo;