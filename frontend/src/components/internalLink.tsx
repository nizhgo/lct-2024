import styled from "@emotion/styled";
import { Link, LinkProps } from "react-router-dom";

export interface ILink extends LinkProps {
  disabled: boolean;
  children: React.ReactNode;
}

const DisabledLinkStyle = styled.span`
  color: ${(p) => p.theme.colors.text};
`;

const StyledLink = styled(Link)`
  color: ${(p) => p.theme.colors.link};
  text-decoration: none;

  &:hover {
    color: ${(p) => p.theme.colors.linkHover};
  }
`;

export const InternalLink: React.FC<ILink> = ({ disabled, to, ...rest }) => {
  if (disabled) {
    return <DisabledLinkStyle {...rest}>{rest.children}</DisabledLinkStyle>;
  }

  return (
    <StyledLink {...rest} to={to as string}>
      {rest.children}
    </StyledLink>
  );
};
