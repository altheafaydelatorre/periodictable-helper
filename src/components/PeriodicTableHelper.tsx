import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { SearchIcon, AtomIcon } from "lucide-react";

// Interface for Element data
interface Element {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: string;
  category: string;
  group?: string;
  period?: number;
  block?: string;
  electronConfiguration?: string;
  description?: string;
}

const PeriodicTableHelper: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [filteredElements, setFilteredElements] = useState<Element[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Sample elements data (simplified)
  const elements: Element[] = [
    {
      name: "Hydrogen",
      symbol: "H",
      atomicNumber: 1,
      atomicMass: "1.008",
      category: "Nonmetal",
      group: "1",
      period: 1,
      block: "s",
      electronConfiguration: "1s¹",
      description: "Hydrogen is a chemical element with symbol H and atomic number 1. With a standard atomic weight of 1.008, hydrogen is the lightest element in the periodic table."
    },
    {
      name: "Helium",
      symbol: "He",
      atomicNumber: 2,
      atomicMass: "4.0026",
      category: "Noble Gas",
      group: "18",
      period: 1,
      block: "s",
      electronConfiguration: "1s²",
      description: "Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group in the periodic table."
    },
    {
      name: "Lithium",
      symbol: "Li",
      atomicNumber: 3,
      atomicMass: "6.94",
      category: "Alkali Metal",
      group: "1",
      period: 2,
      block: "s",
      electronConfiguration: "[He] 2s¹",
      description: "Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal."
    },
    {
      name: "Beryllium",
      symbol: "Be",
      atomicNumber: 4,
      atomicMass: "9.0122",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 2,
      block: "s",
      electronConfiguration: "[He] 2s²",
      description: "Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe."
    },
    {
      name: "Boron",
      symbol: "B",
      atomicNumber: 5,
      atomicMass: "10.81",
      category: "Metalloid",
      group: "13",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p¹",
      description: "Boron is a chemical element with symbol B and atomic number 5. Produced entirely by cosmic ray spallation and not by stellar nucleosynthesis."
    },
    {
      name: "Carbon",
      symbol: "C",
      atomicNumber: 6,
      atomicMass: "12.011",
      category: "Nonmetal",
      group: "14",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p²",
      description: "Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds."
    },
    {
      name: "Nitrogen",
      symbol: "N",
      atomicNumber: 7,
      atomicMass: "14.007",
      category: "Nonmetal",
      group: "15",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p³",
      description: "Nitrogen is a chemical element with symbol N and atomic number 7. It was first discovered and isolated by Scottish physician Daniel Rutherford in 1772."
    },
    {
      name: "Oxygen",
      symbol: "O",
      atomicNumber: 8,
      atomicMass: "15.999",
      category: "Nonmetal",
      group: "16",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p⁴",
      description: "Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table, a highly reactive nonmetal."
    },
    {
      name: "Fluorine",
      symbol: "F",
      atomicNumber: 9,
      atomicMass: "18.998",
      category: "Halogen",
      group: "17",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p⁵",
      description: "Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions."
    },
    {
      name: "Neon",
      symbol: "Ne",
      atomicNumber: 10,
      atomicMass: "20.180",
      category: "Noble Gas",
      group: "18",
      period: 2,
      block: "p",
      electronConfiguration: "[He] 2s² 2p⁶",
      description: "Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas."
    }
  ];

  // Categories for filtering
  const categories = Array.from(new Set(elements.map(elem => elem.category)));

  // Filter elements based on search term and category
  useEffect(() => {
    const filtered = elements.filter(element => {
      const searchMatch = 
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.atomicNumber.toString().includes(searchTerm);
        
      const categoryMatch = 
        categoryFilter === "" || element.category === categoryFilter;
        
      return searchMatch && categoryMatch;
    });
    
    setFilteredElements(filtered);
  }, [searchTerm, categoryFilter]);

  // Handle element selection
  const handleElementSelect = (element: Element) => {
    setSelectedElement(element);
    toast({
      title: `${element.name} (${element.symbol})`,
      description: `Atomic Number: ${element.atomicNumber}`,
    });
  };

  // Handle category filtering
  const handleCategorySelect = (category: string) => {
    setCategoryFilter(category === categoryFilter ? "" : category);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-4 border-green-500/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500/80 to-emerald-600/80">
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <AtomIcon size={24} />
            Periodic Table Helper
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="element-search">Search by name, symbol or atomic number:</Label>
              <Input
                id="element-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search elements..."
                className="mt-1"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Label className="w-full mb-1">Filter by category:</Label>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  className={categoryFilter === category ? "bg-green-600 hover:bg-green-700" : ""}
                  size="sm"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
              {categoryFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryFilter("")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            
            {/* Element grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
              {filteredElements.map((element) => (
                <div
                  key={element.atomicNumber}
                  onClick={() => handleElementSelect(element)}
                  className={`p-2 rounded-md cursor-pointer transition-colors border text-center ${
                    selectedElement?.atomicNumber === element.atomicNumber
                      ? "bg-green-200 border-green-500"
                      : "bg-green-50 border-green-200 hover:bg-green-100"
                  }`}
                >
                  <div className="text-xs text-green-800">{element.atomicNumber}</div>
                  <div className="text-xl font-bold text-green-700">{element.symbol}</div>
                  <div className="text-xs truncate">{element.name}</div>
                </div>
              ))}
            </div>
            
            {/* Selected element details */}
            {selectedElement && (
              <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
                  {selectedElement.name} 
                  <span className="text-sm px-2 py-1 bg-green-200 rounded-full">
                    {selectedElement.symbol}
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
                  <div className="text-sm">
                    <span className="font-semibold">Atomic Number:</span> {selectedElement.atomicNumber}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Atomic Mass:</span> {selectedElement.atomicMass}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Category:</span> {selectedElement.category}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Group:</span> {selectedElement.group || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Period:</span> {selectedElement.period || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Block:</span> {selectedElement.block || "N/A"}
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <span className="font-semibold">Electron Configuration:</span> {selectedElement.electronConfiguration || "N/A"}
                </div>
                
                <div className="mt-3 text-sm">
                  <span className="font-semibold">Description:</span><br />
                  {selectedElement.description || "No description available."}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-green-100/50 p-4 text-sm text-green-900">
          <p>
            This helper provides information about elements in the periodic table.
            Use the search or category filters to find specific elements.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PeriodicTableHelper;
