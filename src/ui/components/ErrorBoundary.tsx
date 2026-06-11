import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Catches render/runtime errors so a crash shows a recoverable message and
 *  the option to reset local state, rather than a blank screen. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console for debugging; no remote logging (no backend).
    console.error("App error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="h-full flex items-center justify-center p-6" style={{ background: "var(--color-exam-bg)" }}>
        <div className="card p-6 max-w-md text-center space-y-3">
          <div className="text-2xl" aria-hidden>⚠️</div>
          <h1 className="text-[17px] font-bold">Something went wrong</h1>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-exam-muted)" }}>
            The app hit an unexpected error. Reloading usually fixes it. Your saved progress is kept;
            if the problem persists you can reset local data.
          </p>
          <pre
            className="text-left text-[11px] font-mono whitespace-pre-wrap rounded-lg border p-2 max-h-28 overflow-auto"
            style={{ borderColor: "var(--color-exam-border)", background: "#fafbfd", color: "var(--color-exam-danger)" }}
          >
            {this.state.error.message}
          </pre>
          <div className="flex items-center justify-center gap-2">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload
            </button>
            <button
              className="btn"
              onClick={() => {
                try {
                  // Clear only the in-progress session, not analytics/reviews.
                  localStorage.removeItem("osce.session.v1");
                } catch {
                  /* ignore */
                }
                window.location.reload();
              }}
            >
              Reset current session
            </button>
          </div>
        </div>
      </div>
    );
  }
}
