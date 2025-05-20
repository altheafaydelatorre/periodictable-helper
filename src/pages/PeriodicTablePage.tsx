
import React from 'react';
import PeriodicTableHelper from '@/components/PeriodicTableHelper';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const PeriodicTablePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-emerald-200 p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <HomeIcon size={18} />
              Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-1 text-emerald-800">Periodic Table Helper</h1>
        <p className="text-emerald-700/80 mb-6 text-center">
          Explore elements and their properties
        </p>
          
        <PeriodicTableHelper />
        
        <div className="mt-8 p-4 bg-emerald-100/80 backdrop-blur-sm rounded-lg w-full max-w-lg text-emerald-900">
          <h2 className="font-bold text-lg mb-2">How to Use the Periodic Table Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Element Search:</strong> Find elements by name, symbol, or atomic number</li>
            <li><strong>Element Details:</strong> View detailed information about each element</li>
            <li><strong>Category Filter:</strong> Filter elements by category</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTablePage;
