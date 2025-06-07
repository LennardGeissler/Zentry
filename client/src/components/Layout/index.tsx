import { type ReactNode } from 'react';
import { AppShell, Text, UnstyledButton, Group, useMantineTheme, Stack, Box, rem, useMantineColorScheme, Burger, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconLayoutDashboard, IconChecklist, IconHeartRateMonitor, IconChartBar, IconCalendarEvent, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { LanguageSwitcher } from '../LanguageSwitcher';
import classes from './styles.module.scss';

interface LayoutProps {
  children: ReactNode;
}

interface NavLinkProps {
  to: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

function NavLink({ to, label, icon, onClick }: NavLinkProps) {
  const location = useLocation();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isActive = location.pathname === (to === '/' ? '/' : `/${to.split('/')[1]}`);

  const isDark = colorScheme === 'dark';

  const commonStyles = {
    padding: '12px 16px',
    borderRadius: theme.radius.md,
    width: '100%',
    backgroundColor: isActive 
      ? isDark 
        ? `rgba(${theme.colors.blue[9]}, 0.35)`
        : `rgba(${theme.colors.blue[1]}, 0.65)`
      : 'transparent',
    color: isActive 
      ? isDark ? theme.white : theme.colors[theme.primaryColor][7]
      : isDark ? theme.colors.gray[3] : theme.colors.gray[7],
    transition: 'all 200ms ease',
    '&:hover': {
      backgroundColor: isActive 
        ? isDark 
          ? `rgba(${theme.colors.blue[9]}, 0.45)`
          : `rgba(${theme.colors.blue[1]}, 0.85)`
        : isDark 
          ? `rgba(${theme.colors.dark[5]}, 0.35)`
          : theme.colors.gray[0],
      transform: 'translateX(4px)',
    },
  };

  const iconStyle = {
    color: isActive 
      ? isDark ? theme.white : theme.colors[theme.primaryColor][7]
      : isDark ? theme.colors.gray[3] : theme.colors.gray[7],
    transition: 'color 200ms ease',
  };

  const textStyle = {
    fontWeight: isActive ? 600 : 400,
    transition: 'font-weight 200ms ease',
  };

  if (onClick) {
    return (
      <UnstyledButton
        onClick={onClick}
        className={`${classes.navLink} ${isActive ? classes.active : classes.inactive}`}
      >
        <Group>
          <Box className={classes.icon}>{icon}</Box>
          <Text className={`${classes.text} ${isActive ? classes.activeText : classes.inactiveText}`}>
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton
      component={Link}
      to={to}
      className={`${classes.navLink} ${isActive ? classes.active : classes.inactive}`}
    >
      <Group>
        <Box className={classes.icon}>{icon}</Box>
        <Text className={`${classes.text} ${isActive ? classes.activeText : classes.inactiveText}`}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationContent = (
    <Stack justify="space-between" h="100%" gap="sm">
      <Stack gap="xs">
        <NavLink 
          to="/" 
          label="Dashboard" 
          icon={<IconLayoutDashboard size={20} stroke={1.5} />}
          onClick={isMobile ? close : undefined}
        />
        <NavLink 
          to="/tasks" 
          label="Tasks" 
          icon={<IconChecklist size={20} stroke={1.5} />}
          onClick={isMobile ? close : undefined}
        />
        <NavLink 
          to="/habits" 
          label="Habits" 
          icon={<IconHeartRateMonitor size={20} stroke={1.5} />}
          onClick={isMobile ? close : undefined}
        />
        <NavLink 
          to="/statistics" 
          label="Statistics" 
          icon={<IconChartBar size={20} stroke={1.5} />}
          onClick={isMobile ? close : undefined}
        />
        <NavLink 
          to="/calendar" 
          label="Calendar" 
          icon={<IconCalendarEvent size={20} stroke={1.5} />}
          onClick={isMobile ? close : undefined}
        />
      </Stack>

      <Box>
        <NavLink 
          to="/logout"
          label="Logout"
          icon={<IconLogout size={20} stroke={1.5} />}
          onClick={() => {
            if (isMobile) close();
            handleLogout();
          }}
        />
      </Box>
    </Stack>
  );

  return (
    <AppShell
      header={{ height: rem(60) }}
      navbar={{
        width: rem(240),
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
      styles={{
        main: {
          background: isDark 
            ? theme.colors.dark[8] 
            : theme.colors.gray[0],
        },
        header: {
          background: isDark
            ? theme.colors.dark[7]
            : theme.white,
          borderBottom: `${rem(1)} solid ${
            isDark
              ? theme.colors.dark[5]
              : theme.colors.gray[2]
          }`,
        },
        navbar: {
          background: isDark
            ? theme.colors.dark[7]
            : theme.white,
          borderRight: `${rem(1)} solid ${
            isDark
              ? theme.colors.dark[5]
              : theme.colors.gray[2]
          }`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group gap="sm">
            {isMobile && (
              <Burger opened={opened} onClick={toggle} size="sm" />
            )}
            <Text 
              size="xl" 
              fw={700} 
              c={isDark ? 'gray.3' : 'gray.7'}
            >
              Zentry
            </Text>
          </Group>
          <Group gap="xs">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navigationContent}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 