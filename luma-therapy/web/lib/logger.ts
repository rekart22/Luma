interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  traceId?: string;
  [key: string]: any;
}

class EdgeLogger {
  private static formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, traceId, ...metadata } = entry;
    let msg = `${timestamp} [${level.toUpperCase()}] ${traceId ? `[${traceId}] ` : ''}${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }

  private static log(level: LogEntry['level'], message: string, metadata: Record<string, any> = {}) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    const formattedMessage = this.formatMessage(entry);
    
    // In production, we could send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement production logging (e.g., to a logging service)
      console[level](formattedMessage);
    } else {
      console[level](formattedMessage);
    }
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    EdgeLogger.log('debug', message, metadata);
  }

  info(message: string, metadata: Record<string, any> = {}) {
    EdgeLogger.log('info', message, metadata);
  }

  warn(message: string, metadata: Record<string, any> = {}) {
    EdgeLogger.log('warn', message, metadata);
  }

  error(message: string, metadata: Record<string, any> = {}) {
    EdgeLogger.log('error', message, metadata);
  }
}

export function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const logger = new EdgeLogger();
export default logger; 