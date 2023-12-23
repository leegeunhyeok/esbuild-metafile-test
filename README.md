# esbuild-metafile-test

> Test + PoC of esbuild's metafile

## Metafile

Using generated metafile from [react-native-esbuild](https://github.com/leegeunhyeok/react-native-esbuild)'s example project.

## Preview

### Dependencies

```js
// src/screens/MainScreen.tsx
const result = {
  id: 1358,
  dependencies: [
    { id: 510, path: 'node_modules/react/jsx-runtime.js' },
    { id: 74, path: 'node_modules/react/index.js' },
    { id: 449, path: 'node_modules/react-native/index.js' },
    {
      id: 519,
      path: 'node_modules/react-native-safe-area-context/src/index.tsx'
    },
    { id: 1043, path: 'node_modules/dripsy/src/index.ts' },
    { id: 1122, path: 'src/components/index.ts' },
    { id: 1357, path: 'src/assets/logo.svg' },
  ],
};
```

### Inverse Dependencies

```js
// src/screens/MainScreen.tsx
const result = {
  id: 1358,
  inverseDependencies: [
    { id: 1358, path: 'src/screens/MainScreen.tsx' },
    { id: 1361, path: 'src/screens/index.ts' },
    { id: 1362, path: 'src/navigators/RootStack.tsx' },
    { id: 1363, path: 'src/navigators/index.ts' },
    { id: 1367, path: 'src/App.tsx' },
    { id: 0, path: 'index.js' },
  ],
};
```
