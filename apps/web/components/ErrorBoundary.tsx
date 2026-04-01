'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught rendering error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-full h-full flex items-center justify-center bg-black/50 border border-red-500/20 rounded-lg p-4 text-center">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                        Neural Render Offline (Hardware Acceleration Disabled)
                    </span>
                </div>
            );
        }

        return this.props.children;
    }
}
