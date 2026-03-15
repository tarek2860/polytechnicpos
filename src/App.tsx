import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, Course, Enrollment } from './types';
import { MOCK_COURSES, CATEGORIES } from './constants';
import { 
  BookOpen, 
  Search, 
  User as UserIcon, 
  LogOut, 
  ShoppingCart, 
  Menu, 
  X, 
  Star, 
  Users, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  ChevronRight,
  Layout as DashboardIcon,
  Award,
  Settings,
  ArrowRight,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Cpu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar: React.FC<{ user: UserProfile | null, onLogin: () => void, onLogout: () => void, cartCount: number }> = ({ user, onLogin, onLogout, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-accent-purple rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform">
              <BookOpen size={24} />
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">EduVibe</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  location.pathname === link.path ? "text-primary-600" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-accent-purple text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 p-1 pr-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white" />
                  <span className="text-sm font-medium text-slate-700">Dashboard</span>
                </Link>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="btn-primary py-2 px-5 text-sm">
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-600">
                  <ShoppingCart size={20} /> Cart ({cartCount})
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-600">
                      <DashboardIcon size={20} /> Dashboard
                    </Link>
                    <button onClick={() => { onLogout(); setIsOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-red-500">
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => { onLogin(); setIsOpen(false); }} className="btn-primary w-full">
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-accent-purple rounded-xl flex items-center justify-center text-white">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-display font-bold text-white">EduVibe</span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Empowering learners worldwide with industry-leading digital skills. Build your career with EduVibe.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Useful Links</h3>
            <ul className="space-y-4">
              {['About Us', 'All Courses', 'Instructors', 'Success Stories', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-500 shrink-0" />
                <span>123 Learning Street, Tech City, 54321</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary-500 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary-500 shrink-0" />
                <span>hello@eduvibe.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-slate-400 mb-6">Subscribe to get the latest updates and course offers.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} EduVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface CourseCardProps {
  course: Course;
  onAddToCart: (c: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onAddToCart }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-bold rounded-full shadow-sm">
            {course.category}
          </span>
        </div>
        {course.discountPrice && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-accent-purple text-white text-xs font-bold rounded-full shadow-lg">
              {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="font-bold">{course.rating}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{course.studentsCount} Students</span>
          </div>
        </div>
        
        <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <UserIcon size={16} />
          </div>
          <span className="text-sm text-slate-600 font-medium">{course.instructorName}</span>
        </div>
        
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            {course.discountPrice ? (
              <>
                <span className="text-xl font-bold text-slate-900">৳{course.discountPrice}</span>
                <span className="text-sm text-slate-400 line-through">৳{course.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-slate-900">৳{course.price}</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(course)}
            className="p-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        
        <Link to={`/course/${course.id}`} className="block w-full text-center py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
          Enroll Now
        </Link>
      </div>
    </motion.div>
  );
};

// --- Pages ---

interface HomeProps {
  onAddToCart: (c: Course) => void;
}

const Home = ({ onAddToCart }: HomeProps) => {
  const categoryIcons: Record<string, any> = {
    'Web Development': Code,
    'Graphic Design': Palette,
    'Digital Marketing': Megaphone,
    'Freelancing': Briefcase,
    'AI Tools': Cpu,
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/20 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-sm font-medium text-primary-600"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
            Over 10,000+ Students Joined Already
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Learn <span className="gradient-text">Digital Skills</span> & Build Your Career
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Access world-class courses from industry experts. Start your journey today and transform your future with EduVibe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/courses" className="btn-primary w-full sm:w-auto">Browse Courses</Link>
            <Link to="/signup" className="btn-secondary w-full sm:w-auto">Start Learning</Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-12"
          >
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img src="https://picsum.photos/seed/learning/1200/600" alt="Platform Preview" className="w-full" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-xl hover:scale-110 transition-transform">
                <PlayCircle size={48} fill="currentColor" className="text-primary-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Top Categories</h2>
          <p className="text-slate-600">Explore our most popular learning paths</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = categoryIcons[cat.name] || Code;
            return (
              <motion.div 
                key={cat.name}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all text-center space-y-4 group"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mx-auto group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Icon size={32} />
                </div>
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500">120+ Courses</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Featured Courses</h2>
            <p className="text-slate-600">Handpicked courses to help you succeed</p>
          </div>
          <Link to="/courses" className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
            View All Courses <ChevronRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-900 py-24 rounded-[40px] mx-4 sm:mx-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/20 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-16">What Our Students Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahat Ahmed', role: 'Web Developer', text: 'The courses are top-notch. I landed my first job after completing the Web Dev masterclass!', img: 'https://i.pravatar.cc/150?u=rahat' },
              { name: 'Sumaiya Khan', role: 'UI/UX Designer', text: 'Incredible learning experience. The instructors are very helpful and the curriculum is up-to-date.', img: 'https://i.pravatar.cc/150?u=sumaiya' },
              { name: 'Asif Iqbal', role: 'Digital Marketer', text: 'EduVibe changed my life. I started my own agency with the skills I learned here.', img: 'https://i.pravatar.cc/150?u=asif' },
            ].map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-left space-y-6">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-primary-500" />
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-slate-400 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface CourseDetailsProps {
  onAddToCart: (c: Course) => void;
}

const CourseDetails = ({ onAddToCart }: CourseDetailsProps) => {
  const { id } = useLocation().pathname.split('/').pop() ? { id: useLocation().pathname.split('/').pop() } : { id: '1' };
  const course = MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-bold rounded-full">{course.category}</span>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                <Star size={16} fill="currentColor" />
                <span>{course.rating} (450 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">{course.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{course.description}</p>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-xs text-slate-500">Instructor</p>
                  <p className="font-bold text-slate-900">{course.instructorName}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="font-bold text-slate-900">March 2024</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-8">
            <h2 className="text-2xl font-display font-bold text-slate-900">Course Curriculum</h2>
            <div className="space-y-4">
              {course.curriculum.map((section, idx) => (
                <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 p-4 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">{section.title}</h3>
                    <span className="text-xs text-slate-500">{section.lessons.length} Lessons</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <PlayCircle size={20} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-slate-400">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-8">
            <div className="aspect-video rounded-2xl overflow-hidden relative group">
              <img src={course.thumbnail} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={64} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-display font-bold text-slate-900">৳{course.discountPrice || course.price}</span>
                {course.discountPrice && (
                  <span className="text-xl text-slate-400 line-through mb-1">৳{course.price}</span>
                )}
              </div>
              <p className="text-sm text-red-500 font-bold">Offer ends in 2 days!</p>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => onAddToCart(course)} className="btn-primary w-full text-lg">Buy Now</button>
              <button className="btn-secondary w-full">Add to Cart</button>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="font-bold text-slate-900">This course includes:</p>
              <ul className="space-y-3">
                {[
                  { icon: Clock, text: '24 hours on-demand video' },
                  { icon: Award, text: 'Certificate of completion' },
                  { icon: CheckCircle, text: 'Full lifetime access' },
                  { icon: Users, text: 'Access on mobile and TV' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <item.icon size={18} className="text-primary-500" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  user: UserProfile | null;
  enrollments: Enrollment[];
}

const Dashboard = ({ user, enrollments }: DashboardProps) => {
  const userCourses = MOCK_COURSES.filter(c => enrollments.some(e => e.courseId === c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 text-center space-y-4">
            <img src={user?.photoURL} className="w-24 h-24 rounded-full mx-auto border-4 border-primary-50" />
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">{user?.displayName}</h3>
              <p className="text-sm text-slate-500">{user?.role === 'student' ? 'Student' : 'Instructor'}</p>
            </div>
          </div>
          
          <nav className="bg-white rounded-3xl border border-slate-100 p-4 space-y-1">
            {[
              { icon: DashboardIcon, label: 'My Courses', active: true },
              { icon: Award, label: 'Certificates' },
              { icon: ShoppingCart, label: 'Purchase History' },
              { icon: Settings, label: 'Account Settings' },
            ].map((item, i) => (
              <button 
                key={i}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  item.active ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display font-bold text-slate-900">My Courses</h2>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-600">All Courses</span>
              <span className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-600">Completed</span>
            </div>
          </div>

          {userCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userCourses.map(course => {
                const enrollment = enrollments.find(e => e.courseId === course.id);
                return (
                  <div key={course.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <img src={course.thumbnail} className="w-full h-48 object-cover" />
                    <div className="p-6 space-y-4">
                      <h3 className="font-display font-bold text-lg text-slate-900">{course.title}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-primary-600">{enrollment?.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-primary-600 to-accent-purple transition-all duration-1000" 
                            style={{ width: `${enrollment?.progress || 0}%` }} 
                          />
                        </div>
                      </div>
                      <button className="btn-primary w-full py-2 text-sm">Continue Learning</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                <BookOpen size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">No courses yet</h3>
                <p className="text-slate-500">You haven't enrolled in any courses yet. Start your journey today!</p>
              </div>
              <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface CartProps {
  cart: Course[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart = ({ cart, onRemove, onCheckout }: CartProps) => {
  const total = cart.reduce((acc, item) => acc + (item.discountPrice || item.price), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-slate-900 mb-12">Shopping Cart</h1>
      
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-6 items-center">
                <img src={item.thumbnail} className="w-32 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">By {item.instructorName}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-slate-900">৳{item.discountPrice || item.price}</p>
                  <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 font-medium hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl h-fit space-y-8">
            <h2 className="text-2xl font-display font-bold text-slate-900">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>৳{total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>৳0</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>
            <button onClick={onCheckout} className="btn-primary w-full text-lg">Checkout Now</button>
            <p className="text-xs text-slate-400 text-center">30-Day Money-Back Guarantee</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [cart, setCart] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seedData = async () => {
      const coursesSnap = await getDoc(doc(db, 'courses', '1'));
      if (!coursesSnap.exists()) {
        for (const course of MOCK_COURSES) {
          await setDoc(doc(db, 'courses', course.id), course);
        }
      }
    };
    seedData();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Learner',
            photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}`,
            role: 'student',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }

        // Listen for enrollments
        const q = query(collection(db, 'enrollments'), where('userId', '==', firebaseUser.uid));
        onSnapshot(q, (snapshot) => {
          setEnrollments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment)));
        });
      } else {
        setUser(null);
        setEnrollments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const addToCart = (course: Course) => {
    if (!cart.find(c => c.id === course.id)) {
      setCart([...cart, course]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const handleCheckout = async () => {
    if (!user) {
      handleLogin();
      return;
    }

    // Simulate checkout by creating enrollments
    for (const course of cart) {
      const enrollmentId = `${user.uid}_${course.id}`;
      await setDoc(doc(db, 'enrollments', enrollmentId), {
        userId: user.uid,
        courseId: course.id,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
      });
    }
    setCart([]);
    alert('Enrollment successful! Check your dashboard.');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} cartCount={cart.length} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route path="/courses" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-display font-bold text-slate-900">All Courses</h1>
                  <p className="text-slate-600">Find the perfect course to advance your career</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {MOCK_COURSES.map(course => <CourseCard key={course.id} course={course} onAddToCart={addToCart} />)}
                </div>
              </div>
            } />
            <Route path="/course/:id" element={<CourseDetails onAddToCart={addToCart} />} />
            <Route path="/dashboard" element={<Dashboard user={user} enrollments={enrollments} />} />
            <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart} onCheckout={handleCheckout} />} />
            <Route path="*" element={<div className="text-center py-24">Page Not Found</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

