export const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export type Theme = typeof theme;

declare module "@emotion/react" {
  export interface Theme extends Theme {}
}
