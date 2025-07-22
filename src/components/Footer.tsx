
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-brand-blue" />
              <span className="font-bold">Fortitude Network</span>
            </Link>
            <p className="text-sm text-slate-600">Empowering your cancer journey, one connection at a time.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-slate-600 hover:text-brand-blue">About Us</Link></li>
              <li><Link to="/offerings" className="text-sm text-slate-600 hover:text-brand-blue">Our Offerings</Link></li>
              <li><Link to="/community" className="text-sm text-slate-600 hover:text-brand-blue">Community Hub</Link></li>
              <li><Link to="/support" className="text-sm text-slate-600 hover:text-brand-blue">Support Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-slate-600 hover:text-brand-blue">Contact Us</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-slate-600 hover:text-brand-blue">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-slate-600 hover:text-brand-blue">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-slate-600 hover:text-brand-blue">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-slate-500">
          <p>Copyright © {new Date().getFullYear()} Fortitude Network. Powered by Setidure Technologies Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
