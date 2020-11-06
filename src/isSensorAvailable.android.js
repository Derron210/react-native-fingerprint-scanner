import { NativeModules } from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScannerWithKey } = NativeModules;

export default () => {
  return new Promise((resolve, reject) => {
    ReactNativeFingerprintScannerWithKey.isSensorAvailable()
      .then((biometryType) => resolve(biometryType))
      .catch(error => reject(createError(error.code, error.message)));
  });
}
