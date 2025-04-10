'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <NavBar />
      
      <main className="flex flex-col flex-grow">
        <section className="flex flex-col items-center justify-center px-6 py-16">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                Pricing Plans for Every Team
              </h1>
              <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto">
                Choose the right plan to support your AI agent team's needs.
              </p>
            </div>
          </div>
        </section>
        
        <Pricing />
        
        <section className="py-16 bg-[#1a1a1a]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-[#121212] rounded-lg border border-[#2e2e2e] p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-2">Need help choosing?</h3>
                <p className="text-[#A3A3A3]">
                  Our team can help you find the perfect solution for your specific requirements.
                </p>
              </div>
              <Link 
                href="/contact" 
                className="btn btn-primary px-8 whitespace-nowrap"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {/* FAQ Items */}
              <div className="border border-[#2e2e2e] rounded-lg p-6 bg-[#1a1a1a]">
                <h3 className="text-xl font-medium mb-3">Can I change my plan later?</h3>
                <p className="text-[#A3A3A3]">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </div>
              
              <div className="border border-[#2e2e2e] rounded-lg p-6 bg-[#1a1a1a]">
                <h3 className="text-xl font-medium mb-3">What payment methods do you accept?</h3>
                <p className="text-[#A3A3A3]">
                  We accept all major credit cards, PayPal, and for Enterprise customers, we also support invoicing with net-30 terms.
                </p>
              </div>
              
              <div className="border border-[#2e2e2e] rounded-lg p-6 bg-[#1a1a1a]">
                <h3 className="text-xl font-medium mb-3">Do you offer a free trial?</h3>
                <p className="text-[#A3A3A3]">
                  Yes, all paid plans include a 14-day free trial with no credit card required. You can upgrade to a paid plan at any time during your trial.
                </p>
              </div>
              
              <div className="border border-[#2e2e2e] rounded-lg p-6 bg-[#1a1a1a]">
                <h3 className="text-xl font-medium mb-3">What's your refund policy?</h3>
                <p className="text-[#A3A3A3]">
                  If you're not satisfied with our service, you can request a full refund within the first 30 days of your paid subscription.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 