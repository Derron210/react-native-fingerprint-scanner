import {NativeModules} from 'react-native';

const { ReactNativeFingerprintScannerWithKey } = NativeModules;

export default (keyName) => ReactNativeFingerprintScannerWithKey.clearKey(keyName);
