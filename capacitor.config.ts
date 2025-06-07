import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zentry.app',
  appName: 'Zentry',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https',
    // Configure the server URL for production
    url: 'https://your-production-server.com',
    // For development, you can use local server
    // cleartext: true,
    // hostname: 'localhost:3000',
  },
  // Add any platform-specific configurations
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config; 