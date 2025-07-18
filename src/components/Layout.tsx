
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdSenseAd from './AdSenseAd';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Advertisement above footer */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdSenseAd adSlot="3234567890" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
