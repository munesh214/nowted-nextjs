import { createTheme } from "@mui/material";
// import { PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
  }
  interface PaletteOptions {
    custom?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
      custom: true;
    }
  }

const nowtedTheme = createTheme({
    palette:{
        custom:{
            main: "rgba(24, 24, 24, 1)",
            dark: "rgba(255, 255, 255, 0.1)",
            light: "rgba(255, 255, 255, 0.03)",
            contrastText: "rgba(28, 28, 28, 1)"
        },
    },
})

export default nowtedTheme;