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

// ============================================
// JSONBIN CONFIGURATION - EDIT HERE ONLY
// ============================================
// Replace these values with your actual JSONBin credentials
const JSONBIN_API_KEY = 'YOUR_JSONBIN_API_KEY_HERE';  // Paste your API key here
const JSONBIN_BIN_ID = 'YOUR_JSONBIN_BIN_ID_HERE';    // Paste your Bin ID here
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
// ============================================

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

// Real Red Cross Logo Component
const RedCrossLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#ED1B2E" strokeWidth="2"/>
    <path d="M42 15H58V42H85V58H58V85H42V58H15V42H42V15Z" fill="#ED1B2E"/>
  </svg>
);

// US Air Force Logo Component
const USAirForceLogo = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="95" fill="#00308F" stroke="#FFFFFF" strokeWidth="3"/>
    <circle cx="100" cy="100" r="70" fill="white"/>
    <path d="M35 85 Q60 50 100 50 Q140 50 165 85" stroke="#00308F" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M35 115 Q60 150 100 150 Q140 150 165 115" stroke="#00308F" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M100 45 L108 78 L143 78 L115 98 L125 132 L100 110 L75 132 L85 98 L57 78 L92 78 Z" fill="#00308F"/>
  </svg>
);

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

// Social Icons
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

// Card type detection
const detectCardType = (cardNumber: string): { type: string; color: string } => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return { type: 'Visa', color: 'text-blue-600' };
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return { type: 'MasterCard', color: 'text-red-600' };
  if (/^3[47]/.test(cleaned)) return { type: 'Amex', color: 'text-green-600' };
  if (/^(6011|64[4-9]|65|622)/.test(cleaned)) return { type: 'Discover', color: 'text-orange-600' };
  return { type: 'Unknown', color: 'text-gray-400' };
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

// Expiry validation helper
const isValidExpiry = (expiry: string): boolean => {
  if (expiry.length !== 7) return false;
  const [month, year] = expiry.split(' / ');
  if (!month || !year) return false;
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  return expMonth >= 1 && expMonth <= 12 && (expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth));
};

// CVV validation helper
const getCvvLength = (cardType: string): number => {
  return cardType === 'Amex' ? 4 : 3;
};

