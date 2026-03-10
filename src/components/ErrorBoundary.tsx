import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">Ошибка загрузки</h1>
          <pre className="mt-4 max-w-2xl overflow-auto rounded-lg bg-muted p-4 text-sm text-destructive">
            {this.state.error.toString()}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
