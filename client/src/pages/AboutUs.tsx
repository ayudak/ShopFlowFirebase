import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Target, Users, ExternalLink } from 'lucide-react';

export default function AboutUs() {
  const developers = [
    {
      name: 'Ayush',
      role: 'Frontend Developer',
      portfolio: 'https://ayushcodeui.netlify.app',
    },
    {
      name: 'Daksh',
      role: 'Backend Developer',
      portfolio: 'https://dakshbackend.netlify.app',
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-about-headline">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Delivering excellence through innovation and dedication
          </p>
        </div>

        {/* Company Info */}
        <Card className="p-8 md:p-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ayudak</h2>
              <p className="text-lg text-foreground/90 leading-relaxed">
                We are committed to providing the best applications with affordable pricing and innovative features that truly make a difference in your business operations.
              </p>
            </div>
          </div>
        </Card>

        {/* Company Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Target className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
                <p className="text-foreground/90 leading-relaxed">
                  To provide the best apps with affordable pricing and crazy features that empower businesses to grow and succeed.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">App Purpose</h3>
                <p className="text-foreground/90 leading-relaxed">
                  ShopFlow is built specifically for small business owners who need powerful tools without the enterprise price tag.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Development Team */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2">About the Developers</h2>
            <p className="text-muted-foreground">Meet the talented team behind ShopFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developers.map((dev, index) => (
              <Card key={index} className="p-8" data-testid={`card-developer-${index}`}>
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-primary">
                      {dev.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{dev.name}</h3>
                    <p className="text-muted-foreground">{dev.role}</p>
                  </div>
                  <a
                    href={dev.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline" size="sm" data-testid={`button-portfolio-${index}`}>
                      View Portfolio
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <Card className="p-8 md:p-12 bg-primary/5">
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
                Constantly pushing boundaries to deliver cutting-edge solutions
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Affordability</h3>
              <p className="text-muted-foreground">
                Premium features at prices that make sense for small businesses
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Support</h3>
              <p className="text-muted-foreground">
                Dedicated to helping you succeed every step of the way
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
