import styled from "@emotion/styled";

export const PageHeader = styled.h1`
  font-size: 32px;
  font-weight: 700;
  padding: 0;
  margin: 0;

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;
