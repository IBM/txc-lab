import { useState } from 'react';
import { UserAvatar } from '@carbon/react/icons';
import './avatar.css';

type AvatarProps = {
  src?: string | null;
  alt?: string;
  username: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export function Avatar({ src, alt, username, size = 'medium', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !src || imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const getSizeInPixels = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 40;
    }
  };

  const sizeClass = `avatar-${size}`;
  const avatarClass = `avatar ${sizeClass} ${className}`.trim();

  if (showPlaceholder) {
    return (
      <div className={`${avatarClass} avatar-placeholder`} title={username}>
        <UserAvatar size={getSizeInPixels()} />
      </div>
    );
  }

  return <img src={src} alt={alt || username} className={avatarClass} onError={handleImageError} title={username} />;
}
