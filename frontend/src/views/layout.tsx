import styled from "@emotion/styled";
import { Link, Outlet } from "react-router-dom";
import { theme } from "src/assets/theme.ts";
import logo from "src/assets/logo.svg";
import { Svg } from "src/components/svg.tsx";

const Layout = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid ${theme.colors.inputBorder};
`;

const SidebarItem = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary};
  }

  & > svg {
    margin-right: 10px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 60px;
  background-color: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid ${theme.colors.inputBorder};
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${theme.colors.background};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > img {
    margin-right: 10px;
  }
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  text-decoration: none !important;
  &:hover {
    text-decoration: none;
  }
`;

export const AppLayout = () => {
  return (
    <Layout>
      <Sidebar>
        <Link to={"/"}>
          <Logo>
            <Svg src={logo} width={32} />
            <LogoText>Project M</LogoText>
          </Logo>
        </Link>
        <SidebarItem>
          <Svg src={"/"} width={24} />
          <Link to="/">Главная</Link>
        </SidebarItem>
        <SidebarItem>
          <Svg src={"/"} width={24} />
          <Link to="/passenger/1">Пассажиры</Link>
        </SidebarItem>
        <SidebarItem>
          <Svg src={"/"} width={24} />
          <Link to="/worker">Работники</Link>
        </SidebarItem>
        <SidebarItem>
          <Svg src={"/"} width={24} />
          <Link to="/request/1">Заявки</Link>
        </SidebarItem>
        <SidebarItem>
          <Svg src={"/"} width={24} />
          <Link to="/notValidRoute">404</Link>
        </SidebarItem>
      </Sidebar>
      <Content>
        <Header>
          <div>Header Left</div>
          <div>Профиль</div>
        </Header>
        <MainContent>
          <Outlet />
        </MainContent>
      </Content>
    </Layout>
  );
};
