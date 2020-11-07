# React Native Fingerprint Scanner With Key

React Native Fingerprint Scanner With Key is a [React Native](http://facebook.github.io/react-native/) library for authenticating users with Fingerprint (TouchID).

This library was forked from [react-native-fingerprint-scanner](https://github.com/hieuvp/react-native-fingerprint-scanner). 
The only difference is that this library can reject authenication's method promise if system's biometric settings was changed. It might be useful if it is required to check if new
fingerprints was added.


## Table of Contents

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Example](#example)
- [API](#api)
- [License](#license)

### iOS Version
The usage of the TouchID is based on a framework, named **Local Authentication**.

It provides a **Default View** that prompts the user to place a finger to the iPhone’s button for scanning.

<div>
<img src="https://github.com/hieuvp/react-native-fingerprint-scanner/raw/master/screenshots/ios-availability.png" height="600">
<img src="https://github.com/hieuvp/react-native-fingerprint-scanner/raw/master/screenshots/ios-authentication.gif" height="600">
</div>

### Android Version
4.0.0 Prefers the new native Android BiometricPrompt lib on any Android >= v23 (M)
4.0.0 also DEPRECATES support for the legacy library that provides support for Samsung & MeiZu phones

<div>
<img src="https://github.com/hieuvp/react-native-fingerprint-scanner/raw/master/screenshots/android-availability.png" height="600">
<img src="https://github.com/hieuvp/react-native-fingerprint-scanner/raw/master/screenshots/android-authentication.gif" height="600">
</div>

## Installation

```sh
$ npm install react-native-fingerprint-scanner-wtih-key --save
```
or
```sh
$ yarn add react-native-fingerprint-scanner-with-key
```

### Automatic Configuration
For RN >= 0.60
```sh
$ cd ios && pod install
```

For RN < 0.60, use react-native link to add the library to your project:
```sh
$ react-native link react-native-fingerprint-scanner-with-key
```

### Manual Configuration

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-fingerprint-scanner-with-key` and add `ReactNativeFingerprintScanner.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libReactNativeFingerprintScanner.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;` to the imports at the top of the file
  - Add `new ReactNativeFingerprintScannerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-fingerprint-scanner-with-key'
  	project(':react-native-fingerprint-scanner-with-key').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fingerprint-scanner-with-key/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
    implementation project(':react-native-fingerprint-scanner-with-key')
  	```

### App Permissions

Add the following permissions to their respective files:

#### Android
In your `AndroidManifest.xml`:

API level 28+ (Uses Android native BiometricPrompt) ([Reference](https://developer.android.com/reference/android/Manifest.permission#USE_BIOMETRIC))
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
```

API level 23-28 (Uses Android native FingerprintCompat) [Reference](https://developer.android.com/reference/android/Manifest.permission#USE_FINGERPRINT)) 
```xml
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

// DEPRECATED in 4.0.0
API level <23 (Uses device-specific native fingerprinting, if available - Samsung & MeiZu only) [Reference](https://developer.android.com/reference/android/Manifest.permission#USE_FINGERPRINT)) 
```xml
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```
#### iOS
In your `Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>$(PRODUCT_NAME) requires FaceID access to allows you quick and secure access.</string>
```

### Extra Configuration

1. Make sure the following versions are all correct in `android/app/build.gradle`
    ```
    // API v29 enables FaceId
    android {
        compileSdkVersion 29
        buildToolsVersion "29.0.2"
    ...
        defaultConfig {
          targetSdkVersion 29
    ```

2. Add necessary rules to `android/app/proguard-rules.pro` if you are using proguard:
    ```
    # MeiZu Fingerprint

    // DEPRECATED in 4.0.0
    -keep class com.fingerprints.service.** { *; }
    -dontwarn com.fingerprints.service.**

    # Samsung Fingerprint

    // DEPRECATED in 4.0.0
    -keep class com.samsung.android.sdk.** { *; }
    -dontwarn com.samsung.android.sdk.**
    ```

## Compatibility

* For Gradle < 3 you MUST install react-native-fingerprint-scanner-with-key at version <= 2.5.0
* For RN >= 0.57 and/or Gradle >= 3 you MUST install react-native-fingerprint-scanner-with-key at version >= 2.6.0
* For RN >= 0.60 you MUST install react-native-fingerprint-scanner-with-key at version >= 3.0.0
* For Android native Face Unlock, MUST use >= 4.0.0

## Example

[Example Source Code](https://github.com/hieuvp/react-native-fingerprint-scanner-with-key/tree/master/examples)

**iOS Implementation**
```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertIOS } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';

class FingerprintPopup extends Component {

  componentDidMount() {
    FingerprintScanner
      .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
      .then(() => {
        this.props.handlePopupDismissed();
        AlertIOS.alert('Authenticated successfully');
      })
      .catch((error) => {
        this.props.handlePopupDismissed();
        AlertIOS.alert(error.message);
      });
  }

  render() {
    return false;
  }
}

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;
```

**Android Implementation**
```javascript

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';
import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';


// - this example component supports both the
//   legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined
    };

    this.description = null;
  }

  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  }

  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  authCurrent() {
    FingerprintScanner
      .authenticate({ title: 'Log in with Biometrics' })
      .then(() => {
        this.props.onAuthenticate();
      });
  }

  authLegacy() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
      })
      .catch((error) => {
        this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
        this.description.shake();
      });
  }

  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
  };

  renderLegacy() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissedLegacy } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>

          <Image
            style={styles.logo}
            source={require('./assets/finger_print.png')}
          />

          <Text style={styles.heading}>
            Biometric{'\n'}Authentication
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessageLegacy)}>
            {errorMessageLegacy || `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}
          >
            <Text style={styles.buttonText}>
              BACK TO MAIN
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }


  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }

    // current API UI provided by native BiometricPrompt
    return null;
  }
}

BiometricPopup.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};

export default BiometricPopup;
```

## API

### `isSensorAvailable()`: (Android, iOS)
Checks if Fingerprint Scanner is able to be used by now.

- Returns a `Promise<string>`
- `biometryType: String` - The type of biometric authentication supported by the device.
  - iOS: biometryType = 'Touch ID', 'Face ID'
  - Android: biometryType = 'Biometrics'
- `error: FingerprintScannerError { name, message, biometric }` - The name and message of failure and the biometric type in use.

```javascript
componentDidMount() {
  FingerprintScanner
    .isSensorAvailable()
    .then(biometryType => this.setState({ biometryType }))
    .catch(error => this.setState({ errorMessage: error.message }));
}
```

### `authenticate({ description, fallbackEnabled, useKey, keyName })`: (iOS)
Starts Fingerprint authentication on iOS.

- Returns a `Promise`
- `description: String` - the string to explain the request for user authentication.
- `fallbackEnabled: Boolean` - default to `true`, whether to display fallback button (e.g. Enter Password).
- `useKey: Boolean`  - default to `false`, whether to check if biometric settings was changed
- `keyName: String` - the string parameter which must contain UID for your app. Ignored, if `useKey` set to false. This is a SecretKey name for Android or UsersDefault key for containing evaluatedPolicyDomainState for iOS.

```javascript
componentDidMount() {
  FingerprintScanner
    .authenticate({ description: 'Scan your fingerprint on the device scanner to continue', useKey: true, keyName: 'MY_APP_UNIQUE_STRING' })
    .then(() => {
      this.props.handlePopupDismissed();
      AlertIOS.alert('Authenticated successfully');
    })
    .catch((error) => {
      this.props.handlePopupDismissed();
      if (error.keyWasInvalidated) {
        AlertIOS.alert('Biometric settings was changed');
      } else {
        AlertIOS.alert(error.message);
      }
    });
}
```

### `authenticate({ title="Log In", subTitle, description, cancelButton="Cancel", onAttempt=() => (null) })`: (Android)
Starts Fingerprint authentication on Android.

- Returns a `Promise`
- `title: String` the title text to display in the native Android popup
- `subTitle: String` the sub title text to display in the native Android popup
- `description: String` the description text to display in the native Android popup
- `cancelButton: String` the cancel button text to display in the native Android popup
- `onAttempt: Function` - a callback function when users are trying to scan their fingerprint but failed.
- `useKey: Boolean`  - default to `false`, whether to check if biometric settings was changed
- `keyName: String` - the string parameter which must contain UID for your app. Ignored, if `useKey` set to false. This is a SecretKey name for Android or UsersDefault key for containing evaluatedPolicyDomainState for iOS.

```javascript
componentDidMount() {
  if (requiresLegacyAuthentication()) {
    authLegacy();
  } else {
    authCurrent();
  }
}

componentWillUnmount = () => {
  FingerprintScanner.release();
}

requiresLegacyAuthentication() {
  return Platform.Version < 23;
}

authCurrent() {
  FingerprintScanner
    .authenticate({ title: 'Log in with Biometrics', useKey: true, keyName: 'MY_APP_KEY_NAME', })
    .then(() => {
      this.props.onAuthenticate();
    });
}

authLegacy() {
  FingerprintScanner
    .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
    .then(() => {
      this.props.handlePopupDismissedLegacy();
      Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
    })
    .catch((error) => {
      this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
      this.description.shake();
    });
}

handleAuthenticationAttemptedLegacy = (error) => {
  this.setState({ errorMessageLegacy: error.message });
  this.description.shake();
};
```

### `release()`: (Android)
Stops fingerprint scanner listener, releases cache of internal state in native code, and cancels native prompt if visible.

- Returns a `Void`

```javascript
componentWillUnmount() {
  FingerprintScanner.release();
}
```

### `clearKey(keyName)`
This method must be called to clear KeyInvalidated error, which is produced by authenicate() method after biometric settings was changed.
This method creates new `SecretKey` with given keyname for android, or stores `evaluatedPolicyDomainState` in `UsersDefaults` for given name for iOS.


### `Types of Biometrics`

| Value | OS | Description|
|---|---|---|
| Touch ID | iOS | |
| Face ID | iOS | |
| Biometrics | Android | Refers to the biometric set as preferred on the device |

### `Errors`

| Name | Message |
|---|---|
| AuthenticationNotMatch | No match |
| AuthenticationFailed | Authentication was not successful because the user failed to provide valid credentials |
| AuthenticationTimeout | Authentication was not successful because the operation timed out |
| AuthenticationProcessFailed | 'Sensor was unable to process the image. Please try again |
| UserCancel | Authentication was canceled by the user - e.g. the user tapped Cancel in the dialog |
| UserFallback | Authentication was canceled because the user tapped the fallback button (Enter Password) |
| SystemCancel | Authentication was canceled by system - e.g. if another application came to foreground while the authentication dialog was up |
| PasscodeNotSet | Authentication could not start because the passcode is not set on the device |
| DeviceLocked | Authentication was not successful, the device currently in a lockout of 30 seconds |
| DeviceLockedPermanent | Authentication was not successful, device must be unlocked via password |
| DeviceOutOfMemory | Authentication could not proceed because there is not enough free memory on the device |
| HardwareError | A hardware error occurred |
| FingerprintScannerUnknownError | Could not authenticate for an unknown reason |
| FingerprintScannerNotSupported | Device does not support Fingerprint Scanner |
| FingerprintScannerNotEnrolled  | Authentication could not start because Fingerprint Scanner has no enrolled fingers |
| FingerprintScannerNotAvailable | Authentication could not start because Fingerprint Scanner is not available on the device |
| KeyInvalidated | Biometric settings was changed |

## License

MIT
