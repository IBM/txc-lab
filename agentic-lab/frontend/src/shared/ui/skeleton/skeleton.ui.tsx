import { CSSProperties } from 'react';
import { SkeletonText, SkeletonPlaceholder } from '@carbon/react';

export function Skeleton(props: {
  variant?: 'circular' | 'rectangular' | 'rounded' | 'text';
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}) {
  const { variant = 'text', width = 80, height = 16, style } = props;

  let borderRadius;
  if (variant === 'circular') {
    borderRadius = '50%';
  } else if (variant === 'rounded') {
    borderRadius = '4px';
  }

  const st = {
    width: isNumber(width) ? `${width}px` : width,
    height: isNumber(height) ? `${height}px` : height,
    borderRadius,
    ...style,
  };

  if (variant === 'text') {
    return (
      <div style={st}>
        <SkeletonText />
      </div>
    );
  }

  return (
    <div style={st}>
      <SkeletonPlaceholder />
    </div>
  );
}

function isNumber(value: string | number): value is number {
  return typeof value === 'number';
}
