import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, Outlet, useLocation } from "react-router-dom";
import { theme } from "src/assets/theme.ts";
import logo from "src/assets/logo.svg";
import { Svg } from "src/components/svg.tsx";
import UsersIcon from "src/assets/icons/users.svg";
import { Stack } from "components/stack.ts";
import { Text } from "components/text.ts";

const useResponsiveSidebar = (setSidebarOpen: (isOpen: boolean) => void) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarOpen]);
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 250px;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid ${theme.colors.inputBorder};
  position: absolute;
  height: 100%;
  top: 0;
  left: ${(p) => (p.isOpen ? "0" : "-250px")};
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    left: ${(p) => (p.isOpen ? "0" : "-100%")};
    z-index: 1000;
    padding: 10px;
  }
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  color: ${(p) => (p.active ? theme.colors.link : theme.colors.text)};
  margin-bottom: 15px;

  &:hover {
    color: ${theme.colors.link};
  }

  & > svg {
    margin-right: 10px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  justify-content: center;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};

  @media (max-width: 768px) {
    justify-content: flex-start;
    background-color: ${(p) => p.theme.colors.background};
  }
`;

const BurgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  margin-right: 20px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

const CloseButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  font-size: 24px;
  margin-left: auto;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  useResponsiveSidebar(setSidebarOpen);

  const onLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  //scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout>
      <Sidebar isOpen={isSidebarOpen}>
        <Link to={"/"} onClick={onLinkClick} style={{ marginBottom: 20 }}>
          <Stack justify={"space-between"} wFull gap={20}>
            <Logo>
              <Svg src={logo} width={32} />
              <LogoText>Project M</LogoText>
            </Logo>
            <CloseButton onClick={toggleSidebar}>✕</CloseButton>
          </Stack>
        </Link>
        <Stack gap={14} direction={"column"} wFull>
          <Link to="/">
            <SidebarItem
              active={location.pathname === "/"}
              onClick={onLinkClick}
            >
              <Svg src={UsersIcon} width={24} />
              <Text>Главная</Text>
            </SidebarItem>
          </Link>
          <Link to="/passenger">
            <SidebarItem
              active={location.pathname.startsWith("/passenger")}
              onClick={onLinkClick}
            >
              <Svg src={UsersIcon} width={24} />
              <Text>Пассажиры</Text>
            </SidebarItem>
          </Link>
          <Link to="/worker">
            <SidebarItem
              active={location.pathname.startsWith("/worker")}
              onClick={onLinkClick}
            >
              <Svg src={UsersIcon} width={24} />
              <Text>Сотрудники</Text>
            </SidebarItem>
          </Link>
          <Link to="/request">
            <SidebarItem
              active={location.pathname.startsWith("/request")}
              onClick={onLinkClick}
            >
              <Svg src={UsersIcon} width={24} />
              <Text>Заявки</Text>
            </SidebarItem>
          </Link>
          <Link to="/notValidRoute">
            <SidebarItem
              active={location.pathname.startsWith("/notValidRoute")}
              onClick={onLinkClick}
            >
              <Svg src={UsersIcon} width={24} />
              <Text>Not valid route</Text>
            </SidebarItem>
          </Link>
        </Stack>
        <Stack gap={14} direction={"column"} style={{ marginTop: "56px" }}>
          <Link to="/login">
            <SidebarItem onClick={onLinkClick}>
              <Text>Выйти</Text>
            </SidebarItem>
          </Link>
        </Stack>
      </Sidebar>
      <Content>
        <Header>
          <BurgerMenu onClick={toggleSidebar}>
            <Text fontFamily={"IcoMoon"}></Text>
          </BurgerMenu>
          <Text fontFamily={"IcoMoon"}></Text>
          <Link to={"/profile"}>
            <Text>Профиль</Text>
          </Link>
        </Header>
        <MainContent>
          <Outlet />
        </MainContent>
      </Content>
    </Layout>
  );
};
