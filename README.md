# react-native-fast-debugger

<p align="center">
  <img src="https://img.shields.io/npm/v/react-native-fast-debugger?color=green" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/react-native-fast-debugger" alt="npm downloads" />
  <img src="https://img.shields.io/badge/react--native-0.70+-blue" alt="react-native" />
</p>

Support for debugger:
🚀 Easy plug & play with axios

📡 Logs all requests & responses

🎨 Optional theming

🧹 Auto-clears old logs (with maxRequests)

## Installation


```sh
npm install react-native-fast-debugger
```


## Usage

1. Create an axios instance
```js

import React from "react";
import { StyleSheet, Text } from "react-native";
import { NetworkLoggerProvider } from "react-native-fast-debugger";
import axios from "axios";

const axiosInstance = axios.create({});

export default function App() {
  return (
    <NetworkLoggerProvider axiosInstance={axiosInstance}>
      <Text>Result</Text>
    </NetworkLoggerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
