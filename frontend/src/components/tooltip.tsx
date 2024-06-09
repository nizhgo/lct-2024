import React, { useState, useRef, useEffect } from "react";
import { useFloating, offset, shift, flip, arrow } from "@floating-ui/react";
import styled from "@emotion/styled";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  action: "hover" | "click";
  isOpen?: boolean;
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  background-color: ${(p) => p.theme.colors.tooltip.background};
  color: ${(p) => p.theme.colors.tooltip.text};
  border: 1px solid ${(p) => p.theme.colors.tooltip.border};
  text-align: center;
  border-radius: 4px;
  padding: 4px;
  position: absolute;
  z-index: 1;
  white-space: nowrap;
  transition: opacity 0.2s ease-in-out;
  font-size: 14px;
  opacity: ${(p) => (p.isVisible ? 1 : 0)};
`;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  action,
  isOpen,
}) => {
  const [visible, setVisible] = useState(false);
  const arrowRef = useRef(null);

  const { x, y, refs, strategy } = useFloating({
    placement: "top",
    middleware: [offset(4), shift(), flip(), arrow({ element: arrowRef })],
  });

  const handleMouseEnter = () => {
    if (action === "hover") setVisible(true);
  };

  const handleMouseLeave = () => {
    if (action === "hover") setVisible(false);
  };

  const handleClick = () => {
    if (action === "click") setVisible((prev) => !prev);
  };

  useEffect(() => {
    if (typeof isOpen === "boolean") {
      setVisible(isOpen);
    }
  }, [isOpen]);

  return (
    <TooltipWrapper
      ref={refs.setReference}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      <TooltipContent
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? "",
          left: x ?? "",
        }}
        isVisible={visible}
      >
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
};
