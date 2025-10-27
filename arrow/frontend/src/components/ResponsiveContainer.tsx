import React from 'react';

const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] mx-auto p-4 sm:p-8 md:p-12">
      {children}
    </div>
  );
};

export default ResponsiveContainer; 