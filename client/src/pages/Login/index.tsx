import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Anchor, Box, Stack, Group, Checkbox, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAt, IconLock, IconBrain, IconArrowRight, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.scss';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Invalid email or password',
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
            Welcome back to Zentry!
          </Title>
          <Text c="dimmed" size="sm" mt={5} className={styles.subtitle}>
            Don't have an account yet?{' '}
            <Anchor size="sm" component="button" onClick={() => navigate('/register')} className={styles.link}>
              Create account
            </Anchor>
          </Text>
        </Box>

        <Paper component="form" onSubmit={handleSubmit} withBorder shadow="md" p={35} radius="lg" className={styles.form}>
          <Stack gap="md">
            <div className={styles.formHeader}>
              <Text size="sm" fw={500} className={styles.sectionTitle}>
                Sign in with your email
              </Text>
              <Text size="xs" c="dimmed" className={styles.sectionSubtitle}>
                Enter your credentials to access your account
              </Text>
            </div>

            <div className={styles.socialButtons}>
              <Button 
                variant="default" 
                className={styles.providerButton}
                leftSection={<IconBrandGoogle size={20} stroke={1.5} />}
                onClick={() => notifications.show({
                  title: 'Coming Soon',
                  message: 'Social login will be available soon!',
                  color: 'blue',
                })}
              >
                Continue with Google
              </Button>
              <Button 
                variant="default"
                className={styles.providerButton}
                leftSection={<IconBrandGithub size={20} stroke={1.5} />}
                onClick={() => notifications.show({
                  title: 'Coming Soon',
                  message: 'Social login will be available soon!',
                  color: 'blue',
                })}
              >
                Continue with GitHub
              </Button>
            </div>

            <Divider label="Or continue with email" labelPosition="center" className={styles.divider} />

            <div className={styles.inputs}>
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
                placeholder="Your password"
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
            </div>

            <Group justify="space-between" mt="sm" className={styles.options}>
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                classNames={{
                  label: styles.checkboxLabel,
                  input: styles.checkbox,
                }}
              />
              <Anchor component="button" size="sm" onClick={() => navigate('/forgot-password')} className={styles.link}>
                Forgot password?
              </Anchor>
            </Group>

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
              Sign in to your account
            </Button>

            <Text size="xs" c="dimmed" ta="center" mt="sm" className={styles.terms}>
              By continuing, you agree to our{' '}
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