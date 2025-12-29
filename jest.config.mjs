// import type { Config } from "jest";

// // const config: Config = {
// //   verbose: true,
// //   preset: "ts-jest/presets/default-esm",
// //   testEnvironment: "node",
// //   extensionsToTreatAsEsm: [".ts"],

// //   transform: {
// //     "^.+\\.tsx?$": [
// //       "ts-jest",
// //       {
// //         tsconfig: "tsconfig.jest.json",
// //       },
// //     ],
// //   },
// // };

// // export default config;

// const config: Config = {
//   verbose: true,
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",
//   extensionsToTreatAsEsm: [".ts"],
//   globals: {
//     "ts-jest": {
//       useESM: true,
//     },
//   },
//   transform: {
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         tsconfig: "tsconfig.jest.json",
//       },
//     ],
//   },
// };

// export default config;

export default {
  verbose: true,
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
};
