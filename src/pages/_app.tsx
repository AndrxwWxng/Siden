// This is a temporary file to bypass authentication
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  // Only use the router on the client side to avoid build errors
  if (typeof window === 'undefined') {
    return <Component {...pageProps} />;
  }
  
  const router = useRouter();
  
  // Redirect from signin to dashboard
  useEffect(() => {
    if (router.pathname === '/signin' || router.pathname === '/signup') {
      router.replace('/dashboard');
    }
  }, [router.pathname, router]);
  
  return <Component {...pageProps} />;
}

export default MyApp; 