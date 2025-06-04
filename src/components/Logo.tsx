import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <img 
        src="/lovable-uploads/b2860a75-786b-473b-9558-918995cd240e copy.png"
        alt="iVALET"
        className="w-full h-auto max-w-[400px]"
      />
    </div>
  );
};

export default Logo;