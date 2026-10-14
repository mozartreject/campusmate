import React, { useState } from 'react';
import { createSvgAvatar } from '../utils/avatarUtils';

interface SafeAvatarProps {
  src?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({
  src,
  alt,
  className = 'w-10 h-10 rounded-full object-cover',
  onClick,
  title
}) => {
  const [hasError, setHasError] = useState(false);

  // Fallback SVG avatar generated deterministically based on name
  const fallbackSvg = createSvgAvatar(
    alt.slice(0, 3).toLowerCase(),
    ['#4F46E5', '#3730A3'],
    '#6366F1',
    !alt.toLowerCase().includes('joshua') && !alt.toLowerCase().includes('aarav')
  );

  const effectiveSrc = (hasError || !src) ? fallbackSvg : src;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      title={title || alt}
      onError={() => setHasError(true)}
      onClick={onClick}
      className={className}
      loading="lazy"
    />
  );
};
