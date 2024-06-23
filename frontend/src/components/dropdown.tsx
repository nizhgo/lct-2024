import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import React, { useState, ReactNode, useEffect, useRef } from "react";
import { Stack } from "src/components/stack.ts";
import { useKeydown } from "src/utils/hooks/keydown.hook.ts";
import { Text } from "src/components/text.ts";
import { useOnClickOutside } from "src/utils/hooks/on-click-outside.hook.ts";
import { useTheme } from "@emotion/react";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";
import { Loader, LoaderWrapper } from "src/loader.tsx";

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`;
interface LabeledDropdownProps<T> {
  label?: string;
  onChange: (v: T) => void;
  value?: T | undefined;
  defaultValue?: T;
  required?: boolean;
  options: T[];
  disabledOptions?: T[];
  id?: string;
  error?: string | null;
  render?: (option: T) => ReactNode;
  searchField?: keyof T;
}

const DropdownOpenButton = styled.button<{ isOpen: boolean }>`
  transition: transform 0.2s;
  margin-left: auto;
  background: transparent;
  border: none;
  transform: ${(p) => (p.isOpen ? "rotate(180deg)" : "none")};
`;

export const SearchableDropdown = observer(
  <T extends NonNullable<unknown>>(x: LabeledDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curOption, setCurOption] = useState<T | undefined>(x.value);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    useKeydown("Enter", () => setIsOpen(false), undefined, [isOpen]);
    useOnClickOutside([ref], () => setIsOpen(false));

    useEffect(() => {
      setCurOption(x.value);
    }, [x.value]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const handleSelect = (option: T) => {
      setCurOption(option);
      setSearchTerm("");
      x.onChange(option as T);
      setIsOpen(false);
    };

    const getOptionString = (option: T): string => {
      if (x.searchField) {
        return String(option[x.searchField]);
      } else if (x.render) {
        return String(x.render(option));
      }
      return String(option);
    };

    const filteredOptions = x.options.filter((option) =>
      getOptionString(option).toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <CustomDropdownWrapper
        direction="column"
        gap={4}
        ref={ref}
        key={x.label}
        spellCheck={false}
      >
        {!x.label ? null : (
          <Label>
            {x.label}
            <Text color={"#B91827"}>{x.required ? "*" : ""}</Text>
          </Label>
        )}

        <DropdownButton
          type={"button"}
          hasError={!!x.error}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <Input
              ref={inputRef}
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          ) : curOption ? (
            x.render ? (
              x.render(curOption)
            ) : (
              (curOption as unknown as string)
            )
          ) : (
            "Не выбрано"
          )}
          <DropdownOpenButton isOpen={isOpen} type={"button"}>
            <Text fontFamily={"IcoMoon"} size={8} color={"#272727"}>
              
            </Text>
          </DropdownOpenButton>
        </DropdownButton>
        {isOpen && (
          <Stack
            direction="column"
            gap={4}
            style={{ display: "contents", height: "100px", overflow: "auto" }}
          >
            <OptionsList>
              {filteredOptions.map((option, index) => (
                <Option
                  key={String(x.render ? x.render(option) : option)}
                  onClick={() => handleSelect(option)}
                  aria-selected={option === curOption}
                  aria-disabled={x.disabledOptions?.includes(option)}
                  tabIndex={index}
                >
                  {x.render ? x.render(option) : (option as unknown as string)}
                </Option>
              ))}
            </OptionsList>
          </Stack>
        )}
        {x.error && (
          <Text color={theme.colors.error} size={12}>
            {x.error}
          </Text>
        )}
      </CustomDropdownWrapper>
    );
  },
);

const Input = styled.input<{ hasError?: boolean }>`
  position: relative;
  font-size: 14px;
  font-weight: 400;
  background: ${(p) => p.theme.colors.background};
  border: none;

  &:focus {
    outline: none;
  }

  &:hover {
    outline: none;
    border-color: transparent;
  }
