import { ActionIcon } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import classes from './styles.module.scss';

export function LanguageSwitcher() {
  // TODO: Implement actual language switching logic
  const toggleLanguage = () => {
    console.log('Language toggled');
  };

  return (
    <ActionIcon
      onClick={toggleLanguage}
      variant="default"
      size="lg"
      aria-label="Toggle language"
      className={classes.switcher}
    >
      <IconLanguage className={classes.icon} stroke={1.5} />
    </ActionIcon>
  );
} 