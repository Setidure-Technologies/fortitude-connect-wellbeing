
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <img 
            src="/images/about/JHU.jpeg" 
            alt="Vanshika Rao - Founder of Fortitude Network" 
            className="rounded-lg shadow-lg aspect-square object-cover" 
            onError={(e) => {
              e.currentTarget.src = "/images/vanshika/vanshika_1.jpeg";
            }}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">The Heart Behind Fortitude Network</h1>
          <p className="text-lg text-slate-700 mb-4">
            Vanshika Rao, the visionary behind Fortitude Network, was deeply influenced by her mother's courageous battle with cancer and the isolation that often accompanies the recovery journey. This inspired Vanshika to create a platform that bridges the gap between medical care and holistic support for cancer patients.
          </p>
          <p className="text-slate-600 mb-4">
            Vanshika realized that while medical treatment is essential, the emotional and psychological challenges that patients face are just as critical. This understanding drives her mission to provide a support system that ensures no one feels alone in their battle.
          </p>
          <p className="text-slate-600 mb-6">
            Fortitude Network is Vanshika's way of turning a deeply personal experience into a platform that empowers others. By bringing together medical insights, mental health support, customized care plans, and a nurturing community, we aim to provide comprehensive and compassionate support for cancer patients.
          </p>
          <Button asChild>
            <Link to="/community">Join Our Community</Link>
          </Button>
        </div>
      </div>

      <div className="text-center mt-24">
        <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-brand-blue">Our Vision</h3>
            <p className="text-slate-600">To empower cancer patients by providing a comprehensive and personalized care experience that combines medical knowledge, emotional well being, and community support, fostering resilience and enhancing quality of life throughout the recovery process.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-brand-teal">Our Mission</h3>
            <p className="text-slate-600">To bridge the gap between medical treatment and holistic support by creating an inclusive online platform that connects cancer patients, survivors, mental health professionals, and advocacy groups, ensuring they feel seen, supported, and empowered.</p>
          </div>
        </div>
      </div>

      {/* Community Impact Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Community Impact</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See how Fortitude Network is making a real difference in the lives of cancer patients, survivors, and their families through community support and advocacy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="/lovable-uploads/2ae2a92f-5b0c-409c-a23a-9bc9b0dc3e92.jpeg"
              alt="Hands holding in support showing human connection"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-2">Connection & Support</h3>
                <p className="text-sm">Building meaningful connections between patients and supporters</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="/lovable-uploads/2bbaacdb-8fcb-4e52-a1c8-ad95bb2c7f36.jpeg"
              alt="Paper cutout figures holding hands representing community unity"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-2">Unity & Strength</h3>
                <p className="text-sm">Together we are stronger than cancer</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="/lovable-uploads/b48b7b3e-3bd2-451c-8c88-1825c1c69fcf.jpeg"
              alt="Survivors celebrating at sunset with raised hands"
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-2">Celebration of Life</h3>
                <p className="text-sm">Honoring survivors and celebrating every milestone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
