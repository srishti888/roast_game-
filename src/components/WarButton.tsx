
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Map } from 'lucide-react';

interface WarButtonProps {
  to: string;
  variant: 'media' | 'maps';
  children: React.ReactNode;
  className?: string;
}

const WarButton = ({ to, variant, children, className }: WarButtonProps) => {
  const buttonClasses = cn(
    variant === 'media' ? 'btn-media' : 'btn-maps',
    className
  );

  const iconClassName = "w-6 h-6 mr-3";
  
  return (
    <Link to={to} className={buttonClasses}>
      {variant === 'media' ? (
        <Shield className={iconClassName} />
      ) : (
        <Map className={iconClassName} />
      )}
      {children}
    </Link>
  );
};

export default WarButton;
