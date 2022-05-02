import { AlertColor } from "@mui/material";

export interface Snackbar {
  type: AlertColor;
  title?: string;
  message?: string;
  transaction?: string;
  autoHideDuration?: number | null;
}
