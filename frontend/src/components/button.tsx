import { keyframes } from "@emotion/css";
import styled from "@emotion/styled";

interface ButtonProps {
  size?: "small" | "medium" | "large" | "compact";
  variant?: "red" | "blue" | "black" | "transparent";
  disabled?: boolean;
  pending?: boolean;
}

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const buttonStyles = (x: ButtonProps) => `
  padding: ${x.size === "small" ? "8px 12px" : x.size === "compact" ? "4px 8px" : "12px 24px"};
  font-family: "MoscowSans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: ${x.disabled || x.pending ? "not-allowed" : "pointer"};
  opacity: ${x.disabled ? 0.6 : 1};
  filter: ${x.pending ? "grayscale(0.2)" : "none"};
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border-radius: 4px;
  transition: 0.24s;

  &:disabled {
    cursor: not-allowed;
  }
  
  &:before {
    content: "";
    display: ${x.pending ? "block" : "none"};
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
  }
  
  &:hover {
    filter: ${x.disabled || x.pending ? "none" : "opacity(0.92) brightness(1.12)"};
  }
  
  span {
    visibility: ${x.pending ? "hidden" : "visible"};
  }
`;

export const PrimaryButton = styled.button<ButtonProps>`
  background: ${(p) =>
    p.variant ? p.theme.colors.button[p.variant] : p.theme.colors.primary};
  border: none;
  color: ${(p) => (p.pending ? "transparent" : p.theme.colors.button.text)};
  ${(p) => buttonStyles(p)}
`;

export const TransparentButton = styled.button<ButtonProps>`
  background: transparent;
  border: 2px solid
    ${(p) =>
      p.variant
        ? (p.theme.colors.button[p.variant] as string)
        : p.theme.colors.primary};
  color: ${(p) => p.variant && p.theme.colors.button[p.variant]};
  ${(p) => buttonStyles(p)}
`;

export const Button = Object.assign(PrimaryButton, {
  Transparent: TransparentButton,
});

export const BackButton = styled.button`
  background: transparent;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.link};
  text-decoration: underline;
  text-decoration-style: dotted;

  &:hover {
    color: ${(p) => p.theme.colors.linkHover};
  }
`;
