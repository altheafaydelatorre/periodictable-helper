
// Each letter is substituted with another letter
export const generateSubstitution = (): Record<string, string> => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let shuffled = [...alphabet].sort(() => Math.random() - 0.5).join('');
  
  // Ensure no letter maps to itself
  for (let i = 0; i < alphabet.length; i++) {
    if (shuffled[i] === alphabet[i]) {
      // Swap with another position
      const swapIndex = (i + 1) % alphabet.length;
      const chars = [...shuffled];
      [chars[i], chars[swapIndex]] = [chars[swapIndex], chars[i]];
      shuffled = chars.join('');
    }
  }
  
  const substitution: Record<string, string> = {};
  for (let i = 0; i < alphabet.length; i++) {
    substitution[alphabet[i]] = shuffled[i];
  }
  
  return substitution;
};

// Encrypt a plaintext message
export const encryptMessage = (text: string, substitution: Record<string, string>): string => {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      // Preserve spaces and punctuation
      if (!/[A-Z]/.test(char)) return char;
      return substitution[char] || char;
    })
    .join('');
};

// Attempt to decrypt using a user-supplied key
export const decryptWithKey = (encrypted: string, userKey: Record<string, string>): string => {
  // Create a reverse mapping
  const reverseMap: Record<string, string> = {};
  Object.entries(userKey).forEach(([plain, cipher]) => {
    if (cipher) reverseMap[cipher] = plain;
  });
  
  return encrypted
    .split('')
    .map(char => {
      // Preserve spaces and punctuation
      if (!/[A-Z]/.test(char)) return char;
      return reverseMap[char] || char;
    })
    .join('');
};

// Get all unique cipher letters in the encrypted text
export const getUniqueLetters = (text: string): string[] => {
  const uniqueLetters = new Set<string>();
  
  text.toUpperCase().split('').forEach(char => {
    if (/[A-Z]/.test(char)) {
      uniqueLetters.add(char);
    }
  });
  
  return Array.from(uniqueLetters).sort();
};

// Sample quotes for the cryptogram
export const sampleQuotes = [
  "The only way to do great work is to love what you do",
  "Life is what happens when you're busy making other plans",
  "The future belongs to those who believe in the beauty of their dreams",
  "It is never too late to be what you might have been",
  "Everything you can imagine is real",
  "The journey of a thousand miles begins with one step"
];

// Get a random quote
export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
  return sampleQuotes[randomIndex];
};

// Helper to check if a solution is correct
export const checkSolution = (
  encrypted: string, 
  original: string, 
  userKey: Record<string, string>
): boolean => {
  const decrypted = decryptWithKey(encrypted, userKey);
  return decrypted.toUpperCase() === original.toUpperCase();
};
