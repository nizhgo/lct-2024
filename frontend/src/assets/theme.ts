// @ts-expect-error-next-line
import { Theme } from "@emotion/react";

export const theme = {
  colors: {
    primary: "#D9282F", // Цвет кнопки "Войти"
    secondary: "#000000", // Цвет кнопки "Зарегистрироваться"
    background: "#F8F9FA", // Цвет фона
    text: "#000000", // Цвет текста
    textSecondary: "#6C757D", // Вторичный цвет текста
    link: "#04c", // Цвет ссылки
    inputBorder: "#CED4DA", // Цвет границы инпута
    error: "#DC3545",
    input: {
      background: "#F8F9FA",
      border: "#CED4DA",
      text: "#000000",
      error: "#DC3545",
      focus: "#04c",
    },
    tooltip: {
      background: "#ffffff",
      border: "#CED4DA",
      text: "#000000",
    },
    button: {
      text: "#ffffff",
      red: "#D9282F",
      blue: "#04c",
      black: "#000000",
    },
  },
};

type BaseTheme = typeof theme;

declare module "@emotion/react" {
  export interface Theme extends BaseTheme {}
}
