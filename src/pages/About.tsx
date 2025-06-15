
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <img src="/placeholder.svg" alt="Vanshika Rao" className="rounded-lg shadow-lg aspect-square object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">The Heart Behind Fortitude Network</h1>
          <p className="text-lg text-slate-700 mb-4">
            Vanshika Rao, the visionary behind Fortitude Network, was deeply influenced by her mother’s courageous battle with cancer and the isolation that often accompanies the recovery journey. This inspired Vanshika to create a platform that bridges the gap between medical care and holistic support for cancer patients.
          </p>
          <p className="text-slate-600 mb-4">
            Vanshika realized that while medical treatment is essential, the emotional and psychological challenges that patients face are just as critical. This understanding drives her mission to provide a support system that ensures no one feels alone in their battle.
          </p>
          <p className="text-slate-600 mb-6">
            Fortitude Network is Vanshika’s way of turning a deeply personal experience into a platform that empowers others. By bringing together medical insights, mental health support, customized care plans, and a nurturing community, we aim to provide comprehensive and compassionate support for cancer patients.
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
    </div>
  );
};

export default About;
