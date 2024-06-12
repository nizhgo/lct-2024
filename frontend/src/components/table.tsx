import React from "react";
import styled from "@emotion/styled";

export interface ColumnConfig {
  header: string;
  centred?: boolean;
  size?: string;
}

interface ResponsiveTableProps<T> {
  columns: ColumnConfig[];
  data: T[];
  renderRow: (item: T, columns: ColumnConfig[]) => React.ReactNode;
}

export const ResponsiveTable = <T extends NonNullable<unknown>>({
  columns,
  data,
  renderRow,
}: ResponsiveTableProps<T>) => {
  const columnSizes = columns.map((col) => col.size || "1fr").join(" ");

  return (
    <GridWrapper columnSizes={columnSizes}>
      <GridHeader>
        {columns.map((col, index) => (
          <GridCellHeader key={index} centred={col.centred}>
            {col.header}
          </GridCellHeader>
        ))}
      </GridHeader>
      {data.map((item, index) => (
        <GridRow key={index}>{renderRow(item, columns)}</GridRow>
      ))}
    </GridWrapper>
  );
};

const GridWrapper = styled.div<{ columnSizes: string }>`
  display: grid;
  grid-template-columns: ${({ columnSizes }) => columnSizes};
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

const GridCellHeader = styled.div<{ centred?: boolean }>`
  padding: 20px 14px;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textSecondary};
  font-weight: bold;
  border-top: none;
  text-align: ${({ centred }) => (centred ? "center" : "left")};
`;

export const GridCell = styled.div<{ centred?: boolean; header?: string }>`
  padding: 20px 14px;
  font-size: 14px;
  text-align: ${({ centred }) => (centred ? "center" : "left")};
  border-top: 1px solid ${(p) => p.theme.colors.inputBorder};
  display: flex;
  align-items: center;
  justify-content: ${({ centred }) => (centred ? "center" : "flex-start")};

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    padding: 5px 0;
    border: none;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    &::before {
      content: ${({ header }) => `"${header}: "`};
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
      color: ${(p) => p.theme.colors.textSecondary};
    }
  }
`;
