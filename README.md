# esbuild-metafile-test

> Test + PoC of esbuild's metafile

## Metafile

Using metafile -> [react-native-esbuild](https://github.com/leegeunhyeok/react-native-esbuild)'s example project.

## Preview

### Dependencies

```
# src/screens/MainScreen.tsx
{
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
    { id: 1357, path: 'src/assets/logo.svg' }
  ]
}
```
