import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#111827', brand: '#6d5dfc' } } }, plugins: [] };
export default config;
