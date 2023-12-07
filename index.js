/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import First from './src/pages/firstGame/First';
import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => First);
AppRegistry.registerComponent(appName, () => First, {
  bundleURL: 'http://localhost:8081/index.bundle?platform=ios&dev=true',
});
