import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Zap, BarChart3, Star } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Easy Inventory',
      description: 'Manage your products and stock levels effortlessly with our intuitive inventory system.',
    },
    {
      icon: Zap,
      title: 'Fast Checkout',
      description: 'Process transactions quickly with our streamlined checkout experience that keeps customers happy.',
    },
    {
      icon: BarChart3,
      title: 'Sales Analytics',
      description: 'Get real-time insights into your business performance with comprehensive analytics and reports.',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      business: 'Kumar Electronics',
      rating: 5,
      comment: 'ShopFlow transformed our retail operations. Sales tracking is now effortless!',
    },
    {
      name: 'Priya Sharma',
      business: 'Sharma Garments',
      rating: 5,
      comment: 'The best POS system we have used. Support team is incredibly responsive.',
    },
    {
      name: 'Amit Patel',
      business: 'Patel Grocery Store',
      rating: 5,
      comment: 'Simple, powerful, and affordable. Exactly what small businesses need.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" data-testid="text-hero-headline">
              The POS System That Grows with Your Business
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-subheadline">
              Streamline your retail operations with our modern point-of-sale solution. Built for small business owners who want powerful features at affordable prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base" data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-base" data-testid="button-view-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Powerful Features for Modern Retail</h2>
            <p className="text-lg text-muted-foreground">Everything you need to run your business efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 md:p-8 hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                <feature.icon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl md:text-2xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Loved by Business Owners</h2>
            <p className="text-lg text-muted-foreground">See what our customers have to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6" data-testid={`card-testimonial-${index}`}>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-4 leading-relaxed">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground">Join hundreds of businesses already using ShopFlow</p>
          <Link href="/signup">
            <Button size="lg" className="text-base" data-testid="button-cta-signup">
              Start Your 14-Day Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
