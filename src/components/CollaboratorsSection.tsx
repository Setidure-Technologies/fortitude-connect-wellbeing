
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake } from 'lucide-react';

const CollaboratorsSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Handshake className="h-8 w-8 text-brand-blue" />
            Our Trusted Collaborators
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're proud to partner with leading organizations that share our commitment to supporting cancer patients and their families.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 h-24 w-48 bg-white rounded-lg shadow-sm flex items-center justify-center border">
                <img 
                  src="/fore_logo.png" 
                  alt="FORE School of Management Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <CardTitle className="text-xl">FORE School of Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                A premier business school committed to excellence in management education and research, 
                supporting our mission through strategic guidance and academic expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 h-24 w-48 bg-white rounded-lg shadow-sm flex items-center justify-center border">
                <img 
                  src="/setidure_logo.svg" 
                  alt="Setidure Technologies Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <CardTitle className="text-xl">Setidure Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                An innovative technology company providing cutting-edge solutions and technical expertise 
                to enhance our platform's capabilities and user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 max-w-3xl mx-auto">
            These partnerships enable us to deliver a comprehensive, reliable, and innovative support platform 
            for the cancer community. Together, we're building a stronger network of care and connection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollaboratorsSection;
