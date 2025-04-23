
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50 flex items-center px-4">
      <div className="flex items-center w-full">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">GECOM</span>
        </Link>
        
        <div className="flex-1"></div>
        
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link to="/pedidos" className="text-sm font-medium">
            Pedidos
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
