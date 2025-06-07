import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './styles.module.scss';

export function ThemeSwitcher() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      className={classes.switcher}
    >
      <IconSun className={classes.icon} stroke={1.5} />
      <IconMoon className={classes.icon} stroke={1.5} />
    </ActionIcon>
  );
} 