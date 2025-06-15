
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Calendar, MessageSquare, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: <Users className="h-8 w-8 text-brand-blue" />,
    number: 2531,
    label: "Community Members",
    color: "bg-brand-skyblue"
  },
  {
    icon: <Heart className="h-8 w-8 text-brand-purple" />,
    number: 840,
    label: "Survivor Stories Shared",
    color: "bg-brand-pink"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-brand-teal" />,
    number: 1203,
    label: "Blog Reads Today",
    color: "bg-brand-green"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-yellow-600" />,
    number: 712,
    label: "Forum Questions Answered",
    color: "bg-brand-yellow"
  },
  {
    icon: <Calendar className="h-8 w-8 text-brand-blue" />,
    number: 98,
    label: "Events Hosted",
    color: "bg-brand-skyblue"
  }
];

const ImpactStats = () => {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      return setTimeout(() => {
        let current = 0;
        const increment = stat.number / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            current = stat.number;
            clearInterval(timer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }, 50);
      }, index * 200);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">💡 Our Impact So Far</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Together, we're building a stronger, more connected community of hope and healing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {animatedStats[index].toLocaleString()}
                </div>
                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
