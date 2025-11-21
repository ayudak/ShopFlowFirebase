import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Small Business',
      price: 2999,
      period: 'month',
      description: 'Perfect for growing small businesses',
      features: [
        'Up to 3 user accounts',
        'Complete inventory management',
        'Fast checkout system',
        'Sales analytics dashboard',
        'Email support (2-day response)',
        'Free software updates',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 7999,
      period: 'month',
      description: 'For businesses that need more',
      features: [
        'Unlimited user accounts',
        'Advanced inventory management',
        'Priority checkout features',
        'Advanced analytics & reports',
        'Priority support (1-day response)',
        'Free software updates',
        'Custom integrations',
        'Dedicated account manager',
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-pricing-headline">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All prices are inclusive of all taxes.
          </p>
          <div className="inline-block">
            <Badge variant="secondary" className="text-base px-4 py-2" data-testid="badge-trial">
              14-Day Free Trial Available
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`p-6 md:p-8 relative ${
                plan.popular ? 'ring-2 ring-primary shadow-xl' : ''
              }`}
              data-testid={`card-pricing-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="text-sm px-4 py-1" data-testid="badge-popular">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Name */}
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold" data-testid={`text-price-${index}`}>₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>

                {/* CTA Button */}
                <Link href="/signup">
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    data-testid={`button-try-${index}`}
                  >
                    Try now for 14 days
                  </Button>
                </Link>

                {/* Features List */}
                <div className="space-y-3 pt-6 border-t">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center max-w-3xl mx-auto space-y-4">
          <p className="text-muted-foreground">
            All plans include free updates and security patches. No hidden fees. Cancel anytime.
          </p>
          <Link href="/contact">
            <Button variant="ghost" data-testid="button-contact-sales">
              Need a custom plan? Contact our sales team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
