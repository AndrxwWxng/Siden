'use client';

import Link from 'next/link';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  frequency: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export default function Pricing() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      description: 'For individuals and small teams just getting started.',
      price: '$0',
      frequency: 'Free forever',
      features: [
        'Up to 3 agent profiles',
        'Basic workflow templates',
        'Standard agent models',
        'Community support',
        '1 concurrent task per agent'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'For teams that need additional features and support.',
      price: '$29',
      frequency: 'per user/month',
      features: [
        'Unlimited agent profiles',
        'Advanced workflow builder',
        'Premium agent models',
        'Team collaboration features',
        'Priority email support',
        '5 concurrent tasks per agent',
        'API access'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For organizations that need advanced security and support.',
      price: 'Custom',
      frequency: 'contact for pricing',
      features: [
        'Everything in Professional',
        'Dedicated support',
        'Custom model training',
        'Advanced security features',
        'HIPAA compliance',
        'SSO integration',
        'Unlimited concurrent tasks',
        'Custom API rate limits'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <section className="py-24 bg-[#121212]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-[#A3A3A3] max-w-2xl mx-auto">
            Choose the plan that's right for you and start building your AI agent team today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`
                bg-[#1a1a1a] rounded-lg overflow-hidden 
                ${tier.highlighted 
                  ? 'border-2 border-[#6366F1] relative transform hover:scale-105' 
                  : 'border border-[#2e2e2e] hover:border-[#6366F1]'
                } 
                transition-all duration-350
              `}
            >
              {tier.highlighted && (
                <div className="bg-[#6366F1] text-white py-1 px-4 text-sm font-bold absolute top-0 right-0 rounded-bl-lg">
                  Recommended
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-[#A3A3A3] mb-6 h-12">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-[#A3A3A3] ml-2">{tier.frequency}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-[#22C55E] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={tier.name === 'Enterprise' ? '/contact' : '/signup'} 
                  className={`
                    w-full py-3 rounded-md font-medium text-center block transition-colors
                    ${tier.highlighted 
                      ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5]' 
                      : 'bg-[#2e2e2e] text-white hover:bg-[#3e3e3e]'
                    }
                  `}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-[#A3A3A3] mb-4">Need something specific for your team?</p>
          <Link href="/contact" className="text-[#6366F1] font-medium">
            Contact us for a custom plan →
          </Link>
        </div>
      </div>
    </section>
  );
} 