import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        paper: '#f7f7f2',
        moss: '#3f5f46',
        coral: '#c45f4c',
        steel: '#355c7d',
      },
    },
  },
  plugins: [],
};

export default config;
