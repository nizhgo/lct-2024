import styled from "@emotion/styled";
import {
  CSSProperties,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Text } from "components/text";
import { useTheme } from "@emotion/react";
import { UseFormRegisterReturn } from "react-hook-form";

const InputRoot = styled.input<{ hasError?: boolean }>`
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  border: none;
  color: ${(p) =>
    p.hasError ? p.theme.colors.error : p.theme.colors.input.text};
  flex: 1;
  padding: 6px 10px;
  height: 100%;
  &:focus {
    outline: none;
  }
`;

const InputContainer = styled.div<{
  fullWidth?: boolean;
  width?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: ${(p) => (p.fullWidth ? "100%" : p.width ?? "auto")};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
`;

const Wrapper = styled.div<{
  bordered?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid
    ${(p) => (p.hasError ? p.theme.colors.error : p.theme.colors.inputBorder)};
  border-radius: 4px;
  background-color: ${(p) => p.theme.colors.input.background};
  position: relative;

  &:hover #clearButton {
    visibility: visible;
  }

  input:disabled {
    background-color: ${(p) => p.theme.colors.input.background};
  }

  ${(p) =>
    p.disabled &&
    `
    background-color: ${p.theme.colors.input.background};
    opacity: 0.5;
    pointer-events: none;
  `}

  :focus-within {
    border-color: ${(p) => !p.hasError && p.theme.colors.input.focus};
    #clearButton {
      visibility: visible;
    }
  }
`;

const ClearButton = styled.button`
  margin-right: 4px;
  visibility: hidden;
  background: none;
  border: none;
  cursor: pointer;
`;

export interface InputProps {
  type?: "text" | "number" | "password";
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  textAlign?: CSSProperties["textAlign"];
  style?: CSSProperties;
  className?: string;
  outerContainerStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onKeyDown?: KeyboardEventHandler;
  error?: string | null;
  bordered?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  label?: ReactNode;
  size?: "small" | "medium" | "large";
  inputSize?: number;
  fullWidth?: boolean;
  width?: string;
  withClear?: boolean;
  required?: boolean;
  register?: UseFormRegisterReturn;
}

export const InputBase = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const theme = useTheme();
    return (
      <InputContainer
        fullWidth={props.fullWidth}
        width={props.width}
        style={props.outerContainerStyle}
      >
        {props.label && (
          <Label>
            {props.label}{" "}
            {props.required && (
              <span style={{ color: theme.colors.error }}>*</span>
            )}
          </Label>
        )}
        <Wrapper
          title={props.title}
          className={props.className}
          style={props.containerStyle}
          bordered={props.bordered}
          hasError={!!props.error}
          disabled={props.disabled}
        >
          {props.left}
          <InputRoot
            type={props.type}
            defaultValue={props.defaultValue ?? ""}
            readOnly={props.readonly}
            placeholder={props.placeholder}
            aria-invalid={!!props.error}
            spellCheck={false}
            disabled={props.disabled}
            style={{ textAlign: props.textAlign, ...props.style }}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onKeyDown={props.onKeyDown}
            ref={ref}
            hasError={!!props.error}
            {...props.register}
          />
          <div style={{ position: "absolute", right: 0 }} aria-hidden>
            {props.right}
            {!props.disabled &&
              props.withClear &&
              !props.readonly &&
              props.defaultValue && (
                <ClearButton
                  onClick={() => props.onChange?.("")}
                  title="Clear"
                  id="clearButton"
                >
                  <Text
                    fontFamily={"IcoMoon"}
                    size={14}
                    color={theme.colors.textSecondary}
                  >
                    
                  </Text>
                </ClearButton>
              )}
          </div>
        </Wrapper>
        {props.error && (
          <Text color={theme.colors.error} size={12}>
            {props.error}
          </Text>
        )}
      </InputContainer>
    );
  },
);

export const Input = Object.assign(InputBase, {});
