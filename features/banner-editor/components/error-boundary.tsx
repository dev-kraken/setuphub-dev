'use client';

import { IconAlertTriangle } from '@tabler/icons-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface BannerEditorErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback UI to display when an error occurs */
  fallback?: ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface BannerEditorErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for the Banner Editor.
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
export class BannerEditorErrorBoundary extends Component<
  BannerEditorErrorBoundaryProps,
  BannerEditorErrorBoundaryState
> {
  constructor(props: BannerEditorErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BannerEditorErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Banner Editor Error:', error, errorInfo);
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <IconAlertTriangle className="h-8 w-8 text-red-400" stroke={2} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-400">
              Something went wrong
            </h3>
            <p className="max-w-md text-sm text-neutral-400">
              An error occurred while rendering the banner editor. Please try again.
            </p>
            {this.state.error && (
              <p className="mt-2 rounded bg-black/20 px-3 py-2 font-mono text-xs text-neutral-500">
                {this.state.error.message}
              </p>
            )}
          </div>
          <Button
            onClick={this.handleReset}
            variant="outline"
            className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }

  static displayName = 'BannerEditorErrorBoundary';
}
