# Error Logging Service Documentation

## Overview

The Error Logging Service provides centralized error tracking, monitoring, and debugging capabilities for ContentFlow. It automatically captures errors, logs them to the database, and supports integration with third-party services like Sentry and LogRocket.

## Features

- Automatic global error and unhandled promise rejection capture
- Categorized error logging with severity levels
- Database persistence with RLS security
- Batch processing with automatic flushing
- Integration support for Sentry and LogRocket
- Error metrics and analytics
- User-specific error tracking
- Admin dashboard capabilities

## Quick Start

### Basic Usage

```typescript
import { errorLogger, ErrorCategory, ErrorSeverity } from './services/errorLoggingService';

// Log a simple error
await errorLogger.logError({
  message: 'Something went wrong',
  severity: ErrorSeverity.ERROR,
  category: ErrorCategory.API,
});

// Log with context
await errorLogger.logError({
  message: 'Failed to fetch user data',
  severity: ErrorSeverity.ERROR,
  category: ErrorCategory.DATABASE,
  context: {
    userId: '123',
    endpoint: '/api/users',
  },
});
```

### Convenience Methods

```typescript
// Authentication errors
await errorLogger.logAuthError('Login failed', error, { email: 'user@example.com' });

// Database errors
await errorLogger.logDatabaseError('Query failed', error, { table: 'users' });

// API errors
await errorLogger.logApiError('API call failed', error, { endpoint: '/api/data' });

// Network errors
await errorLogger.logNetworkError('Connection timeout', { url: 'https://api.example.com' });

// Validation errors
await errorLogger.logValidationError('Invalid email format', { field: 'email', value: 'invalid' });

// Critical errors (auto-flush immediately)
await errorLogger.logCritical('System failure', ErrorCategory.DATABASE, error, { details: '...' });

// Info logging
await errorLogger.logInfo('User logged in', { userId: '123' });

// Warnings
await errorLogger.logWarning('Deprecated API used', ErrorCategory.API, { endpoint: '/old-api' });
```

## Error Categories

```typescript
enum ErrorCategory {
  AUTHENTICATION = 'authentication',    // Login, register, session issues
  DATABASE = 'database',               // Database queries, RLS failures
  API = 'api',                        // External API calls
  NETWORK = 'network',                // Connection issues, timeouts
  VALIDATION = 'validation',          // Input validation failures
  UI = 'ui',                         // UI rendering errors
  EDGE_FUNCTION = 'edge_function',   // Edge function errors
  UNKNOWN = 'unknown',               // Uncategorized errors
}
```

## Error Severity Levels

```typescript
enum ErrorSeverity {
  INFO = 'info',          // Informational messages
  WARNING = 'warning',    // Non-critical issues
  ERROR = 'error',        // Standard errors
  CRITICAL = 'critical',  // Critical system failures (auto-flush)
}
```

## Automatic Error Capture

The service automatically captures:

1. **Window Errors** - JavaScript runtime errors
2. **Unhandled Promise Rejections** - Async errors not caught

```typescript
// Automatically captured
throw new Error('This will be logged');

// Automatically captured
Promise.reject('This will also be logged');
```

## Database Schema

### error_logs Table

```sql
CREATE TABLE error_logs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  severity text NOT NULL,
  category text NOT NULL,
  stack text,
  context jsonb,
  user_agent text,
  url text,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL
);
```

### Indexes

- `idx_error_logs_user_id` - User-specific queries
- `idx_error_logs_occurred_at` - Time-based queries
- `idx_error_logs_severity` - Filter by severity
- `idx_error_logs_category` - Group by category

### Row Level Security

- Users can insert their own error logs
- Anonymous users can insert error logs (pre-auth errors)
- Users can view their own error logs
- Admins can view all error logs
- Admins can delete error logs

## Configuration

### Auto-Flush Settings

```typescript
// Default settings
maxQueueSize = 50;        // Flush when queue reaches 50 errors
flushInterval = 30000;    // Flush every 30 seconds
```

