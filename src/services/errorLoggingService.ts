import { supabase } from '../lib/supabase';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  API = 'api',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UI = 'ui',
  EDGE_FUNCTION = 'edge_function',
  UNKNOWN = 'unknown',
}

export interface ErrorLogEntry {
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  recentErrors: ErrorLogEntry[];
}

class ErrorLoggingService {
  private errorQueue: ErrorLogEntry[] = [];
  private maxQueueSize = 50;
  private flushInterval = 30000;
  private flushTimer?: number;
  private isEnabled = true;
  private sentryEnabled = false;
  private logRocketEnabled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWindowErrorHandlers();
      this.startAutoFlush();
    }
  }

  private initializeWindowErrorHandlers() {
    window.addEventListener('error', (event: ErrorEvent) => {
      this.logError({
        message: event.message,
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.UI,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.UNKNOWN,
        stack: event.reason?.stack,
        context: {
          reason: event.reason,
        },
      });
    });
  }

  private startAutoFlush() {
    this.flushTimer = window.setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flushErrors();
      }
    }, this.flushInterval);
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id;
    } catch {
      return undefined;
    }
  }

  private createLogEntry(error: Partial<ErrorLogEntry>): ErrorLogEntry {
    return {
      message: error.message || 'Unknown error',
      severity: error.severity || ErrorSeverity.ERROR,
      category: error.category || ErrorCategory.UNKNOWN,
      stack: error.stack,
      context: error.context,
      userId: error.userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  async logError(error: Partial<ErrorLogEntry>): Promise<void> {
    if (!this.isEnabled) return;

    const userId = error.userId || await this.getCurrentUserId();
    const logEntry = this.createLogEntry({ ...error, userId });

    console.error(`[${logEntry.severity.toUpperCase()}] [${logEntry.category}]`, logEntry.message, {
      stack: logEntry.stack,
      context: logEntry.context,
      userId: logEntry.userId,
    });

    this.errorQueue.push(logEntry);

    if (this.errorQueue.length >= this.maxQueueSize) {
      await this.flushErrors();
    }

    if (logEntry.severity === ErrorSeverity.CRITICAL) {
      await this.flushErrors();
    }

    if (this.sentryEnabled) {
      this.sendToSentry(logEntry);
    }

    if (this.logRocketEnabled) {
      this.sendToLogRocket(logEntry);
    }
  }

  async logInfo(message: string, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.INFO,
      category: ErrorCategory.UNKNOWN,
      context,
    });
  }

  async logWarning(message: string, category: ErrorCategory, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.WARNING,
      category,
      context,
    });
  }

  async logCritical(message: string, category: ErrorCategory, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.CRITICAL,
      category,
      stack: error?.stack,
      context,
    });
  }

  async logAuthError(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.AUTHENTICATION,
      stack: error?.stack,
      context,
    });
  }

  async logDatabaseError(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.DATABASE,
      stack: error?.stack,
      context,
    });
  }

  async logApiError(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.API,
      stack: error?.stack,
      context,
    });
  }

  async logNetworkError(message: string, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.NETWORK,
      context,
    });
  }

  async logValidationError(message: string, context?: Record<string, any>): Promise<void> {
    await this.logError({
      message,
      severity: ErrorSeverity.WARNING,
      category: ErrorCategory.VALIDATION,
      context,
    });
  }

  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      const { error } = await supabase.from('error_logs').insert(
        errorsToSend.map(err => ({
          user_id: err.userId,
          message: err.message,
          severity: err.severity,
          category: err.category,
          stack: err.stack,
          context: err.context,
          user_agent: err.userAgent,
          url: err.url,
          occurred_at: err.timestamp,
        }))
      );

      if (error) {
        console.warn('Failed to flush errors to database:', error);
        this.errorQueue.push(...errorsToSend);
      }
    } catch (flushError) {
      console.warn('Error flushing logs:', flushError);
      this.errorQueue.push(...errorsToSend);
    }
  }

  private sendToSentry(error: ErrorLogEntry): void {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      const Sentry = (window as any).Sentry;
      Sentry.captureException(new Error(error.message), {
        level: error.severity,
        tags: {
          category: error.category,
        },
        extra: {
          ...error.context,
          stack: error.stack,
        },
      });
    }
  }

  private sendToLogRocket(error: ErrorLogEntry): void {
    if (typeof window !== 'undefined' && (window as any).LogRocket) {
      const LogRocket = (window as any).LogRocket;
      LogRocket.captureException(new Error(error.message), {
        tags: {
          severity: error.severity,
          category: error.category,
        },
        extra: error.context,
      });
    }
  }

  async getErrorMetrics(hours = 24): Promise<ErrorMetrics> {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    try {
      const { data: errors, error } = await supabase
        .from('error_logs')
        .select('*')
        .gte('occurred_at', startTime.toISOString())
        .order('occurred_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const errorsByCategory: Record<ErrorCategory, number> = {
        [ErrorCategory.AUTHENTICATION]: 0,
        [ErrorCategory.DATABASE]: 0,
        [ErrorCategory.API]: 0,
        [ErrorCategory.NETWORK]: 0,
        [ErrorCategory.VALIDATION]: 0,
        [ErrorCategory.UI]: 0,
        [ErrorCategory.EDGE_FUNCTION]: 0,
        [ErrorCategory.UNKNOWN]: 0,
      };

      const errorsBySeverity: Record<ErrorSeverity, number> = {
        [ErrorSeverity.INFO]: 0,
        [ErrorSeverity.WARNING]: 0,
        [ErrorSeverity.ERROR]: 0,
        [ErrorSeverity.CRITICAL]: 0,
      };

      errors?.forEach(err => {
        errorsByCategory[err.category as ErrorCategory]++;
        errorsBySeverity[err.severity as ErrorSeverity]++;
      });

      return {
        totalErrors: errors?.length || 0,
        errorsByCategory,
        errorsBySeverity,
        recentErrors: (errors || []).slice(0, 20).map(err => ({
          message: err.message,
          severity: err.severity as ErrorSeverity,
          category: err.category as ErrorCategory,
          stack: err.stack,
          context: err.context,
          userId: err.user_id,
          timestamp: err.occurred_at,
          userAgent: err.user_agent,
          url: err.url,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch error metrics:', error);
      return {
        totalErrors: 0,
        errorsByCategory: {} as Record<ErrorCategory, number>,
        errorsBySeverity: {} as Record<ErrorSeverity, number>,
        recentErrors: [],
      };
    }
  }

  enableSentry(dsn?: string): void {
    this.sentryEnabled = true;
    if (dsn && typeof window !== 'undefined' && !(window as any).Sentry) {
      console.info('Sentry DSN provided but Sentry SDK not loaded. Load @sentry/browser to enable.');
    }
  }

  enableLogRocket(appId?: string): void {
    this.logRocketEnabled = true;
    if (appId && typeof window !== 'undefined' && !(window as any).LogRocket) {
      console.info('LogRocket App ID provided but LogRocket SDK not loaded. Load logrocket to enable.');
    }
  }

  disable(): void {
    this.isEnabled = false;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  enable(): void {
    this.isEnabled = true;
    if (!this.flushTimer) {
      this.startAutoFlush();
    }
  }

  async clearOldLogs(daysToKeep = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    try {
      const { error } = await supabase
        .from('error_logs')
        .delete()
        .lt('occurred_at', cutoffDate.toISOString());

      if (error) throw error;
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }
}

export const errorLogger = new ErrorLoggingService();
