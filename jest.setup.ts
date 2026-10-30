import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: (k: string) => Promise.resolve(data.get(k) ?? null),
      setItem: (k: string, v: string) => Promise.resolve(void data.set(k, v)),
      removeItem: (k: string) => Promise.resolve(void data.delete(k)),
    },
  };
});

jest.mock('expo-haptics', () => ({ selectionAsync: () => Promise.resolve() }));

jest.mock('react-native-worklets', () =>
  jest.requireActual<object>('react-native-worklets/lib/module/mock'),
);
jest.mock('react-native-reanimated', () =>
  jest.requireActual<object>('react-native-reanimated/mock'),
);
