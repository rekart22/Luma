import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Minimal color logger for Edge runtime
const colors = {
  debug: '\x1b[36m',    // cyan
  info: '\x1b[32m',     // green
  warn: '\x1b[33m',     // yellow
  error: '\x1b[31m',    // red
  critical: '\x1b[41m', // red background
  reset: '\x1b[0m',
};

// Set this to true to enable DEBUG logs
const ENABLE_DEBUG_LOGS = false;

function log(level: keyof typeof colors, message: string, meta: any = {}) {
  if (level === 'debug' && !ENABLE_DEBUG_LOGS) return; // Suppress DEBUG logs unless enabled
  const color = colors[level] || colors.info;
  const reset = colors.reset;
  const ts = new Date().toISOString();
  // Print traceId if present
  const trace = meta && meta.traceId ? ` [traceId: ${meta.traceId}]` : '';
  // Print meta if present (excluding traceId)
  const metaStr = Object.keys(meta).filter(k => k !== 'traceId').length ? ` ${JSON.stringify(Object.fromEntries(Object.entries(meta).filter(([k]) => k !== 'traceId')))} ` : '';
  // eslint-disable-next-line no-console
  console.log(`${color}${ts} [${level.toUpperCase()}]${trace}: ${message}${metaStr}${reset}`);
}

export const logger = {
  debug: (msg: string, meta?: any) => log('debug', msg, meta),
  info: (msg: string, meta?: any) => log('info', msg, meta),
  warn: (msg: string, meta?: any) => log('warn', msg, meta),
  error: (msg: string, meta?: any) => log('error', msg, meta),
  critical: (msg: string, meta?: any) => log('critical', msg, meta),
};

// Trace ID generator (UUID v4)
export function generateTraceId() {
  return uuidv4();
} 