Critical errors (severity: CRITICAL) are flushed immediately regardless of queue size.

### Enable/Disable Logging

```typescript
// Disable logging (e.g., during development)
errorLogger.disable();

// Re-enable logging
errorLogger.enable();
```

## Third-Party Integrations

### Sentry Integration

```typescript
// Enable Sentry (requires @sentry/browser installed)
errorLogger.enableSentry('your-sentry-dsn');

// Or if Sentry is already initialized
errorLogger.enableSentry();
```

**Installation:**
```bash
npm install @sentry/browser
```

**Sentry Initialization (in your main.tsx or App.tsx):**
```typescript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### LogRocket Integration

```typescript
// Enable LogRocket (requires logrocket installed)
errorLogger.enableLogRocket('your-app-id');

// Or if LogRocket is already initialized
errorLogger.enableLogRocket();
```

**Installation:**
```bash
npm install logrocket
```

**LogRocket Initialization:**
```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

## Error Metrics & Analytics

### Get Error Metrics

```typescript
// Get metrics for last 24 hours (default)
const metrics = await errorLogger.getErrorMetrics();

// Get metrics for last 7 days
const weekMetrics = await errorLogger.getErrorMetrics(168);

console.log(metrics);
/*
{
  totalErrors: 42,
  errorsByCategory: {
    authentication: 5,
    database: 10,
    api: 15,
    network: 8,
    validation: 4,
    ui: 0,
    edge_function: 0,
    unknown: 0
  },
  errorsBySeverity: {
    info: 10,
    warning: 15,
    error: 15,
    critical: 2
  },
  recentErrors: [
    {
      message: "Failed to fetch data",
      severity: "error",
      category: "api",
      timestamp: "2025-12-28T10:30:00Z",
      ...
    }
  ]
}
*/
```

### Display in Admin Dashboard

```typescript
import { errorLogger } from '../services/errorLoggingService';

function ErrorMetricsDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await errorLogger.getErrorMetrics(24);
    setMetrics(data);
  };

  return (
    <div>
      <h2>Error Metrics (Last 24 Hours)</h2>
      <p>Total Errors: {metrics?.totalErrors}</p>

      <h3>By Category</h3>
      {Object.entries(metrics?.errorsByCategory || {}).map(([category, count]) => (
        <div key={category}>{category}: {count}</div>
      ))}

      <h3>By Severity</h3>
      {Object.entries(metrics?.errorsBySeverity || {}).map(([severity, count]) => (
        <div key={severity}>{severity}: {count}</div>
      ))}

      <h3>Recent Errors</h3>
      {metrics?.recentErrors.map(error => (
        <div key={error.timestamp}>
          [{error.severity}] {error.message}
        </div>
      ))}
    </div>
  );
}
```

## Maintenance

### Clear Old Logs

```typescript
// Clear logs older than 30 days (default)
await errorLogger.clearOldLogs();

// Clear logs older than 7 days
await errorLogger.clearOldLogs(7);

// Clear logs older than 90 days
await errorLogger.clearOldLogs(90);
```

**Recommended:** Set up a scheduled job to run this weekly/monthly.

## Best Practices

### 1. Use Appropriate Severity Levels

```typescript
// ✅ Good
await errorLogger.logInfo('User viewed page', { page: '/dashboard' });
await errorLogger.logWarning('API rate limit approaching', ErrorCategory.API);
await errorLogger.logError({ message: 'Failed to save', severity: ErrorSeverity.ERROR });
await errorLogger.logCritical('Database connection lost', ErrorCategory.DATABASE);

// ❌ Bad
await errorLogger.logCritical('User clicked button', ErrorCategory.UI); // Not critical!
await errorLogger.logInfo('Server crashed', { details: '...' }); // Should be critical!
```

### 2. Include Context

```typescript
// ✅ Good - Includes helpful context
await errorLogger.logApiError('Failed to fetch user', error, {
  userId: user.id,
  endpoint: '/api/users/123',
  method: 'GET',
  statusCode: 500,
});

// ❌ Bad - No context
await errorLogger.logApiError('Failed to fetch user', error);
```

