import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Anchor, Box, Stack, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAt, IconLock, IconBrain, IconArrowRight, IconUser } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Register.module.scss';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      notifications.show({
        title: 'Error',
        message: 'Passwords do not match',
        color: 'red',
      });
      return;
    }

    if (password.length < 8) {
      notifications.show({
        title: 'Error',
        message: 'Password must be at least 8 characters long',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! Please log in.',
        color: 'green',
      });
      navigate('/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create account. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape} />
        <div className={styles.shape} />
        <div className={styles.shape} />
      </div>
      
      <Container size={480} className={styles.container}>
        <Box ta="center" mb={30}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <IconBrain size={40} stroke={1.5} />
            </div>
            <div className={styles.logoGlow} />
          </div>
          <Title className={styles.title}>
            Create your account
          </Title>
          <Text c="dimmed" size="sm" mt={5} className={styles.subtitle}>
            Already have an account?{' '}
            <Anchor size="sm" component="button" onClick={() => navigate('/login')} className={styles.link}>
              Sign in
            </Anchor>
          </Text>
        </Box>

        <Paper component="form" onSubmit={handleSubmit} withBorder shadow="md" p={35} radius="lg" className={styles.form}>
          <Stack gap="md">
            <div className={styles.formHeader}>
              <Text size="sm" fw={500} className={styles.sectionTitle}>
                Sign up with your email
              </Text>
              <Text size="xs" c="dimmed" className={styles.sectionSubtitle}>
                Fill in the information below to create your account
              </Text>
            </div>

            <div className={styles.inputs}>
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftSection={<IconUser size={16} />}
                classNames={{
                  input: styles.input,
                  label: styles.inputLabel,
                  wrapper: styles.inputWrapper,
                }}
              />

              <TextInput
                label="Email address"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftSection={<IconAt size={16} />}
                classNames={{
                  input: styles.input,
                  label: styles.inputLabel,
                  wrapper: styles.inputWrapper,
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftSection={<IconLock size={16} />}
                classNames={{
                  input: styles.input,
                  label: styles.inputLabel,
                  wrapper: styles.inputWrapper,
                }}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftSection={<IconLock size={16} />}
                classNames={{
                  input: styles.input,
                  label: styles.inputLabel,
                  wrapper: styles.inputWrapper,
                }}
              />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              className={styles.submitButton}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              size="md"
              rightSection={!loading && <IconArrowRight size={18} />}
            >
              Create account
            </Button>

            <Text size="xs" c="dimmed" ta="center" mt="sm" className={styles.terms}>
              By creating an account, you agree to our{' '}
              <Anchor size="xs" href="#" target="_blank" className={styles.link}>Terms of Service</Anchor>
              {' '}and{' '}
              <Anchor size="xs" href="#" target="_blank" className={styles.link}>Privacy Policy</Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
} 