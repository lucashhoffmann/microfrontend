import { spawn } from 'node:child_process';
import net from 'node:net';

const shouldStartMock =
  process.argv.includes('--mock') || process.env.npm_config_mock === 'true';

const mockPort = Number(process.env.MOCK_API_PORT ?? 3333);

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });

    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });

    socket.once('error', () => {
      resolve(false);
    });
  });
}

async function isExistingMockHealthy() {
  try {
    const response = await fetch(`http://127.0.0.1:${mockPort}/api/billing/dashboard`);
    return response.ok;
  } catch {
    return false;
  }
}

const shouldReuseMock =
  shouldStartMock &&
  (await isPortOpen(mockPort)) &&
  (await isExistingMockHealthy());

const commands = [
  {
    label: 'shell',
    command: 'pnpm',
    args: ['nx', 'serve', 'shell'],
  },
  ...(shouldStartMock && !shouldReuseMock
    ? [
        {
          label: 'mock',
          command: 'pnpm',
          args: ['mock:api'],
        },
      ]
    : []),
];

const children = [];
let isShuttingDown = false;
let expectedExitCode = 0;

function stopChildren(signal = 'SIGTERM', exitCode = expectedExitCode) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  expectedExitCode = exitCode;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

function removeChild(processId) {
  const childIndex = children.findIndex(child => child.pid === processId);

  if (childIndex >= 0) {
    children.splice(childIndex, 1);
  }
}

function finishIfDone() {
  if (children.length === 0) {
    process.exit(expectedExitCode);
  }
}

function startProcess({ label, command, args }) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('error', (error) => {
    console.error(`[${label}] failed to start:`, error);
    stopChildren('SIGTERM', 1);
  });

  child.on('exit', (code, signal) => {
    removeChild(child.pid);

    if (!isShuttingDown) {
      if (signal) {
        console.log(`[${label}] exited due to ${signal}`);
        stopChildren('SIGTERM', 1);
      } else if (code && code !== 0) {
        console.error(`[${label}] exited with code ${code}`);
        stopChildren('SIGTERM', code);
      } else {
        stopChildren('SIGTERM', 0);
      }
    }

    finishIfDone();
  });

  children.push(child);
}

process.on('SIGINT', () => {
  stopChildren('SIGINT', 0);
});

process.on('SIGTERM', () => {
  stopChildren('SIGTERM', 0);
});

if (shouldReuseMock) {
  console.log(`[mock] reusing existing mock API on port ${mockPort}`);
}

for (const command of commands) {
  startProcess(command);
}
