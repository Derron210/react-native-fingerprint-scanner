import { NativeModules } from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScannerWithKey } = NativeModules;

export default () => {
  return new Promise((resolve, reject) => {
    ReactNativeFingerprintScannerWithKey.isSensorAvailable((error, biometryType) => {
      if (error) return reject(createError(error.code, error.message));
      resolve(biometryType);
    });
  });
}
