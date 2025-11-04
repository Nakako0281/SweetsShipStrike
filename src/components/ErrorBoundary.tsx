'use client';

import React, { Component, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * エラーバウンダリコンポーネント
 * アプリケーション全体のエラーをキャッチして表示
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-3xl font-bold text-purple-800 mb-4">エラーが発生しました</h1>
            <p className="text-purple-600 mb-6">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-red-800 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button onClick={this.handleReset} variant="primary" size="lg">
              タイトルへ戻る
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
