import styled from "@emotion/styled";
import { Link, LinkProps } from "react-router-dom";

export interface ILink extends LinkProps {
  disabled: boolean;
  children: React.ReactNode;
}

const DisabledLinkStyle = styled.span`
  color: ${(p) => p.theme.colors.text};
`;

export const InternalLink: React.FC<ILink> = ({ disabled, to, ...rest }) => {
  if (disabled) {
    return <DisabledLinkStyle {...rest}>{rest.children}</DisabledLinkStyle>;
  }

  return (
    <Link {...rest} to={to as string}>
      {rest.children}
    </Link>
  );
};
