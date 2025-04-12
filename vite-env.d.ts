/// <reference types="vite/client" />

// Global process declaration for Node.js
declare var process: {
  env: {
    NODE_ENV: string;
    REPL_ID?: string;
    [key: string]: string | undefined;
  };
  cwd(): string;
};
