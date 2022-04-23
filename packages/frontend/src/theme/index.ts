import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";
import { fonts } from "./fonts";

const theme = createTheme({
  palette: { ...colors },
  typography: { ...fonts },
});

export default theme;