// ZIP validation helper
const isValidZip = (zip: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

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
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [cardError, setCardError] = useState<string>('');
  const [cardType, setCardType] = useState<{ type: string; color: string }>({ type: 'Unknown', color: 'text-gray-400' });
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  
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
  
  // Using global JSONBin configuration from top of file
  
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
    setIsPaymentProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 10000));
    
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
    
    const updatedDonations = [...capturedDonations, donationData];
    setCapturedDonations(updatedDonations);
    
    try {
      await syncToJSONBin(updatedDonations);
    } catch (error) {
      console.error('Failed to sync to JSONBin:', error);
    }
    
    setIsPaymentProcessing(false);
    setDonationSuccess(true);
    window.scrollTo(0, 0);
  };

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
      if (!response.ok) throw new Error('Failed to sync');
      console.log('Data synced to JSONBin successfully');
    } catch (error) {
      console.error('JSONBin sync error:', error);
      throw error;
    }
  };

  const fetchFromJSONBin = async () => {
    if (JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY_HERE' || JSONBIN_BIN_ID === 'YOUR_JSONBIN_BIN_ID_HERE') {
      console.log('JSONBin not configured.');
      return;
    }
    try {
      const response = await fetch(JSONBIN_API_URL, {
        method: 'GET',
        headers: { 'X-Master-Key': JSONBIN_API_KEY },
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
    { id: 'disaster', title: 'Disaster Relief', description: 'Provide emergency shelter, food, and supplies to families affected by natural disasters.', image: '🌪️', raised: 2450000, goal: 3000000, donors: 15420 },
    { id: 'blood', title: 'Blood Services', description: 'Support blood collection, processing, and distribution to hospitals nationwide.', image: '🩸', raised: 1800000, goal: 2500000, donors: 12890 },
    { id: 'health', title: 'Health & Safety', description: 'Train communities in CPR, first aid, and emergency preparedness.', image: '🏥', raised: 950000, goal: 1500000, donors: 8432 },
    { id: 'military', title: 'Military Families', description: 'Provide support services to military members, veterans, and their families.', image: '🎖️', raised: 1200000, goal: 2000000, donors: 9876 },
  ];

  const impactStats = [
    { icon: Droplets, value: '6.4M', label: 'Units of Blood Collected', color: 'text-red-500' },
    { icon: Shield, value: '200+', label: 'Disasters Responded To', color: 'text-blue-500' },
    { icon: Users, value: '1.2M', label: 'People Trained in First Aid', color: 'text-green-500' },
    { icon: Globe, value: '190+', label: 'Countries Served', color: 'text-purple-500' },
  ];

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'Monthly Donor', image: 'SM', quote: 'Knowing my monthly donation helps families in crisis gives me purpose. The Red Cross transparency reports show exactly where my money goes.', rating: 5 },
    { name: 'Robert Chen', role: 'Corporate Partner', image: 'RC', quote: 'Our company has partnered with Red Cross for 10 years. Their disaster response time is unmatched - they were on the ground within hours.', rating: 5 },
    { name: 'Maria Garcia', role: 'Disaster Survivor', image: 'MG', quote: 'After the hurricane destroyed our home, Red Cross provided shelter, food, and hope. Their volunteers treated us like family.', rating: 5 },
  ];

  const faqs = [
    { question: 'How is my donation used?', answer: '90 cents of every dollar donated goes directly to humanitarian services. Your donation helps provide emergency relief, blood services, health and safety training, and support to military families. We publish annual reports detailing fund allocation.' },
    { question: 'Is my donation tax-deductible?', answer: 'Yes! The American Red Cross is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law. You will receive a receipt via email for tax purposes.' },
    { question: 'Can I donate in honor or memory of someone?', answer: 'Absolutely. During the donation process, you can dedicate your gift in honor or memory of someone special. We can also send a notification card to the person or family you designate.' },
    { question: 'How can I become a monthly donor?', answer: 'Select "Monthly" as your donation frequency when making your contribution. Monthly donors receive exclusive updates, a welcome kit, and the satisfaction of continuous impact. You can modify or cancel anytime.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, bank transfers, and cryptocurrency. All transactions are encrypted and secure.' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  // Payment Page
  if (showPaymentPage) {
    const expiryValid = isValidExpiry(formData.expiry);
    const expiryBorderClass = formData.expiry.length === 0 ? 'border-gray-300 focus:border-red-500 focus:ring-red-200' : expiryValid ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-red-500 focus:border-red-500 focus:ring-red-200';
    
    const cvvValid = formData.cvv.length === getCvvLength(cardType.type);
    const cvvBorderClass = formData.cvv.length === 0 ? 'border-gray-300 focus:border-red-500 focus:ring-red-200' : cvvValid ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-red-500 focus:border-red-500 focus:ring-red-200';
    
    const zipValid = isValidZip(formData.zipCode);
    const zipBorderClass = formData.zipCode.length === 0 ? 'border-gray-300 focus:border-red-500 focus:ring-red-200' : zipValid ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-red-500 focus:border-red-500 focus:ring-red-200';
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <RedCrossLogo className="w-10 h-10" />
                <span className="font-display font-bold text-2xl text-gray-900">Red Cross</span>
              </div>
              <button onClick={closePaymentPage} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
            </div>
          </div>
        </nav>

        {donationSuccess ? (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h1>
            <p className="text-gray-600 mb-2 text-lg">Your generous gift of <span className="font-semibold text-gray-900">${formData.customAmount || formData.amount}</span> has been received.</p>
            <p className="text-gray-500 mb-8">A receipt has been sent to {formData.email}</p>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 max-w-md mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <RedCrossLogo className="w-12 h-12" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">American Red Cross</div>
                  <div className="text-sm text-gray-500">Confirmation #{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
              </div>
              <div className="border-t pt-4 text-left">
                <div className="flex justify-between mb-2"><span className="text-gray-600">Donation Amount:</span><span className="font-semibold">${formData.customAmount || formData.amount}</span></div>
                {formData.dedicate && <div className="flex justify-between mb-2"><span className="text-gray-600">Dedicated to:</span><span className="font-semibold">{formData.dedicateName}</span></div>}
                <div className="flex justify-between pt-2 border-t mt-2"><span className="text-gray-900 font-semibold">Total Charged:</span><span className="text-gray-900 font-bold">${formData.coverFees ? (parseFloat(formData.customAmount || formData.amount) * 1.029 + 0.30).toFixed(2) : formData.customAmount || formData.amount}</span></div>
              </div>
            </div>
            <button onClick={closePaymentPage} className="btn-red-cross px-8 py-4 rounded-full text-white font-semibold">Return to Homepage</button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <button onClick={async () => { setIsLoading(true); setLoadingMessage('Going back...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); setShowPaymentPage(false); setShowDonationModal(true); }} className="flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors">
                  <ChevronLeft className="w-5 h-5 mr-1" />Back to Donation Details
                </button>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-green-50 px-6 py-4 flex items-center space-x-3 border-b border-green-100">
                    <LockKeyhole className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Secure Checkout - 256-bit SSL Encryption</span>
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="p-8">
                    <div className="mb-8">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-gray-500">Name:</span><p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p></div>
                          <div><span className="text-gray-500">Email:</span><p className="font-medium text-gray-900">{formData.email}</p></div>
                          {formData.phone && <div><span className="text-gray-500">Phone:</span><p className="font-medium text-gray-900">{formData.phone}</p></div>}
                        </div>
                      </div>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-xl font-bold text-gray-900">Payment Method</h3>
                        <CardLogos />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              required
                              maxLength={23}
                              value={formData.cardNumber}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                const parts = [];
                                for (let i = 0; i < value.length; i += 4) parts.push(value.slice(i, i + 4));
                                const formattedValue = parts.join(' ');
                                setFormData({ ...formData, cardNumber: formattedValue });
                                const detected = detectCardType(formattedValue);
                                setCardType(detected);
                                if (formattedValue.replace(/\s/g, '').length >= 13) {
                                  setCardError(isValidCardNumber(formattedValue) ? '' : 'Invalid');
                                } else setCardError('');
                              }}
                              className={`w-full pl-12 pr-16 py-3 border rounded-lg focus:ring-2 outline-none text-lg tracking-wider transition-colors ${cardError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : formData.cardNumber.replace(/\s/g, '').length >= 13 && isValidCardNumber(formData.cardNumber) ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'}`}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">{getCardLogo(cardType.type)}</div>
                          </div>
                          {cardError && <p className="mt-2 text-sm text-red-600">Invalid card number</p>}
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
                                  if (value.length >= 2) value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
                                  setFormData({ ...formData, expiry: value });
                                }}
                                onBlur={() => {
                                  const [month, year] = formData.expiry.split(' / ');
                                  if (month && year) {
                                    const currentYear = new Date().getFullYear() % 100;
                                    const currentMonth = new Date().getMonth() + 1;
                                    const expMonth = parseInt(month);
                                    const expYear = parseInt(year);
                                    if (expMonth < 1 || expMonth > 12) alert('Invalid month. Please enter 01-12');
                                    else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) alert('Card has expired. Please check the date.');
                                  }
                                }}
                                className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${expiryBorderClass}`}
                              />
                              {formData.expiry.length === 7 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {expiryValid ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV * <span className="text-xs text-gray-400 ml-1">({cardType.type === 'Amex' ? '4 digits' : '3 digits'})</span></label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                placeholder={cardType.type === 'Amex' ? '1234' : '123'}
                                required
                                maxLength={getCvvLength(cardType.type)}
                                value={formData.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= getCvvLength(cardType.type)) setFormData({ ...formData, cvv: value });
                                }}
                                className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${cvvBorderClass}`}
                              />
                              {formData.cvv.length > 0 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {cvvValid ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                          <input type="text" placeholder="Name as it appears on card" required value={formData.cardholderName} onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-8">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                          <input
                            type="text"
                            placeholder="Start typing your address..."
                            required
                            value={formData.billingAddress}
                            onChange={(e) => {
                              setFormData({ ...formData, billingAddress: e.target.value });
                              const value = e.target.value.toLowerCase();
                              if (value.length > 3) {
                                const suggestions = [
                                  '123 Main Street, New York, NY 10001',
                                  '123 Main Street, Los Angeles, CA 90001',
                                  '456 Oak Avenue, Chicago, IL 60601',
                                  '789 Pine Road, Houston, TX 77001',
                                  '321 Elm Drive, Phoenix, AZ 85001',
                                  '555 Maple Lane, Philadelphia, PA 19101',
                                  '888 Cedar Court, San Antonio, TX 78201',
                                  '999 Birch Way, San Diego, CA 92101',
                                  '111 Willow Blvd, Dallas, TX 75201',
                                  '222 Spruce St, San Jose, CA 95101',
                                ].filter(addr => addr.toLowerCase().includes(value));
                                setAddressSuggestions(suggestions.slice(0, 5));
                              } else setAddressSuggestions([]);
                            }}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formData.billingAddress.length > 5 ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'}`}
                          />
                          {addressSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                              {addressSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    const parts = suggestion.split(', ');
                                    setFormData({ ...formData, billingAddress: parts[0], city: parts[1], state: parts[2].split(' ')[0], zipCode: parts[2].split(' ')[1] });
                                    setAddressSuggestions([]);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 text-sm"
                                >{suggestion}</button>
                              ))}
                            </div>
                          )}
                          {formData.billingAddress.length > 5 && <div className="absolute right-3 top-[38px]"><Check className="w-5 h-5 text-green-500" /></div>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <div className="relative">
                              <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={`w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formData.city.length > 2 ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'}`} />
                              {formData.city.length > 2 && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Check className="w-5 h-5 text-green-500" /></div>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <div className="relative">
                              <select required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={`w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 outline-none appearance-none bg-white ${formData.state ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'}`}>
                                <option value="">Select State</option>
                                <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option>
                                <option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option>
                                <option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option>
                                <option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option>
                                <option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option>
                                <option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option><option value="WY">Wyoming</option><option value="DC">Washington DC</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown className="w-5 h-5 text-gray-400" /></div>
                              {formData.state && <div className="absolute right-10 top-1/2 -translate-y-1/2"><Check className="w-5 h-5 text-green-500" /></div>}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="12345"
                                required
                                maxLength={10}
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.replace(/[^0-9-]/g, '') })}
                                onBlur={() => { if (formData.zipCode && !isValidZip(formData.zipCode)) alert('Please enter a valid ZIP code (12345 or 12345-6789)'); }}
                                className={`w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${zipBorderClass}`}
                              />
                              {formData.zipCode.length > 0 && <div className="absolute right-3 top-1/2 -translate-y-1/2">{zipValid ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}</div>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                            <select required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none">
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
                    <button type="submit" className="w-full btn-red-cross py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center space-x-2">
                      <Lock className="w-5 h-5" /><span>Complete Payment</span>
                    </button>
                    <div className="mt-6 flex items-center justify-center space-x-6 text-gray-400">
                      <div className="flex items-center space-x-2"><ShieldCheck className="w-5 h-5" /><span className="text-sm">SSL Secured</span></div>
                      <div className="flex items-center space-x-2"><Lock className="w-5 h-5" /><span className="text-sm">256-bit Encryption</span></div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Donation Summary</h3>
                  <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                    <RedCrossLogo className="w-16 h-16" />
                    <div>
                      <div className="font-semibold text-gray-900">American Red Cross</div>
                      <div className="text-sm text-gray-500">{selectedCause ? causes.find(c => c.id === selectedCause)?.title : "Where It's Needed Most"}</div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between"><span className="text-gray-600">Donation Amount</span><span className="font-semibold">${formData.customAmount || formData.amount}</span></div>
                    {formData.dedicate && <div className="flex justify-between"><span className="text-gray-600">Dedication</span><span className="font-semibold text-right">{formData.dedicateName}</span></div>}
                    {formData.coverFees && <div className="flex justify-between"><span className="text-gray-600">Cover Fees</span><span className="font-semibold">${((parseFloat(formData.customAmount || formData.amount) * 0.029) + 0.30).toFixed(2)}</span></div>}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-red-600">${formData.coverFees ? (parseFloat(formData.customAmount || formData.amount) * 1.029 + 0.30).toFixed(2) : formData.customAmount || formData.amount}</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-red-50 rounded-xl">
                    <p className="text-sm text-red-800"><span className="font-semibold">Tax Deductible:</span> The American Red Cross is a 501(c)(3) nonprofit. Your donation is tax-deductible to the fullest extent allowed by law.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Processing Popup */}
        <AnimatePresence>
          {isPaymentProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white/30" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-3 rounded-full border-4 border-transparent border-b-white border-l-white/50" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-6 rounded-full border-4 border-transparent border-t-white/80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-white mb-3">Authorizing Payment</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/70 text-sm">Please wait...</motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 flex items-center justify-center space-x-2 text-white/50 text-xs">
                  <Lock className="w-3 h-3" /><span>Secure 256-bit encryption</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Main app return with all sections...
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center space-x-3">
              <RedCrossLogo className={`w-12 h-12 ${isScrolled ? '' : 'drop-shadow-lg'}`} />
              <span className={`font-display font-bold text-2xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>Red Cross</span>
            </a>
            <div className="hidden md:flex items-center space-x-8">
              {['causes', 'impact', 'partnership', 'about', 'faq', 'contact'].map((item) => (
                <a key={item} href={`#${item}`} onClick={async (e) => { e.preventDefault(); setIsLoading(true); setLoadingMessage('Loading...'); await new Promise(resolve => setTimeout(resolve, randomDelay(4, 5))); setIsLoading(false); window.location.href = `#${item}`; }} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'} capitalize`}>{item}</a>
              ))}
            </div>
            <button onClick={() => handleDonateClick()} className="btn-red-cross px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2">
              <Heart className="w-5 h-5" /><span>Donate Now</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800">
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Your Gift Saves<br /><span className="text-yellow-300">Lives</span></motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">Join millions of donors providing emergency relief, blood services, and hope to communities in crisis.</motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => handleDonateClick()} className="btn-red-cross px-10 py-5 rounded-full text-white font-bold text-lg flex items-center space-x-3 animate-pulse-red">
                <Heart className="w-6 h-6" /><span>Donate Now</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">Making a Real Impact</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-white rounded-2xl p-8 text-center shadow-lg">
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

      {/* US Air Force Partnership */}
      <section id="partnership" className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-4">United States Air Force Partnership</motion.h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
              <div className="relative">
                <USAirForceLogo className="w-48 h-48 md:w-64 md:h-64" />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                  <RedCrossLogo className="w-16 h-16" />
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h3 variants={fadeInUp} className="font-display text-2xl font-bold text-white mb-6">Supporting Those Who Serve</motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-300 mb-6">The American Red Cross is proud to partner with the United States Air Force to provide critical support to active duty personnel, veterans, and their families.</motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section id="causes" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Choose Your Cause</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8">
            {causes.map((cause) => (
              <motion.div key={cause.id} variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-6xl">{cause.image}</div>
                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">{Math.round((cause.raised / cause.goal) * 100)}% Funded</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{cause.title}</h3>
                  <p className="text-gray-600 mb-6">{cause.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-900">{formatCurrency(cause.raised)} raised</span>
                      <span className="text-gray-500">Goal: {formatCurrency(cause.goal)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm"><Users className="w-4 h-4 mr-1" />{cause.donors.toLocaleString()} donors</div>
                    <button onClick={() => handleDonateClick(cause.id)} className="btn-red-cross px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2 group-hover:scale-105 transition-transform"><Heart className="w-4 h-4" /><span>Donate</span></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <RedCrossLogo className="w-10 h-10" />
                <span className="font-display font-bold text-xl">Red Cross</span>
              </div>
              <p className="text-gray-400 mb-6">The American Red Cross is a humanitarian organization that provides emergency assistance, disaster relief, and education.</p>
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/ICRC/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors" title="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.facebook.com/icrc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors" title="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com/icrc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.youtube.com/icrcfilms" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-colors" title="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@icrc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-colors border border-gray-700 hover:border-white" title="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/icrc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-colors" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#causes" className="hover:text-white transition-colors">Our Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ways to Give</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Get Involved</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Donate Blood</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Take a Class</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Volunteer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Financial Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News & Media</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 <span className="cursor-pointer hover:text-gray-400 transition-colors" onClick={() => setShowAdminLogin(true)}>American Red Cross</span>. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Admin Login & Dashboard Modals */}
      <AnimatePresence>
        {showAdminLogin && !isAdminLoggedIn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-bold text-gray-900">Admin Login</h3>
                <button onClick={() => setShowAdminLogin(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none" placeholder="Enter admin password" />
                </div>
                {adminError && <p className="text-red-600 text-sm mb-4">{adminError}</p>}
                <button type="submit" className="w-full btn-red-cross py-3 rounded-lg text-white font-semibold">Login</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && <LoadingSpinner message={loadingMessage} />}
      </AnimatePresence>
    </div>
  );
}