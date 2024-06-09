import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, Outlet, useLocation } from "react-router-dom";
import { theme } from "src/assets/theme.ts";
import logo from "src/assets/logo.svg";
import { Svg } from "src/components/svg.tsx";
import UsersIcon from "src/assets/icons/users.svg";
import { Stack } from "components/stack.ts";

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
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 250px;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid ${theme.colors.inputBorder};
  position: fixed;
  height: 100%;
  top: 0;
  left: ${(p) => (p.isOpen ? "0" : "-250px")};
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    width: ${(p) => (p.isOpen ? "100%" : "auto")};
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
  border-bottom: 1px solid ${theme.colors.inputBorder};

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const BurgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  margin-right: 20px;

  & > div {
    width: 25px;
    height: 3px;
    background-color: ${theme.colors.text};
    margin: 4px 0;
    transition: transform 0.3s ease;
  }

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
  height: calc(100vh - 60px);
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  useResponsiveSidebar(setSidebarOpen);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const onLinkClick = () => {
    //if mobile close sidebar
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <Layout>
      <Sidebar isOpen={isSidebarOpen}>
        <Link to={"/"}>
          <Logo>
            <Svg src={logo} width={32} />
            <LogoText>Project M</LogoText>
          </Logo>
        </Link>
        <Stack gap={14} direction={"column"} wFull>
          <SidebarItem
            active={location.pathname === "/"}
            onClick={toggleSidebar}
          >
            <Svg src={UsersIcon} width={24} />
            <Link to={"/"}>Главная</Link>
          </SidebarItem>
          <SidebarItem
            active={location.pathname.startsWith("/passenger")}
            onClick={onLinkClick}
          >
            <Svg src={UsersIcon} width={24} />
            <Link to="/passenger/1">Пассажиры</Link>
          </SidebarItem>
          <SidebarItem
            active={location.pathname.startsWith("/worker")}
            onClick={onLinkClick}
          >
            <Svg src={UsersIcon} width={24} />
            <Link to="/worker">Сотрудники</Link>
          </SidebarItem>
          <SidebarItem
            active={location.pathname.startsWith("/request")}
            onClick={onLinkClick}
          >
            <Svg src={UsersIcon} width={24} />
            <Link to="/request/1">Заявки</Link>
          </SidebarItem>
          <SidebarItem
            active={location.pathname.startsWith("/notValidRoute")}
            onClick={onLinkClick}
          >
            <Svg src={UsersIcon} width={24} />
            <Link to="/notValidRoute">404</Link>
          </SidebarItem>
        </Stack>
      </Sidebar>
      <Content>
        <Header>
          <BurgerMenu onClick={toggleSidebar}>
            <div></div>
            <div></div>
            <div></div>
          </BurgerMenu>
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
