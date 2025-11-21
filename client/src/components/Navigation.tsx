import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all" data-testid="link-home">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ShopFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover-elevate active-elevate-2 rounded-md transition-all" 
                data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')} 
                  data-testid="button-dashboard"
                >
                  Dashboard
                </Button>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin')} 
                    data-testid="button-admin-panel"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut} data-testid="button-logout">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/signin')} 
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/signup')} 
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            data-testid="button-mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover-elevate active-elevate-2 rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-dashboard"
                  >
                    Dashboard
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => {
                        navigate('/admin');
                        setMobileMenuOpen(false);
                      }}
                      data-testid="mobile-button-admin-panel"
                    >
                      Admin Panel
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-logout"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      navigate('/signin');
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-login"
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-signup"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
