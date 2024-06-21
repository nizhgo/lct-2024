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
      black: "#272727",
    },
    status: {
      active: "#008767", // зеленый
      inactive: "#DF0404", // красный
      new: "#FF0000", // Red for new requests
      processed_auto: "#FFA500", // Orange for automatically processed requests
      processed: "#24A3FF", // Blue for manually processed requests
      completed: "#008000", // Green for completed requests
    },
    backgrounds: {
      new: "rgba(255, 0, 0, 0.3)",
      processed_auto: "rgba(255, 165, 0, 0.3)",
      processed: "rgba(255, 255, 0, 0.3)",
      completed: "rgba(0, 128, 0, 0.3)",
    },
  },
  breakpoints: {
    mobile: "768px",
  },
};

type BaseTheme = typeof theme;

declare module "@emotion/react" {
  export interface Theme extends BaseTheme {}
}
