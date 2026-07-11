import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { ProgressProvider } from './ProgressContext';

/** 统一挂载所有全局 Provider，避免在每个入口重复嵌套。 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useTheme } from './ThemeContext';
export { useAuth } from './AuthContext';
export { useProgress } from './ProgressContext';
