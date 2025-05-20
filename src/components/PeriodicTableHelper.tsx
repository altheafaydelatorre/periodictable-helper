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

  // Expanded elements data
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
    },
    {
      name: "Sodium",
      symbol: "Na",
      atomicNumber: 11,
      atomicMass: "22.990",
      category: "Alkali Metal",
      group: "1",
      period: 3,
      block: "s",
      electronConfiguration: "[Ne] 3s¹",
      description: "Sodium is a chemical element with symbol Na and atomic number 11. It is a soft, silvery-white, highly reactive metal and is a member of the alkali metals."
    },
    {
      name: "Magnesium",
      symbol: "Mg",
      atomicNumber: 12,
      atomicMass: "24.305",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 3,
      block: "s",
      electronConfiguration: "[Ne] 3s²",
      description: "Magnesium is a chemical element with symbol Mg and atomic number 12. It is a shiny gray solid which bears a close physical resemblance to the other five elements in the second column of the periodic table."
    },
    {
      name: "Aluminum",
      symbol: "Al",
      atomicNumber: 13,
      atomicMass: "26.982",
      category: "Post-transition Metal",
      group: "13",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p¹",
      description: "Aluminum is a chemical element with symbol Al and atomic number 13. It is a silvery-white, soft, non-magnetic and ductile metal in the boron group."
    },
    {
      name: "Silicon",
      symbol: "Si",
      atomicNumber: 14,
      atomicMass: "28.085",
      category: "Metalloid",
      group: "14",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p²",
      description: "Silicon is a chemical element with symbol Si and atomic number 14. It is a hard and brittle crystalline solid with a blue-grey metallic lustre."
    },
    {
      name: "Phosphorus",
      symbol: "P",
      atomicNumber: 15,
      atomicMass: "30.974",
      category: "Nonmetal",
      group: "15",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p³",
      description: "Phosphorus is a chemical element with symbol P and atomic number 15. Elemental phosphorus exists in two major forms, white phosphorus and red phosphorus."
    },
    {
      name: "Sulfur",
      symbol: "S",
      atomicNumber: 16,
      atomicMass: "32.06",
      category: "Nonmetal",
      group: "16",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p⁴",
      description: "Sulfur is a chemical element with symbol S and atomic number 16. It is abundant, multivalent and nonmetallic."
    },
    {
      name: "Chlorine",
      symbol: "Cl",
      atomicNumber: 17,
      atomicMass: "35.45",
      category: "Halogen",
      group: "17",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p⁵",
      description: "Chlorine is a chemical element with symbol Cl and atomic number 17. The second-lightest of the halogens, it appears between fluorine and bromine in the periodic table and its properties are mostly intermediate between them."
    },
    {
      name: "Argon",
      symbol: "Ar",
      atomicNumber: 18,
      atomicMass: "39.948",
      category: "Noble Gas",
      group: "18",
      period: 3,
      block: "p",
      electronConfiguration: "[Ne] 3s² 3p⁶",
      description: "Argon is a chemical element with symbol Ar and atomic number 18. It is in group 18 of the periodic table and is a noble gas."
    },
    {
      name: "Potassium",
      symbol: "K",
      atomicNumber: 19,
      atomicMass: "39.098",
      category: "Alkali Metal",
      group: "1",
      period: 4,
      block: "s",
      electronConfiguration: "[Ar] 4s¹",
      description: "Potassium is a chemical element with symbol K and atomic number 19. It was first isolated from potash, the ashes of plants, from which its name derives."
    },
    {
      name: "Calcium",
      symbol: "Ca",
      atomicNumber: 20,
      atomicMass: "40.078",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 4,
      block: "s",
      electronConfiguration: "[Ar] 4s²",
      description: "Calcium is a chemical element with symbol Ca and atomic number 20. Calcium is a soft gray alkaline earth metal, fifth-most-abundant element by mass in the Earth's crust."
    },
    {
      name: "Iron",
      symbol: "Fe",
      atomicNumber: 26,
      atomicMass: "55.845",
      category: "Transition Metal",
      group: "8",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d⁶ 4s²",
      description: "Iron is a chemical element with symbol Fe and atomic number 26. It is a metal that belongs to the first transition series and group 8 of the periodic table."
    },
    {
      name: "Copper",
      symbol: "Cu",
      atomicNumber: 29,
      atomicMass: "63.546",
      category: "Transition Metal",
      group: "11",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d¹⁰ 4s¹",
      description: "Copper is a chemical element with symbol Cu and atomic number 29. It is a soft, malleable, and ductile metal with very high thermal and electrical conductivity."
    },
    {
      name: "Zinc",
      symbol: "Zn",
      atomicNumber: 30,
      atomicMass: "65.38",
      category: "Transition Metal",
      group: "12",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d¹⁰ 4s²",
      description: "Zinc is a chemical element with symbol Zn and atomic number 30. It is the first element in group 12 of the periodic table."
    },
    {
      name: "Silver",
      symbol: "Ag",
      atomicNumber: 47,
      atomicMass: "107.87",
      category: "Transition Metal",
      group: "11",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d¹⁰ 5s¹",
      description: "Silver is a chemical element with symbol Ag and atomic number 47. A soft, white, lustrous transition metal, it exhibits the highest electrical conductivity, thermal conductivity, and reflectivity of any metal."
    },
    {
      name: "Gold",
      symbol: "Au",
      atomicNumber: 79,
      atomicMass: "196.97",
      category: "Transition Metal",
      group: "11",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
      description: "Gold is a chemical element with symbol Au and atomic number 79. In its purest form, it is a bright, slightly reddish yellow, dense, soft, malleable, and ductile metal."
    },
    {
      name: "Mercury",
      symbol: "Hg",
      atomicNumber: 80,
      atomicMass: "200.59",
      category: "Transition Metal",
      group: "12",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s²",
      description: "Mercury is a chemical element with symbol Hg and atomic number 80. It is commonly known as quicksilver and was formerly named hydrargyrum."
    },
    {
      name: "Lead",
      symbol: "Pb",
      atomicNumber: 82,
      atomicMass: "207.2",
      category: "Post-transition Metal",
      group: "14",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",
      description: "Lead is a chemical element with symbol Pb and atomic number 82. It is a heavy metal that is denser than most common materials."
    },
    {
      name: "Uranium",
      symbol: "U",
      atomicNumber: 92,
      atomicMass: "238.03",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f³ 6d¹ 7s²",
      description: "Uranium is a chemical element with symbol U and atomic number 92. It is a silvery-white metal in the actinide series of the periodic table."
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
