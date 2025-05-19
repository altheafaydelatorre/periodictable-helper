
// Morse code mapping
export const textToMorse: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
};

// Morse code to text mapping
export const morseToText: Record<string, string> = Object.entries(textToMorse).reduce(
  (acc, [char, morse]) => ({
    ...acc,
    [morse]: char
  }),
  {}
);

// Convert text to morse code
export const convertTextToMorse = (text: string): string => {
  return text
    .toUpperCase()
    .split('')
    .map(char => textToMorse[char] || char)
    .join(' ');
};

// Convert morse code to text
export const convertMorseToText = (morse: string): string => {
  return morse
    .split(' ')
    .map(code => morseToText[code] || code)
    .join('');
};

// Predict morse code as user types
export const predictMorse = (input: string): string => {
  return convertTextToMorse(input);
};

// Predict text as user types morse
export const predictText = (input: string): string => {
  // Only attempt conversion if input has morse characters
  if (!/^[.\-/ ]*$/.test(input)) return '';
  
  return convertMorseToText(input);
};
