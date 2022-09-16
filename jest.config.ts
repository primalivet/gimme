/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import { Config } from 'jest'
const config: Config = {
  verbose: true,
  bail: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
}

export default config
