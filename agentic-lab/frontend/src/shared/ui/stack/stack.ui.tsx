import React, { CSSProperties } from 'react';
import { Stack as CarbonStack } from '@carbon/react';

export function Stack(props: {
  direction?: 'column-reverse' | 'column' | 'row-reverse' | 'row';
  spacing?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  noWrap?: boolean;
  style?: CSSProperties;
  gap?: number;
  children: React.ReactNode;
}) {
  const {
    direction = 'row',
    spacing = 8,
    gap,
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    noWrap = false,
    style,
    children,
  } = props;

  const orientation = direction?.includes('column') ? 'vertical' : 'horizontal';
  const finalGap = gap !== undefined ? gap : spacing / 4;

  // Carbon Stack expects gap as a string (e.g., '1', '2', etc.)
  const carbonGap = String(Math.min(Math.max(1, finalGap), 10));

  return (
    <CarbonStack
      orientation={orientation}
      gap={carbonGap}
      style={{
        alignItems,
        justifyContent,
        flexWrap: noWrap ? 'nowrap' : 'wrap',
        flexDirection: direction as any,
        ...style,
      }}
    >
      {children}
    </CarbonStack>
  );
}
