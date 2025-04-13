'use client';

import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

function EnhancedPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const pricingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (pricingRef.current) {
      observer.observe(pricingRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
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
    <div className="py-12" ref={pricingRef}>
      <div className="container mx-auto px-6">
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="inline-flex p-1 bg-[#1a1a1a] rounded-full border border-[#2e2e2e] shadow-lg">
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                billingCycle === 'monthly' 
                  ? 'bg-[#6366F1] text-white shadow-md' 
                  : 'text-[#AAAAAA] hover:text-white'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                billingCycle === 'yearly' 
                  ? 'bg-[#6366F1] text-white shadow-md' 
                  : 'text-[#AAAAAA] hover:text-white'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              <div className="flex items-center">
                <span>Annual</span>
                <span className="ml-2 text-xs py-0.5 px-1.5 bg-[#22C55E]/20 text-[#22C55E] rounded-full">Save 17%</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`
                relative bg-gradient-to-b from-[#171717] to-[#131313] rounded-xl overflow-hidden 
                ${tier.highlighted 
                  ? 'border-2 border-[#6366F1] transform hover:scale-[1.03] shadow-xl shadow-[#6366F1]/10' 
                  : 'border border-[#2e2e2e] hover:border-[#6366F1]/60'
                }
                transition-all duration-500 animate-fade-in
                ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}
              `}
              style={{ 
                animationDelay: `${index * 150}ms`,
                transitionDelay: `${index * 150}ms`
              }}
            >
              {tier.highlighted && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"></div>
              )}
              {tier.highlighted && (
                <div className="bg-[#6366F1] text-white py-1 px-4 text-xs font-bold absolute top-6 right-6 rounded-full shadow-md">
                  Most Popular
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
                    <div className="mt-2 text-sm text-[#22C55E] flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Save $60 per user annually
                    </div>
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
                
                <Link 
                  href={tier.name === 'Enterprise' ? '/contact' : '/dashboard'} 
                  className={`
                    w-full py-3 px-6 rounded-lg font-medium text-center block transition-all duration-300
                    ${tier.highlighted 
                      ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5] hover:shadow-lg hover:shadow-[#6366F1]/20 hover:-translate-y-1' 
                      : 'bg-[#2e2e2e] text-white hover:bg-[#3e3e3e] hover:-translate-y-1'
                    }
                  `}
                >
                  {tier.cta}
                </Link>
              </div>
              
              {/* Gradient overlay effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-[#6366F1]/5 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 max-w-6xl mx-auto rounded-xl bg-gradient-to-br from-[#171717] to-[#131313] p-8 border border-[#2e2e2e] shadow-lg animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Need a custom plan for your organization?</h3>
              <p className="text-[#A3A3A3] mb-4">
                We offer custom pricing for larger teams with specific requirements. Our sales team can help you design the perfect solution for your needs.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {[
                  "Custom agent configurations", 
                  "Advanced security features",
                  "Dedicated infrastructure", 
                  "Volume discounts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-[#22C55E] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-transparent border border-[#6366F1] hover:bg-[#6366F1]/10 text-white font-medium rounded-lg transition-all duration-300 flex items-center hover:-translate-y-1 whitespace-nowrap"
              >
                Contact our sales team
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-36 pb-16 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
          <div className="absolute inset-0 bg-noise opacity-[0.4] pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212] to-transparent pointer-events-none"></div>
          
          {/* Animated blobs */}
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#6366F1]/10 blur-[100px] animate-float"></div>
          <div className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-[#22C55E]/10 blur-[80px] animate-float" style={{animationDelay: '-2s'}}></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="animate-fade-in">
                <span className="inline-block py-1.5 px-4 bg-[#6366F1]/10 rounded-full text-[#6366F1] text-sm font-semibold mb-6">
                  Simple Transparent Pricing
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight max-w-4xl animate-slide-up hero-title" style={{ lineHeight: '1.3' }}>
                Pricing Plans for Every Team
              </h1>
              <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto animate-slide-up animate-delay-100">
                Choose the right plan to support your AI agent team's needs, with flexible options for teams of all sizes.
              </p>
            </div>
          </div>
        </section>
        
        {/* Enhanced Pricing Component */}
        <EnhancedPricing />
        
        {/* FAQ Section */}
        <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6366F1]/5 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#22C55E]/5 rounded-full blur-[80px]"></div>
          
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center animate-fade-in">Frequently Asked Questions</h2>
            
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
                }
              ].map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-[#171717] rounded-xl border border-[#2e2e2e] p-6 transition-all duration-300 hover:border-[#6366F1]/30 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-[#A3A3A3]">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-[#A3A3A3] mb-4 animate-fade-in" style={{ animationDelay: '600ms' }}>Still have questions?</p>
              <Link 
                href="/contact" 
                className="text-[#6366F1] hover:text-[#4F46E5] font-medium inline-flex items-center transition-colors duration-300 animate-fade-in" 
                style={{ animationDelay: '700ms' }}
              >
                Contact our support team
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}