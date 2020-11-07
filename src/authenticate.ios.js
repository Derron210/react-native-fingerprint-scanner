import { NativeModules } from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScannerWithKey } = NativeModules;

export default ({ description = ' ', fallbackEnabled = true, useKey = false, keyName = '' }) => {
  return new Promise((resolve, reject) => {
    ReactNativeFingerprintScannerWithKey.authenticate(description, fallbackEnabled, useKey, keyName, error => {
      if (error) {
        return reject(createError(error.code, error.message))
      }

      return resolve(true);
    });
  });
}
