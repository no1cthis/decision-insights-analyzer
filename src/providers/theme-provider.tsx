import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { FC } from 'react';

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
};

export { ThemeProvider };
