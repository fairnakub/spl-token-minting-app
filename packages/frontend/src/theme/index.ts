import { createTheme } from "@mui/material/styles";
import { fonts } from "./fonts";

const theme = createTheme({
  typography: { ...fonts },
});

export default theme;
