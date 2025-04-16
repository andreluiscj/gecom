
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import NotificationMenu from './NotificationMenu';
import { UserMenu } from './UserMenu';
import HelpButton from './HelpButton';

interface NavBarProps {
  toggleSidebar: () => void;
  userRole?: string | null;
  userMunicipality?: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ toggleSidebar, userRole, userMunicipality }) => {
  return (
    <div className="border-b bg-background h-16 flex items-center justify-between px-4 shadow-nav">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <HelpButton />
        <ThemeToggle />
        <NotificationMenu />
        <UserMenu userRole={userRole} />
      </div>
    </div>
  );
};

export default NavBar;
