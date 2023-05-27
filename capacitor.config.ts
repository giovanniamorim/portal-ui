import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.app.sindifisco',
  appName: 'portal-mobile-app',
  webDir: 'dist/portal-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