### 3. Don't Log Sensitive Data

```typescript
// ❌ Bad - Contains passwords, tokens
await errorLogger.logError({
  message: 'Login failed',
  context: {
    password: 'user-password-123',
    apiKey: 'secret-key',
  },
});

// ✅ Good - Sanitized
await errorLogger.logError({
  message: 'Login failed',
  context: {
    email: 'user@example.com',
    reason: 'Invalid credentials',
  },
});
```

### 4. Wrap Critical Operations

```typescript
async function criticalOperation() {
  try {
    // Critical business logic
    await processPayment();
  } catch (error) {
    await errorLogger.logCritical(
      'Payment processing failed',
      ErrorCategory.API,
      error,
      { orderId: order.id }
    );
    throw error; // Re-throw after logging
  }
}
```

### 5. Use in Try-Catch Blocks

```typescript
// In services
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    await errorLogger.logApiError('Failed to fetch data', error, {
      endpoint: '/api/data',
    });
    throw error;
  }
}
```

## Integration Examples

### With React Error Boundaries

```typescript
import { Component, ReactNode } from 'react';
import { errorLogger, ErrorCategory, ErrorSeverity } from './services/errorLoggingService';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    await errorLogger.logError({
      message: error.message,
      severity: ErrorSeverity.ERROR,
      category: ErrorCategory.UI,
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### With API Interceptors

```typescript
// Axios interceptor example
axios.interceptors.response.use(
  response => response,
  async error => {
    await errorLogger.logApiError(
      `API Error: ${error.message}`,
      error,
      {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      }
    );
    return Promise.reject(error);
  }
);
```

## Performance Considerations

1. **Batch Processing** - Errors are queued and flushed in batches to reduce database calls
2. **Async Logging** - All logging is async and doesn't block the main thread
3. **Auto-Flush** - Queue automatically flushes every 30 seconds or when reaching 50 errors
4. **Critical Priority** - Critical errors flush immediately for quick visibility

## Monitoring Recommendations

### Daily Monitoring

- Check critical errors immediately
- Review error trends (increasing/decreasing)
- Identify patterns in error categories

### Weekly Maintenance

- Review error metrics
- Clear old logs (30+ days)
- Update error handling based on patterns

### Monthly Review

- Analyze error trends over time
- Identify areas for improvement
- Update monitoring thresholds

## Troubleshooting

### Errors Not Appearing in Database

1. Check RLS policies are enabled
2. Verify user is authenticated (for authenticated logs)
3. Check browser console for flush errors
4. Ensure error_logs table exists

### High Error Volume

1. Check for error loops (errors generating more errors)
2. Review network errors (could indicate infrastructure issues)
3. Consider increasing flush interval
4. Enable Sentry/LogRocket for better visibility

### Performance Issues

1. Reduce maxQueueSize if memory is constrained
2. Increase flushInterval to reduce database calls
3. Use indexes for querying error_logs table
4. Regularly clear old logs

## Security Considerations

1. **No PII in Logs** - Never log passwords, tokens, or sensitive user data
2. **RLS Protection** - Users can only see their own errors
3. **Admin Access** - Only admins can view all errors
4. **Sanitize Context** - Always sanitize context data before logging
5. **Rate Limiting** - Consider rate limiting error logging to prevent abuse

## Future Enhancements

Potential improvements for the error logging service:

1. Real-time error alerts (email, Slack, SMS)
2. Error grouping and deduplication
3. Error resolution tracking
4. Performance monitoring integration
5. Custom error dashboards
6. Error trends and predictions
7. Automatic error categorization with ML
8. Source map support for stack traces
9. Error replay functionality
10. Integration with more services (Datadog, New Relic, etc.)

## Support

For issues or questions about the error logging service:

1. Check this documentation
2. Review error logs in the database
3. Check browser console for client-side errors
4. Review Supabase logs for database errors

## License

Part of ContentFlow application.
