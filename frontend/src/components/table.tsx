import React from "react";
import styled from "@emotion/styled";

interface ResponsiveTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  columnSizes?: string[];
}

export const ResponsiveTable = <T extends {}>({
  headers,
  data,
  renderRow,
  columnSizes,
}: ResponsiveTableProps<T>) => {
  return (
    <GridWrapper columnSizes={columnSizes}>
      <GridHeader>
        {headers.map((header, index) => (
          <GridCellHeader key={index}>{header}</GridCellHeader>
        ))}
      </GridHeader>
      {data.map((item, index) => (
        <GridRow key={index}>{renderRow(item)}</GridRow>
      ))}
    </GridWrapper>
  );
};

const GridWrapper = styled.div<{ columnSizes?: string[] }>`
  display: grid;
  grid-template-columns: ${({ columnSizes }) =>
    columnSizes
      ? columnSizes.join(" ")
      : "repeat(auto-fill, minmax(150px, 1fr))"};
  width: 100%;
  border-top: 1px solid ${(p) => p.theme.colors.inputBorder};

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-top: none;
  }
`;

const GridHeader = styled.div`
  display: contents;

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const GridRow = styled.div`
  display: contents;
  border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    background: ${(p) => p.theme.colors.background};
    padding: 10px;
    border-radius: 5px;
    border: none;
  }
`;

const GridCellHeader = styled.div`
  padding: 20px 14px;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textSecondary};
  font-weight: bold;
  border-top: none;
`;

export const GridCell = styled.div<{header: string}>`
  padding: 20px 14px;
  font-size: 14px;
  text-align: left;
  border-top: 1px solid ${(p) => p.theme.colors.inputBorder};

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    padding: 5px 0;
    border: none;
    display: flex;
    flex-direction: column;

    &::before {
      content: ${(p) => p.header && `"${p.header}: "`};
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
      color: ${(p) => p.theme.colors.textSecondary};
    }
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 8px;
  border-radius: 4px;
  color: ${(p) =>
    p.status === "active"
      ? p.theme.colors.status.active
      : p.theme.colors.status.inactive};
  background-color: ${(p) =>
    p.status === "active"
      ? `${p.theme.colors.status.active}30`
      : `${p.theme.colors.status.inactive}30`};
  border: 1px solid
    ${(p) =>
      p.status === "active"
        ? p.theme.colors.status.active
        : p.theme.colors.status.inactive};
  font-weight: 700;
  text-align: center;
`;
