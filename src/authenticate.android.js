import {
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScannerWithKey } = NativeModules;

const authCurrent = (title, subTitle, description, cancelButton, useKey, keyName, resolve, reject) => {
  ReactNativeFingerprintScannerWithKey.authenticate(title, subTitle, description, cancelButton, useKey, keyName)
    .then(() => {
      resolve(true);
    })
    .catch((error) => {
      // translate errors
      reject(createError(error.code, error.message));
    });
}

const authLegacy = (onAttempt, resolve, reject) => {
  DeviceEventEmitter.addListener('FINGERPRINT_SCANNER_AUTHENTICATION', (name) => {
    if (name === 'AuthenticationNotMatch' && typeof onAttempt === 'function') {
      onAttempt(createError(name));
    }
  });

  ReactNativeFingerprintScannerWithKey.authenticate()
    .then(() => {
      DeviceEventEmitter.removeAllListeners('FINGERPRINT_SCANNER_AUTHENTICATION');
      resolve(true);
    })
    .catch((error) => {
      DeviceEventEmitter.removeAllListeners('FINGERPRINT_SCANNER_AUTHENTICATION');
      reject(createError(error.code, error.message));
    });
}

const nullOnAttempt = () => null;

export default ({ title, subTitle, description, cancelButton, useKey, keyName, onAttempt }) => {
  return new Promise((resolve, reject) => {
    if (!title) {
      title = description ? description : "Log In";
      description = ""
    }
    if (!subTitle) {
      subTitle = "";
    }
    if (!description) {
      description = "";
    }
    if (!cancelButton) {
      cancelButton = "Cancel";
    }
    if (!onAttempt) {
      onAttempt = nullOnAttempt;
    }

    if (!keyName) useKey = false;

    if (Platform.Version < 23) {
      return authLegacy(onAttempt, resolve, reject);
    }

    return authCurrent(title, subTitle, description, cancelButton, useKey, keyName, resolve, reject);
  });
}
