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

