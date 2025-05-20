
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

  // Complete periodic table with all 118 elements
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
      name: "Scandium",
      symbol: "Sc",
      atomicNumber: 21,
      atomicMass: "44.956",
      category: "Transition Metal",
      group: "3",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d¹ 4s²",
      description: "Scandium is a chemical element with symbol Sc and atomic number 21. A silvery-white metallic d-block element, it has historically been classified as a rare-earth element."
    },
    {
      name: "Titanium",
      symbol: "Ti",
      atomicNumber: 22,
      atomicMass: "47.867",
      category: "Transition Metal",
      group: "4",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d² 4s²",
      description: "Titanium is a chemical element with symbol Ti and atomic number 22. It is a lustrous transition metal with a silver color, low density, and high strength."
    },
    {
      name: "Vanadium",
      symbol: "V",
      atomicNumber: 23,
      atomicMass: "50.942",
      category: "Transition Metal",
      group: "5",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d³ 4s²",
      description: "Vanadium is a chemical element with symbol V and atomic number 23. It is a hard, silvery-grey, ductile, and malleable transition metal."
    },
    {
      name: "Chromium",
      symbol: "Cr",
      atomicNumber: 24,
      atomicMass: "51.996",
      category: "Transition Metal",
      group: "6",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d⁵ 4s¹",
      description: "Chromium is a chemical element with symbol Cr and atomic number 24. It is the first element in group 6. It is a steely-grey, lustrous, hard and brittle transition metal."
    },
    {
      name: "Manganese",
      symbol: "Mn",
      atomicNumber: 25,
      atomicMass: "54.938",
      category: "Transition Metal",
      group: "7",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d⁵ 4s²",
      description: "Manganese is a chemical element with symbol Mn and atomic number 25. It is not found as a free element in nature; it is often found in minerals in combination with iron."
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
      name: "Cobalt",
      symbol: "Co",
      atomicNumber: 27,
      atomicMass: "58.933",
      category: "Transition Metal",
      group: "9",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d⁷ 4s²",
      description: "Cobalt is a chemical element with symbol Co and atomic number 27. Like nickel, cobalt is found in the Earth's crust only in chemically combined form, save for small deposits found in alloys of natural meteoric iron."
    },
    {
      name: "Nickel",
      symbol: "Ni",
      atomicNumber: 28,
      atomicMass: "58.693",
      category: "Transition Metal",
      group: "10",
      period: 4,
      block: "d",
      electronConfiguration: "[Ar] 3d⁸ 4s²",
      description: "Nickel is a chemical element with symbol Ni and atomic number 28. It is a silvery-white lustrous metal with a slight golden tinge."
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
      name: "Gallium",
      symbol: "Ga",
      atomicNumber: 31,
      atomicMass: "69.723",
      category: "Post-transition Metal",
      group: "13",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p¹",
      description: "Gallium is a chemical element with symbol Ga and atomic number 31. It is in group 13 of the periodic table, and thus has similarities to the other metals of the group, aluminium, indium, and thallium."
    },
    {
      name: "Germanium",
      symbol: "Ge",
      atomicNumber: 32,
      atomicMass: "72.630",
      category: "Metalloid",
      group: "14",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p²",
      description: "Germanium is a chemical element with symbol Ge and atomic number 32. It is a lustrous, hard, grayish-white metalloid in the carbon group, chemically similar to its group neighbors silicon and tin."
    },
    {
      name: "Arsenic",
      symbol: "As",
      atomicNumber: 33,
      atomicMass: "74.922",
      category: "Metalloid",
      group: "15",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p³",
      description: "Arsenic is a chemical element with symbol As and atomic number 33. Arsenic occurs in many minerals, usually in combination with sulfur and metals, but also as a pure elemental crystal."
    },
    {
      name: "Selenium",
      symbol: "Se",
      atomicNumber: 34,
      atomicMass: "78.971",
      category: "Nonmetal",
      group: "16",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁴",
      description: "Selenium is a chemical element with symbol Se and atomic number 34. It is a nonmetal with properties that are intermediate between the elements above and below in the periodic table, sulfur and tellurium."
    },
    {
      name: "Bromine",
      symbol: "Br",
      atomicNumber: 35,
      atomicMass: "79.904",
      category: "Halogen",
      group: "17",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁵",
      description: "Bromine is a chemical element with symbol Br and atomic number 35. It is the third-lightest halogen, and is a fuming red-brown liquid at room temperature that evaporates readily to form a similarly colored gas."
    },
    {
      name: "Krypton",
      symbol: "Kr",
      atomicNumber: 36,
      atomicMass: "83.798",
      category: "Noble Gas",
      group: "18",
      period: 4,
      block: "p",
      electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁶",
      description: "Krypton is a chemical element with symbol Kr and atomic number 36. It is a member of group 18 elements. A colorless, odorless, tasteless noble gas, krypton occurs in trace amounts in the atmosphere."
    },
    {
      name: "Rubidium",
      symbol: "Rb",
      atomicNumber: 37,
      atomicMass: "85.468",
      category: "Alkali Metal",
      group: "1",
      period: 5,
      block: "s",
      electronConfiguration: "[Kr] 5s¹",
      description: "Rubidium is a chemical element with symbol Rb and atomic number 37. Rubidium is a soft, silvery-white metallic element of the alkali metal group."
    },
    {
      name: "Strontium",
      symbol: "Sr",
      atomicNumber: 38,
      atomicMass: "87.62",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 5,
      block: "s",
      electronConfiguration: "[Kr] 5s²",
      description: "Strontium is a chemical element with symbol Sr and atomic number 38. An alkaline earth metal, strontium is a soft silver-white yellowish metallic element that is highly chemically reactive."
    },
    {
      name: "Yttrium",
      symbol: "Y",
      atomicNumber: 39,
      atomicMass: "88.906",
      category: "Transition Metal",
      group: "3",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d¹ 5s²",
      description: "Yttrium is a chemical element with symbol Y and atomic number 39. It is a silvery-metallic transition metal chemically similar to the lanthanides and has often been classified as a 'rare-earth element'."
    },
    {
      name: "Zirconium",
      symbol: "Zr",
      atomicNumber: 40,
      atomicMass: "91.224",
      category: "Transition Metal",
      group: "4",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d² 5s²",
      description: "Zirconium is a chemical element with symbol Zr and atomic number 40. The name zirconium is taken from the name of the mineral zircon, the most important source of zirconium."
    },
    {
      name: "Niobium",
      symbol: "Nb",
      atomicNumber: 41,
      atomicMass: "92.906",
      category: "Transition Metal",
      group: "5",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d⁴ 5s¹",
      description: "Niobium is a chemical element with symbol Nb and atomic number 41. It is a soft, grey, crystalline, ductile transition metal, often found in the minerals pyrochlore and columbite, hence the former name 'columbium'."
    },
    {
      name: "Molybdenum",
      symbol: "Mo",
      atomicNumber: 42,
      atomicMass: "95.95",
      category: "Transition Metal",
      group: "6",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d⁵ 5s¹",
      description: "Molybdenum is a chemical element with symbol Mo and atomic number 42. The name is from Neo-Latin molybdaenum, from Ancient Greek Μόλυβδος molybdos, meaning lead, since its ores were confused with lead ores."
    },
    {
      name: "Technetium",
      symbol: "Tc",
      atomicNumber: 43,
      atomicMass: "(98)",
      category: "Transition Metal",
      group: "7",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d⁵ 5s²",
      description: "Technetium is a chemical element with symbol Tc and atomic number 43. It is the lightest element whose isotopes are all radioactive; none are stable, excluding the fully ionized state of ⁹⁷Tc."
    },
    {
      name: "Ruthenium",
      symbol: "Ru",
      atomicNumber: 44,
      atomicMass: "101.07",
      category: "Transition Metal",
      group: "8",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d⁷ 5s¹",
      description: "Ruthenium is a chemical element with symbol Ru and atomic number 44. It is a rare transition metal belonging to the platinum group of the periodic table."
    },
    {
      name: "Rhodium",
      symbol: "Rh",
      atomicNumber: 45,
      atomicMass: "102.91",
      category: "Transition Metal",
      group: "9",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d⁸ 5s¹",
      description: "Rhodium is a chemical element with symbol Rh and atomic number 45. It is a rare, silvery-white, hard, corrosion-resistant, and chemically inert transition metal."
    },
    {
      name: "Palladium",
      symbol: "Pd",
      atomicNumber: 46,
      atomicMass: "106.42",
      category: "Transition Metal",
      group: "10",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d¹⁰",
      description: "Palladium is a chemical element with symbol Pd and atomic number 46. It is a rare and lustrous silvery-white metal discovered in 1803 by William Hyde Wollaston."
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
      name: "Cadmium",
      symbol: "Cd",
      atomicNumber: 48,
      atomicMass: "112.41",
      category: "Transition Metal",
      group: "12",
      period: 5,
      block: "d",
      electronConfiguration: "[Kr] 4d¹⁰ 5s²",
      description: "Cadmium is a chemical element with symbol Cd and atomic number 48. This soft, bluish-white metal is chemically similar to the two other stable metals in group 12, zinc and mercury."
    },
    {
      name: "Indium",
      symbol: "In",
      atomicNumber: 49,
      atomicMass: "114.82",
      category: "Post-transition Metal",
      group: "13",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p¹",
      description: "Indium is a chemical element with symbol In and atomic number 49. It is a post-transition metal that makes up 0.21 parts per million of the Earth's crust."
    },
    {
      name: "Tin",
      symbol: "Sn",
      atomicNumber: 50,
      atomicMass: "118.71",
      category: "Post-transition Metal",
      group: "14",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p²",
      description: "Tin is a chemical element with symbol Sn and atomic number 50. It is a post-transition metal in group 14 of the periodic table."
    },
    {
      name: "Antimony",
      symbol: "Sb",
      atomicNumber: 51,
      atomicMass: "121.76",
      category: "Metalloid",
      group: "15",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p³",
      description: "Antimony is a chemical element with symbol Sb and atomic number 51. A lustrous gray metalloid, it is found in nature mainly as the sulfide mineral stibnite."
    },
    {
      name: "Tellurium",
      symbol: "Te",
      atomicNumber: 52,
      atomicMass: "127.60",
      category: "Metalloid",
      group: "16",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁴",
      description: "Tellurium is a chemical element with symbol Te and atomic number 52. It is a brittle, mildly toxic, rare, silver-white metalloid."
    },
    {
      name: "Iodine",
      symbol: "I",
      atomicNumber: 53,
      atomicMass: "126.90",
      category: "Halogen",
      group: "17",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁵",
      description: "Iodine is a chemical element with symbol I and atomic number 53. The name is from Greek ἰοειδής ioeidēs, meaning violet or purple, due to the color of elemental iodine vapor."
    },
    {
      name: "Xenon",
      symbol: "Xe",
      atomicNumber: 54,
      atomicMass: "131.29",
      category: "Noble Gas",
      group: "18",
      period: 5,
      block: "p",
      electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁶",
      description: "Xenon is a chemical element with symbol Xe and atomic number 54. It is a colorless, dense, odorless noble gas found in the Earth's atmosphere in trace amounts."
    },
    {
      name: "Cesium",
      symbol: "Cs",
      atomicNumber: 55,
      atomicMass: "132.91",
      category: "Alkali Metal",
      group: "1",
      period: 6,
      block: "s",
      electronConfiguration: "[Xe] 6s¹",
      description: "Cesium is a chemical element with symbol Cs and atomic number 55. It is a soft, silvery-golden alkali metal with a melting point of 28.5 °C, which makes it one of only five elemental metals that are liquid at or near room temperature."
    },
    {
      name: "Barium",
      symbol: "Ba",
      atomicNumber: 56,
      atomicMass: "137.33",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 6,
      block: "s",
      electronConfiguration: "[Xe] 6s²",
      description: "Barium is a chemical element with symbol Ba and atomic number 56. It is the fifth element in group 2 and is a soft, silvery alkaline earth metal."
    },
    {
      name: "Lanthanum",
      symbol: "La",
      atomicNumber: 57,
      atomicMass: "138.91",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 5d¹ 6s²",
      description: "Lanthanum is a chemical element with symbol La and atomic number 57. It is a soft, ductile, silvery-white metal that tarnishes rapidly when exposed to air and is soft enough to be cut with a knife."
    },
    {
      name: "Cerium",
      symbol: "Ce",
      atomicNumber: 58,
      atomicMass: "140.12",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹ 5d¹ 6s²",
      description: "Cerium is a chemical element with symbol Ce and atomic number 58. It is a soft, silvery, ductile metal which easily oxidizes in air."
    },
    {
      name: "Praseodymium",
      symbol: "Pr",
      atomicNumber: 59,
      atomicMass: "140.91",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f³ 6s²",
      description: "Praseodymium is a chemical element with symbol Pr and atomic number 59. It is a soft, silvery, malleable and ductile metal, valued for its magnetic, electrical, chemical, and optical properties."
    },
    {
      name: "Neodymium",
      symbol: "Nd",
      atomicNumber: 60,
      atomicMass: "144.24",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁴ 6s²",
      description: "Neodymium is a chemical element with symbol Nd and atomic number 60. It is a soft silvery metal that tarnishes in air."
    },
    {
      name: "Promethium",
      symbol: "Pm",
      atomicNumber: 61,
      atomicMass: "(145)",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁵ 6s²",
      description: "Promethium is a chemical element with symbol Pm and atomic number 61. All of its isotopes are radioactive; it is extremely rare, with only about 500-600 grams naturally occurring in Earth's crust at any given time."
    },
    {
      name: "Samarium",
      symbol: "Sm",
      atomicNumber: 62,
      atomicMass: "150.36",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁶ 6s²",
      description: "Samarium is a chemical element with symbol Sm and atomic number 62. It is a moderately hard silvery metal that slowly oxidizes in air."
    },
    {
      name: "Europium",
      symbol: "Eu",
      atomicNumber: 63,
      atomicMass: "151.96",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁷ 6s²",
      description: "Europium is a chemical element with symbol Eu and atomic number 63. It was isolated in 1901 and is named after the continent of Europe."
    },
    {
      name: "Gadolinium",
      symbol: "Gd",
      atomicNumber: 64,
      atomicMass: "157.25",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁷ 5d¹ 6s²",
      description: "Gadolinium is a chemical element with symbol Gd and atomic number 64. It is a silvery-white, malleable and ductile rare-earth metal."
    },
    {
      name: "Terbium",
      symbol: "Tb",
      atomicNumber: 65,
      atomicMass: "158.93",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f⁹ 6s²",
      description: "Terbium is a chemical element with symbol Tb and atomic number 65. It is a silvery-white, rare earth metal that is malleable, ductile, and soft enough to be cut with a knife."
    },
    {
      name: "Dysprosium",
      symbol: "Dy",
      atomicNumber: 66,
      atomicMass: "162.50",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹⁰ 6s²",
      description: "Dysprosium is a chemical element with symbol Dy and atomic number 66. It is a rare earth element with a metallic silver luster."
    },
    {
      name: "Holmium",
      symbol: "Ho",
      atomicNumber: 67,
      atomicMass: "164.93",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹¹ 6s²",
      description: "Holmium is a chemical element with symbol Ho and atomic number 67. Part of the lanthanide series, holmium is a rare-earth element."
    },
    {
      name: "Erbium",
      symbol: "Er",
      atomicNumber: 68,
      atomicMass: "167.26",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹² 6s²",
      description: "Erbium is a chemical element with symbol Er and atomic number 68. A silvery-white solid metal when artificially isolated, natural erbium is always found in chemical combination with other elements."
    },
    {
      name: "Thulium",
      symbol: "Tm",
      atomicNumber: 69,
      atomicMass: "168.93",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹³ 6s²",
      description: "Thulium is a chemical element with symbol Tm and atomic number 69. It is the thirteenth and third-last element in the lanthanide series."
    },
    {
      name: "Ytterbium",
      symbol: "Yb",
      atomicNumber: 70,
      atomicMass: "173.05",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹⁴ 6s²",
      description: "Ytterbium is a chemical element with symbol Yb and atomic number 70. It is the fourteenth and penultimate element in the lanthanide series, which is the basis of the relative stability of its +2 oxidation state."
    },
    {
      name: "Lutetium",
      symbol: "Lu",
      atomicNumber: 71,
      atomicMass: "174.97",
      category: "Lanthanide",
      group: "3",
      period: 6,
      block: "f",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹ 6s²",
      description: "Lutetium is a chemical element with symbol Lu and atomic number 71. It is a silvery white metal, which resists corrosion in dry air, but not in moist air."
    },
    {
      name: "Hafnium",
      symbol: "Hf",
      atomicNumber: 72,
      atomicMass: "178.49",
      category: "Transition Metal",
      group: "4",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d² 6s²",
      description: "Hafnium is a chemical element with symbol Hf and atomic number 72. A lustrous, silvery gray, tetravalent transition metal, hafnium chemically resembles zirconium and is found in many zirconium minerals."
    },
    {
      name: "Tantalum",
      symbol: "Ta",
      atomicNumber: 73,
      atomicMass: "180.95",
      category: "Transition Metal",
      group: "5",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d³ 6s²",
      description: "Tantalum is a chemical element with symbol Ta and atomic number 73. A rare, hard, blue-gray, lustrous transition metal, tantalum is highly corrosion-resistant."
    },
    {
      name: "Tungsten",
      symbol: "W",
      atomicNumber: 74,
      atomicMass: "183.84",
      category: "Transition Metal",
      group: "6",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d⁴ 6s²",
      description: "Tungsten, also known as wolfram, is a chemical element with symbol W and atomic number 74. The free element is remarkable for its robustness, especially the fact that it has the highest melting point of all the elements."
    },
    {
      name: "Rhenium",
      symbol: "Re",
      atomicNumber: 75,
      atomicMass: "186.21",
      category: "Transition Metal",
      group: "7",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d⁵ 6s²",
      description: "Rhenium is a chemical element with symbol Re and atomic number 75. It is a silvery-white, heavy, third-row transition metal in group 7 of the periodic table."
    },
    {
      name: "Osmium",
      symbol: "Os",
      atomicNumber: 76,
      atomicMass: "190.23",
      category: "Transition Metal",
      group: "8",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d⁶ 6s²",
      description: "Osmium is a chemical element with symbol Os and atomic number 76. It is a hard, brittle, bluish-white transition metal in the platinum group that is found as a trace element in alloys, mostly in platinum ores."
    },
    {
      name: "Iridium",
      symbol: "Ir",
      atomicNumber: 77,
      atomicMass: "192.22",
      category: "Transition Metal",
      group: "9",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d⁷ 6s²",
      description: "Iridium is a chemical element with symbol Ir and atomic number 77. A very hard, brittle, silvery-white transition metal of the platinum group, iridium is the second-densest element."
    },
    {
      name: "Platinum",
      symbol: "Pt",
      atomicNumber: 78,
      atomicMass: "195.08",
      category: "Transition Metal",
      group: "10",
      period: 6,
      block: "d",
      electronConfiguration: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
      description: "Platinum is a chemical element with symbol Pt and atomic number 78. It is a dense, malleable, ductile, highly unreactive, precious, gray-white transition metal."
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
      name: "Thallium",
      symbol: "Tl",
      atomicNumber: 81,
      atomicMass: "204.38",
      category: "Post-transition Metal",
      group: "13",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",
      description: "Thallium is a chemical element with symbol Tl and atomic number 81. This soft gray post-transition metal is not found free in nature."
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
      name: "Bismuth",
      symbol: "Bi",
      atomicNumber: 83,
      atomicMass: "208.98",
      category: "Post-transition Metal",
      group: "15",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",
      description: "Bismuth is a chemical element with symbol Bi and atomic number 83. Bismuth, a pentavalent post-transition metal, chemically resembles arsenic and antimony."
    },
    {
      name: "Polonium",
      symbol: "Po",
      atomicNumber: 84,
      atomicMass: "(209)",
      category: "Post-transition Metal",
      group: "16",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",
      description: "Polonium is a chemical element with symbol Po and atomic number 84. A rare and highly radioactive metal with no stable isotopes, polonium is chemically similar to selenium and tellurium."
    },
    {
      name: "Astatine",
      symbol: "At",
      atomicNumber: 85,
      atomicMass: "(210)",
      category: "Halogen",
      group: "17",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",
      description: "Astatine is a chemical element with symbol At and atomic number 85. It is the rarest naturally occurring element in the Earth's crust, occurring only as the decay product of various heavier elements."
    },
    {
      name: "Radon",
      symbol: "Rn",
      atomicNumber: 86,
      atomicMass: "(222)",
      category: "Noble Gas",
      group: "18",
      period: 6,
      block: "p",
      electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",
      description: "Radon is a chemical element with symbol Rn and atomic number 86. It is a radioactive, colorless, odorless, tasteless noble gas."
    },
    {
      name: "Francium",
      symbol: "Fr",
      atomicNumber: 87,
      atomicMass: "(223)",
      category: "Alkali Metal",
      group: "1",
      period: 7,
      block: "s",
      electronConfiguration: "[Rn] 7s¹",
      description: "Francium is a chemical element with symbol Fr and atomic number 87. It was discovered by Marguerite Perey in France in 1939. It is the second-most electropositive element, behind only cesium."
    },
    {
      name: "Radium",
      symbol: "Ra",
      atomicNumber: 88,
      atomicMass: "(226)",
      category: "Alkaline Earth Metal",
      group: "2",
      period: 7,
      block: "s",
      electronConfiguration: "[Rn] 7s²",
      description: "Radium is a chemical element with symbol Ra and atomic number 88. It is the sixth element in group 2 of the periodic table, also known as the alkaline earth metals."
    },
    {
      name: "Actinium",
      symbol: "Ac",
      atomicNumber: 89,
      atomicMass: "(227)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 6d¹ 7s²",
      description: "Actinium is a chemical element with symbol Ac and atomic number 89. It was first isolated by Friedrich Oskar Giesel in 1902, who gave it the name emanium."
    },
    {
      name: "Thorium",
      symbol: "Th",
      atomicNumber: 90,
      atomicMass: "232.04",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 6d² 7s²",
      description: "Thorium is a chemical element with symbol Th and atomic number 90. A radioactive actinide metal, thorium is one of only four radioactive elements that still occur naturally in significant quantities as a primordial element."
    },
    {
      name: "Protactinium",
      symbol: "Pa",
      atomicNumber: 91,
      atomicMass: "231.04",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f² 6d¹ 7s²",
      description: "Protactinium is a chemical element with symbol Pa and atomic number 91. It is a dense, silvery-gray metal which readily reacts with oxygen, water vapor and inorganic acids."
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
    },
    {
      name: "Neptunium",
      symbol: "Np",
      atomicNumber: 93,
      atomicMass: "(237)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f⁴ 6d¹ 7s²",
      description: "Neptunium is a chemical element with symbol Np and atomic number 93. A radioactive actinide metal, neptunium is the first transuranic element."
    },
    {
      name: "Plutonium",
      symbol: "Pu",
      atomicNumber: 94,
      atomicMass: "(244)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f⁶ 7s²",
      description: "Plutonium is a chemical element with symbol Pu and atomic number 94. It is an actinide metal of silvery-gray appearance that tarnishes when exposed to air."
    },
    {
      name: "Americium",
      symbol: "Am",
      atomicNumber: 95,
      atomicMass: "(243)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f⁷ 7s²",
      description: "Americium is a chemical element with symbol Am and atomic number 95. It is a transuranic member of the actinide series, in the periodic table located under the lanthanide element europium."
    },
    {
      name: "Curium",
      symbol: "Cm",
      atomicNumber: 96,
      atomicMass: "(247)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f⁷ 6d¹ 7s²",
      description: "Curium is a chemical element with symbol Cm and atomic number 96. It is a hard, dense, silvery metal with a relatively high melting point and boiling point for an actinide."
    },
    {
      name: "Berkelium",
      symbol: "Bk",
      atomicNumber: 97,
      atomicMass: "(247)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f⁹ 7s²",
      description: "Berkelium is a chemical element with symbol Bk and atomic number 97. It is a member of the actinide and transuranium element series."
    },
    {
      name: "Californium",
      symbol: "Cf",
      atomicNumber: 98,
      atomicMass: "(251)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹⁰ 7s²",
      description: "Californium is a chemical element with symbol Cf and atomic number 98. The element was first made in 1950 at the University of California Radiation Laboratory in Berkeley."
    },
    {
      name: "Einsteinium",
      symbol: "Es",
      atomicNumber: 99,
      atomicMass: "(252)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹¹ 7s²",
      description: "Einsteinium is a chemical element with symbol Es and atomic number 99. It is the seventh transuranic element, and an actinide."
    },
    {
      name: "Fermium",
      symbol: "Fm",
      atomicNumber: 100,
      atomicMass: "(257)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹² 7s²",
      description: "Fermium is a chemical element with symbol Fm and atomic number 100. It is a member of the actinide series."
    },
    {
      name: "Mendelevium",
      symbol: "Md",
      atomicNumber: 101,
      atomicMass: "(258)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹³ 7s²",
      description: "Mendelevium is a chemical element with symbol Md and atomic number 101. A metallic radioactive transuranic element in the actinide series, it is the first element that currently cannot be produced in macroscopic quantities."
    },
    {
      name: "Nobelium",
      symbol: "No",
      atomicNumber: 102,
      atomicMass: "(259)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹⁴ 7s²",
      description: "Nobelium is a chemical element with symbol No and atomic number 102. It is named in honor of Alfred Nobel, the inventor of dynamite and benefactor of science."
    },
    {
      name: "Lawrencium",
      symbol: "Lr",
      atomicNumber: 103,
      atomicMass: "(262)",
      category: "Actinide",
      group: "3",
      period: 7,
      block: "f",
      electronConfiguration: "[Rn] 5f¹⁴ 7s² 7p¹",
      description: "Lawrencium is a chemical element with symbol Lr and atomic number 103. It is named in honor of Ernest Lawrence, inventor of the cyclotron, a device that was used to discover many artificial radioactive elements."
    },
    {
      name: "Rutherfordium",
      symbol: "Rf",
      atomicNumber: 104,
      atomicMass: "(267)",
      category: "Transition Metal",
      group: "4",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d² 7s²",
      description: "Rutherfordium is a chemical element with symbol Rf and atomic number 104, named after physicist Ernest Rutherford."
    },
    {
      name: "Dubnium",
      symbol: "Db",
      atomicNumber: 105,
      atomicMass: "(268)",
      category: "Transition Metal",
      group: "5",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d³ 7s²",
      description: "Dubnium is a chemical element with symbol Db and atomic number 105. It is named after the town of Dubna in Russia where it was first produced."
    },
    {
      name: "Seaborgium",
      symbol: "Sg",
      atomicNumber: 106,
      atomicMass: "(269)",
      category: "Transition Metal",
      group: "6",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁴ 7s²",
      description: "Seaborgium is a chemical element with symbol Sg and atomic number 106. It is named after American nuclear chemist Glenn T. Seaborg."
    },
    {
      name: "Bohrium",
      symbol: "Bh",
      atomicNumber: 107,
      atomicMass: "(270)",
      category: "Transition Metal",
      group: "7",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁵ 7s²",
      description: "Bohrium is a chemical element with symbol Bh and atomic number 107. It is named after Danish physicist Niels Bohr."
    },
    {
      name: "Hassium",
      symbol: "Hs",
      atomicNumber: 108,
      atomicMass: "(277)",
      category: "Transition Metal",
      group: "8",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁶ 7s²",
      description: "Hassium is a chemical element with symbol Hs and atomic number 108. It is named after the German state of Hesse."
    },
    {
      name: "Meitnerium",
      symbol: "Mt",
      atomicNumber: 109,
      atomicMass: "(278)",
      category: "Unknown",
      group: "9",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁷ 7s²",
      description: "Meitnerium is a chemical element with symbol Mt and atomic number 109. It is named after Austrian physicist Lise Meitner."
    },
    {
      name: "Darmstadtium",
      symbol: "Ds",
      atomicNumber: 110,
      atomicMass: "(281)",
      category: "Unknown",
      group: "10",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁸ 7s²",
      description: "Darmstadtium is a chemical element with symbol Ds and atomic number 110. It is named after the German city of Darmstadt where it was discovered."
    },
    {
      name: "Roentgenium",
      symbol: "Rg",
      atomicNumber: 111,
      atomicMass: "(282)",
      category: "Unknown",
      group: "11",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d⁹ 7s²",
      description: "Roentgenium is a chemical element with symbol Rg and atomic number 111. It is named after the German physicist Wilhelm Röntgen."
    },
    {
      name: "Copernicium",
      symbol: "Cn",
      atomicNumber: 112,
      atomicMass: "(285)",
      category: "Unknown",
      group: "12",
      period: 7,
      block: "d",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s²",
      description: "Copernicium is a chemical element with symbol Cn and atomic number 112. It is named after astronomer Nicolaus Copernicus."
    },
    {
      name: "Nihonium",
      symbol: "Nh",
      atomicNumber: 113,
      atomicMass: "(286)",
      category: "Unknown",
      group: "13",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",
      description: "Nihonium is a chemical element with symbol Nh and atomic number 113. It is named after Japan (Nihon in Japanese)."
    },
    {
      name: "Flerovium",
      symbol: "Fl",
      atomicNumber: 114,
      atomicMass: "(289)",
      category: "Unknown",
      group: "14",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",
      description: "Flerovium is a chemical element with symbol Fl and atomic number 114. It is named after the Flerov Laboratory of Nuclear Reactions in Russia."
    },
    {
      name: "Moscovium",
      symbol: "Mc",
      atomicNumber: 115,
      atomicMass: "(290)",
      category: "Unknown",
      group: "15",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",
      description: "Moscovium is a chemical element with symbol Mc and atomic number 115. It is named after the Moscow region where the Joint Institute for Nuclear Research is located."
    },
    {
      name: "Livermorium",
      symbol: "Lv",
      atomicNumber: 116,
      atomicMass: "(293)",
      category: "Unknown",
      group: "16",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",
      description: "Livermorium is a chemical element with symbol Lv and atomic number 116. It is named after the Lawrence Livermore National Laboratory in the United States."
    },
    {
      name: "Tennessine",
      symbol: "Ts",
      atomicNumber: 117,
      atomicMass: "(294)",
      category: "Unknown",
      group: "17",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",
      description: "Tennessine is a chemical element with symbol Ts and atomic number 117. It is named after the state of Tennessee, United States."
    },
    {
      name: "Oganesson",
      symbol: "Og",
      atomicNumber: 118,
      atomicMass: "(294)",
      category: "Unknown",
      group: "18",
      period: 7,
      block: "p",
      electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",
      description: "Oganesson is a chemical element with symbol Og and atomic number 118. It is named after Russian nuclear physicist Yuri Oganessian."
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
