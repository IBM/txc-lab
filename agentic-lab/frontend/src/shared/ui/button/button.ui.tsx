import { ButtonHTMLAttributes } from 'react';
import { Button as CarbonButton } from '@carbon/react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'secondary';
  variant?: 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export function Button(props: ButtonProps) {
  const { color = 'primary', size = 'sm', variant, children, ...other } = props;

  const kind = color === 'secondary' ? 'secondary' : 'primary';
  const carbonSize = size === 'xl' ? 'lg' : size;

  return (
    <CarbonButton kind={variant === 'outline' ? 'ghost' : kind} size={carbonSize} {...other}>
      {children}
    </CarbonButton>
  );
}
