'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

function EnhancedPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const pricingTiers = [
    {
      name: 'Starter',
      description: 'For individuals and small teams just getting started.',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
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
      monthlyPrice: '$29',
      yearlyPrice: '$24',
      frequency: billingCycle === 'monthly' ? 'per user/month' : 'per user/month, billed annually',
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
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
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
    <section className="py-24 bg-gradient-to-b from-[#121212] to-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block py-1 px-3 bg-[#6366F1]/10 rounded-full text-[#6366F1] text-sm font-semibold mb-4">
            Pricing Plans
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#AAAAAA]">Simple, transparent pricing</h2>
          <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-10">
            Choose the plan that's right for you and start building your AI agent team today.
          </p>
          
          {/* Billing cycle toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#1a1a1a] p-1 rounded-full inline-flex border border-[#2e2e2e]">
              <button
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#6366F1] text-white shadow-lg'
                    : 'text-[#AAAAAA] hover:text-white'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-[#6366F1] text-white shadow-lg'
                    : 'text-[#AAAAAA] hover:text-white'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly
                <span className="absolute -top-3 -right-2 bg-[#22C55E] text-white text-xs py-0.5 px-2 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`
                rounded-xl overflow-hidden flex flex-col
                ${tier.highlighted 
                  ? 'bg-gradient-to-b from-[#1E1E1E] to-[#151515] border-2 border-[#6366F1] relative transform hover:scale-[1.03] shadow-xl' 
                  : 'bg-[#171717] border border-[#2e2e2e] hover:border-[#6366F1]/50'
                } 
                transition-all duration-300
              `}
            >
              {tier.highlighted && (
                <div className="bg-[#6366F1] text-white py-1 px-4 text-sm font-bold absolute top-0 right-0 rounded-bl-lg">
                  Recommended
                </div>
              )}
              
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-[#A3A3A3] mb-6 text-sm">{tier.description}</p>
                
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}</span>
                    <span className="text-[#A3A3A3] ml-2 text-sm">{tier.frequency}</span>
                  </div>
                  {tier.name === 'Professional' && billingCycle === 'yearly' && (
                    <div className="mt-2 text-sm text-[#22C55E]">Save $60 per user annually</div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-[#6366F1] mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-8 pt-0">
                <Link 
                  href={tier.name === 'Enterprise' ? '/contact' : '/signup'} 
                  className={`
                    w-full py-3 rounded-lg font-medium text-center block transition-all
                    ${tier.highlighted 
                      ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-lg shadow-[#6366F1]/20' 
                      : 'bg-[#252525] text-white hover:bg-[#333333] border border-[#3a3a3a]'
                    }
                  `}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-36 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212] to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#AAAAAA]">
                Pricing Plans for Every Team
              </h1>
              <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto">
                Choose the right plan to support your AI agent team's needs, with flexible options for teams of all sizes.
              </p>
            </div>
          </div>
        </section>
        
        {/* Enhanced Pricing Component */}
        <EnhancedPricing />
        
        {/* FAQ Section */}
        <section className="py-24 bg-[#121212]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "Can I change my plan later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. When upgrading, you'll get immediate access to the new features and we'll prorate the cost."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and for Enterprise customers, we also support invoicing with net-30 terms. All payments are securely processed through our payment provider."
                },
                {
                  question: "Do you offer a free trial?",
                  answer: "Yes, all paid plans include a 14-day free trial with no credit card required. You can upgrade to a paid plan at any time during your trial. If you need more time to evaluate, please contact our sales team."
                },
                {
                  question: "What's your refund policy?",
                  answer: "If you're not satisfied with our service, you can request a full refund within the first 30 days of your paid subscription. No questions asked. Our support team will process your refund within 3-5 business days."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time from your account settings. After cancellation, you'll still have access to your paid features until the end of your current billing period."
                },
                {
                  question: "Do you offer discounts for startups or non-profits?",
                  answer: "Yes, we offer special pricing for eligible startups, non-profit organizations, and educational institutions. Please contact our sales team to learn more about our discount programs."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6 hover:border-[#6366F1]/20 transition-all duration-300">
                  <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                  <p className="text-[#A3A3A3]">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <p className="text-[#A3A3A3] mb-4">Still have questions?</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center py-3 px-6 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white hover:bg-[#333333] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact our Sales Team
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-[#0A0A0A]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-12 border border-[#2e2e2e] shadow-xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your AI workflow?</h2>
              <p className="text-lg text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using our platform to build and orchestrate powerful AI agent systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="px-8 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  Start your free trial
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  className="px-8 py-3 bg-transparent border border-[#2e2e2e] hover:border-[#6366F1] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  Schedule a demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}