`;

export const CustomDropdown = observer(
  <T extends NonNullable<unknown>>(x: LabeledDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curOption, setCurOption] = useState<T | undefined>(x.value);
    const ref = React.useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useKeydown("Enter", () => setIsOpen(false), undefined, [isOpen]);
    useOnClickOutside([ref], () => setIsOpen(false));

    useEffect(() => {
      setCurOption(x.value);
    }, [x.value]);

    const handleSelect = (option: T) => {
      setCurOption(option);
      x.onChange(option as T);
      setIsOpen(false);
    };

    return (
      <CustomDropdownWrapper
        direction="column"
        gap={4}
        ref={ref}
        key={x.label}
        spellCheck={false}
      >
        {!x.label ? null : (
          <Label>
            {x.label}
            <Text color={"#B91827"}>{x.required ? "*" : ""}</Text>
          </Label>
        )}
        <DropdownButton
          type={"button"}
          hasError={!!x.error}
          onClick={() => setIsOpen(!isOpen)}
        >
          {curOption
            ? x.render
              ? x.render(curOption)
              : (curOption as unknown as string)
            : "Не выбрано"}
          <DropdownOpenButton isOpen={isOpen} type={"button"}>
            <Text fontFamily={"IcoMoon"} size={8} color={"#272727"}>
              
            </Text>
          </DropdownOpenButton>
        </DropdownButton>
        {isOpen && (
          <Stack
            direction="column"
            gap={4}
            style={{ display: "contents", height: "100px", overflow: "auto" }}
          >
            <OptionsList>
              {x.options.map((option, index) => (
                <Option
                  key={String(x.render ? x.render(option) : option)}
                  onClick={() => handleSelect(option)}
                  aria-selected={option === curOption}
                  aria-disabled={x.disabledOptions?.includes(option)}
                  tabIndex={index}
                >
                  {x.render ? x.render(option) : (option as unknown as string)}
                </Option>
              ))}
            </OptionsList>
          </Stack>
        )}
        {x.error && (
          <Text color={theme.colors.error} size={12}>
            {x.error}
          </Text>
        )}
      </CustomDropdownWrapper>
    );
  },
);

const CustomDropdownWrapper = styled(Stack)`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button<{ hasError?: boolean }>`
  border: 1px solid
    ${(p) => (p.hasError ? p.theme.colors.error : p.theme.colors.inputBorder)};
  width: 100%;
  display: flex;
  align-items: center;
  font-family: "MoscowSans", sans-serif;
  justify-content: start;
  font-size: 14px;
  font-weight: 400;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  padding: 14px 18px;
  border-radius: 4px;

  &:focus {
    border-color: ${(p) => p.theme.colors.link};
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.link};
  }
`;

const OptionsList = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  top: 68px;
  max-height: 200px;
  overflow: auto;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
`;

const Option = styled.div<{
  ["aria-selected"]?: boolean;
  ["aria-disabled"]?: boolean;
}>`
  background: ${(p) => (p["aria-selected"] ? "#f0f0f0" : "#fff")};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
  padding: 10px 14px;

  &[aria-selected="true"] {
    background: #f0f0f0;
    font-weight: 700;
  }

  &[aria-disabled="true"] {
    background: #fafafa;
    color: #9b9b9b;
    cursor: not-allowed;
    user-select: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f0f0;
  }
`;

interface InfiniteDropdownProps<T> {
  label: string;
  onChange: (v: T) => void;
  value?: T | undefined;
  defaultValue?: T;
  required?: boolean;
  provider: InfinityScrollProvider<T>;
  disabledOptions?: T[];
  id?: string;
  error?: string | null;
  render?: (option: T) => React.ReactNode;
  searchField?: keyof T;
}

export const SearchableInfiniteDropdown = observer(
  <T extends NonNullable<unknown>>(x: InfiniteDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curOption, setCurOption] = useState<T | undefined>(x.value);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsListRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useOnClickOutside([ref], () => setIsOpen(false));
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (x.value) {
        handleSelect(x.value);
      }
    }, [x.value]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const handleSelect = (option: T) => {
      setCurOption(option);
      x.onChange(option as T);
      setIsOpen(false);
    };

    const handleScroll = () => {
      if (
        optionsListRef.current &&
        optionsListRef.current.scrollTop +
          optionsListRef.current.clientHeight >=
          optionsListRef.current.scrollHeight - 256
      ) {
        if (x.provider.hasMore && !x.provider.isLoading) {
          x.provider.loadMore();
        }
      }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        x.provider.search(newValue);
      }, 300);
    };

    return (
      <CustomDropdownWrapper
        direction="column"
        gap={4}
        ref={ref}
        key={x.label}
        spellCheck={false}
      >
        <Label>
          {x.label}
          <Text color={"#B91827"}>{x.required ? "*" : ""}</Text>
        </Label>
        <DropdownButton
          type="button"
          hasError={!!x.error}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <Input
              ref={inputRef}
              placeholder="Поиск..."
              value={searchTerm}
              onChange={handleSearch}
            />
          ) : curOption ? (
            x.render ? (
              x.render(curOption)
            ) : (
              (curOption as unknown as string)
            )
          ) : (
            "Не выбрано"
          )}
          <DropdownOpenButton isOpen={isOpen}>
            <Text fontFamily={"IcoMoon"} size={8} color={"#272727"}>
              
            </Text>
          </DropdownOpenButton>
        </DropdownButton>
        {isOpen && (
          <Stack
            direction="column"
            gap={4}
            style={{
              display: "contents",
              height: "200px",
              overflow: "auto",
              backgroundColor: "#fff",
            }}
          >
            <OptionsList ref={optionsListRef} onScroll={handleScroll}>
              {x.provider.data.map((option, index) => (
                <Option
                  key={Math.random()}
                  onClick={() => handleSelect(option)}
                  aria-selected={option === curOption}
                  aria-disabled={x.disabledOptions?.includes(option)}
                  tabIndex={index}
                >
                  {x.render ? x.render(option) : (option as unknown as string)}
                </Option>
              ))}
              {x.provider.isLoading && (
                <LoaderWrapper
                  style={{ backgroundColor: "#FFF" }} height={"156px"}
                >
                  <Loader />
                </LoaderWrapper>
              )}
            </OptionsList>
          </Stack>
        )}
        {x.error && (
          <Text color={theme.colors.error} size={12}>
            {x.error}
          </Text>
        )}
      </CustomDropdownWrapper>
    );
  },
);
