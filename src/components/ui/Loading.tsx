import { FC } from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: FC<LoadingProps> = ({ message = 'Loading...', className = '' }) => (
  <div className={`text-center py-8 text-muted-foreground ${className}`}>{message}</div>
);

export { Loading };
