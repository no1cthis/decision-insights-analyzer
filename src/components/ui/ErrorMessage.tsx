import { FC, ReactNode } from 'react';

interface ErrorMessageProps {
  error: string | ReactNode;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error, className = '' }) => (
  <div className={`text-sm text-red-600 text-center ${className}`}>{error}</div>
);

export { ErrorMessage };
