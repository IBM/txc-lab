import { Toggle as CarbonToggle } from '@carbon/react';

/**
 * InlineToggle - A reusable inline toggle component
 */
interface InlineToggleProps {
  /** Unique ID for the toggle */
  id: string;
  /** Current toggle state */
  toggled: boolean;
  /** Function to call when toggle state changes */
  onToggle: () => void;
  /** Short one or two word label to show next to toggle */
  labelText: string;

  className?: string;
}

/**
 * A reusable inline toggle component that hides its label
 */
export default function Toggle({ id, toggled, onToggle, labelText, className = '' }: InlineToggleProps) {
  return (
    <CarbonToggle id={id} className={className} labelText={labelText} hideLabel toggled={toggled} onToggle={onToggle} />
  );
}

// Made with Bob
