import React from 'react';
import { Modern3DLogo } from './Icons';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="w-full py-4 px-2 sm:px-4">
      <div className="flex justify-center items-center">
        <button onClick={onReset} className="flex items-center gap-3 cursor-pointer group">
          <Modern3DLogo />
          <h1 className="text-2xl font-bold text-light group-hover:text-accent transition-colors">
            AISE
          </h1>
        </button>
      </div>
    </header>
  );
};

export default Header;