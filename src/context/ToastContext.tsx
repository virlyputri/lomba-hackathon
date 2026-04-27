import { createContext } from 'react';

import type { AlertColor } from '@mui/material/Alert';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
