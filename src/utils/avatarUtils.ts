// Self-contained offline SVG avatars with 0 network dependency

export const createSvgAvatar = (seed: string, bgGradient: [string, string], accentColor: string, isFemale: boolean = true): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="bg-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
      <linearGradient id="skin-${seed}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FDDFC7" />
        <stop offset="100%" stop-color="#F3C3A0" />
      </linearGradient>
    </defs>
    <!-- Background Circle -->
    <rect width="120" height="120" rx="60" fill="url(#bg-${seed})" />
    
    <!-- Body / Shoulders -->
    <path d="M 24,120 C 24,96 40,84 60,84 C 80,84 96,96 96,120 Z" fill="${accentColor}" opacity="0.95" />
    <path d="M 46,84 L 74,84 L 70,98 L 50,98 Z" fill="#E5AB86" />
    
    <!-- Face / Head -->
    <ellipse cx="60" cy="56" rx="22" ry="26" fill="url(#skin-${seed})" />
    
    ${isFemale ? `
      <!-- Female Hair -->
      <path d="M 36,54 C 34,30 50,22 60,22 C 70,22 86,30 84,54 C 84,56 80,52 78,44 C 70,36 50,36 42,44 C 40,52 36,56 36,54 Z" fill="#2D2118" />
      <path d="M 36,48 C 32,58 32,74 38,82 C 39,80 40,68 40,60 Z" fill="#2D2118" />
      <path d="M 84,48 C 88,58 88,74 82,82 C 81,80 80,68 80,60 Z" fill="#2D2118" />
    ` : `
      <!-- Male Hair -->
      <path d="M 36,46 C 36,28 50,22 60,22 C 70,22 84,28 84,46 C 80,38 74,34 60,34 C 46,34 40,38 36,46 Z" fill="#1C1E24" />
      <path d="M 36,44 L 38,58 L 41,56 L 40,44 Z" fill="#1C1E24" />
      <path d="M 84,44 L 82,58 L 79,56 L 80,44 Z" fill="#1C1E24" />
    `}
    
    <!-- Eyes -->
    <circle cx="52" cy="54" r="2.8" fill="#1E293B" />
    <circle cx="68" cy="54" r="2.8" fill="#1E293B" />
    <circle cx="53" cy="53" r="0.9" fill="#FFFFFF" />
    <circle cx="69" cy="53" r="0.9" fill="#FFFFFF" />
    
    <!-- Glasses / Eyebrows -->
    <path d="M 47,48 Q 52,46 56,48" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round" fill="none" />
    <path d="M 64,48 Q 68,46 73,48" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round" fill="none" />
    
    <!-- Smile -->
    <path d="M 54,64 Q 60,70 66,64" stroke="#A84C32" stroke-width="2" stroke-linecap="round" fill="none" />
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Preset Avatars for the Scholars
export const defaultAvatars = {
  janviPorwal: createSvgAvatar('jp', ['#6366F1', '#4338CA'], '#4F46E5', true),
  janviJain: createSvgAvatar('jj', ['#EC4899', '#BE185D'], '#DB2777', true),
  joshuaRebello: createSvgAvatar('jr', ['#3B82F6', '#1D4ED8'], '#2563EB', false),
  aaravSharma: createSvgAvatar('as', ['#10B981', '#047857'], '#059669', false)
};

// Preset gallery for profile photo selection
export const avatarPresets = [
  { id: 'preset-1', name: 'Scholar Purple', url: createSvgAvatar('p1', ['#8B5CF6', '#6D28D9'], '#7C3AED', true) },
  { id: 'preset-2', name: 'Engineer Blue', url: createSvgAvatar('p2', ['#3B82F6', '#1E40AF'], '#2563EB', false) },
  { id: 'preset-3', name: 'Researcher Rose', url: createSvgAvatar('p3', ['#F43F5E', '#BE123C'], '#E11D48', true) },
  { id: 'preset-4', name: 'Data Scientist Teal', url: createSvgAvatar('p4', ['#14B8A6', '#0F766E'], '#0D9488', false) },
  { id: 'preset-5', name: 'Achiever Amber', url: createSvgAvatar('p5', ['#F59E0B', '#B45309'], '#D97706', true) },
  { id: 'preset-6', name: 'Designer Indigo', url: createSvgAvatar('p6', ['#6366F1', '#3730A3'], '#4F46E5', false) },
];
