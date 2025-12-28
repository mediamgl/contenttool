import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  BookOpen,
  HardDrive,
  Share2,
  Settings,
  BarChart3,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/' },
    { label: 'Ideas', icon: <Lightbulb className="w-5 h-5" />, href: '/ideas' },
    { label: 'Content Builder', icon: <Sparkles className="w-5 h-5" />, href: '/builder' },
    { label: 'Write', icon: <FileText className="w-5 h-5" />, href: '/editor' },
    { label: 'Library', icon: <BookOpen className="w-5 h-5" />, href: '/library' },
    { label: 'Knowledge Base', icon: <HardDrive className="w-5 h-5" />, href: '/knowledge-base' },
    { label: 'Publisher', icon: <Share2 className="w-5 h-5" />, href: '/publisher' },
  ];

  const secondaryItems: NavItem[] = [
    { label: 'Content Analysis', icon: <Zap className="w-5 h-5" />, href: '/analysis' },
    { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/analytics' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-secondary border-r border-primary transition-transform duration-300 z-40 pt-[89px] w-64 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="p-lg space-y-sm">
          {/* Primary Navigation */}
          <div className="space-y-sm mb-xl">
            <p className="caption text-tertiary uppercase font-semibold px-md">Main</p>
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-brand text-inverse'
                    : 'text-secondary hover:bg-primary/50 hover:text-primary'
                }`}
              >
                {item.icon}
                <span className="body-small font-medium flex-1">{item.label}</span>
                {item.badge && <span className="badge badge-primary text-xs">{item.badge}</span>}
              </Link>
            ))}
          </div>

          <div className="divider" />

          {/* Secondary Navigation */}
          <div className="space-y-sm">
            <p className="caption text-tertiary uppercase font-semibold px-md">Tools</p>
            {secondaryItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-brand text-inverse'
                    : 'text-secondary hover:bg-primary/50 hover:text-primary'
                }`}
              >
                {item.icon}
                <span className="body-small font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Spacer for main content */}
      <div className="hidden md:block w-64" />
    </>
  );
};
