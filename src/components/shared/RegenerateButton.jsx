import React, { useState } from 'react';
import { RefreshCw, ThumbsUp, ThumbsDown, MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { Button, Badge } from '../shared';

// Feedback options for regeneration
const feedbackOptions = [
  { id: 'more_conservative', label: 'More Conservative', icon: '🛡️' },
  { id: 'more_aggressive', label: 'More Aggressive', icon: '⚡' },
  { id: 'different_approach', label: 'Different Approach', icon: '🔄' },
  { id: 'more_specific', label: 'More Specific', icon: '🎯' },
  { id: 'simpler', label: 'Simpler Plan', icon: '📋' },
  { id: 'custom', label: 'Custom Feedback', icon: '✏️' }
];

// Single Regenerate Button with Dropdown
export function RegenerateButton({ 
  onRegenerate, 
  label = 'Regenerate', 
  size = 'sm',
  variant = 'secondary',
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customFeedback, setCustomFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!selectedOption) return;
    
    setIsLoading(true);
    const feedback = selectedOption === 'custom' ? customFeedback : selectedOption;
    
    try {
      await onRegenerate?.(feedback);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setSelectedOption(null);
      setCustomFeedback('');
    }
  };

  const handleQuickRegenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      onRegenerate?.('default');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <Button
          variant={variant}
          size={size}
          icon={RefreshCw}
          onClick={handleQuickRegenerate}
          disabled={disabled || isLoading}
          className={isLoading ? 'animate-spin-slow' : ''}
        >
          {isLoading ? 'Regenerating...' : label}
        </Button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`p-2 rounded-lg border ${
            isOpen ? 'bg-primary-100 border-primary-300' : 'bg-white/80 border-slate-300'
          } hover:bg-primary-50 transition-colors disabled:opacity-50`}
          title="Regenerate with feedback"
        >
          <MessageSquare className="w-4 h-4 text-primary-600" />
        </button>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-primary-50 to-teal-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                Regenerate with Feedback
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/50 rounded"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Your feedback helps improve AI recommendations
            </p>
          </div>

          <div className="p-3 space-y-2">
            {feedbackOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedOption === option.id
                    ? 'bg-primary-100 border-primary-300 border'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm text-slate-700">{option.label}</span>
                {selectedOption === option.id && (
                  <Badge variant="primary" className="ml-auto">Selected</Badge>
                )}
              </button>
            ))}
          </div>

          {/* Custom Feedback Input */}
          {selectedOption === 'custom' && (
            <div className="px-3 pb-3">
              <textarea
                value={customFeedback}
                onChange={(e) => setCustomFeedback(e.target.value)}
                placeholder="Describe what you'd like different..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={2}
                autoFocus
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setSelectedOption(null);
                setCustomFeedback('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={handleRegenerate}
              disabled={!selectedOption || (selectedOption === 'custom' && !customFeedback.trim()) || isLoading}
            >
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick Feedback Buttons (Thumbs up/down)
export function QuickFeedback({ onFeedback, itemId }) {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback?.(itemId, type);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleFeedback('up')}
        className={`p-1.5 rounded transition-colors ${
          feedback === 'up'
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-slate-100 text-slate-400 hover:text-green-600'
        }`}
        title="Helpful"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`p-1.5 rounded transition-colors ${
          feedback === 'down'
            ? 'bg-red-100 text-red-600'
            : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
        }`}
        title="Not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
}

// Feedback Banner for AI Improvement
export function FeedbackBanner({ onProvideFeedback }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-teal-50 rounded-lg p-4 border border-primary-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Help Improve AI Recommendations</h4>
            <p className="text-xs text-slate-600 mt-1">
              Your feedback helps our AI learn and provide better care plan recommendations. 
              Rate recommendations or regenerate with specific feedback.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-white/50 rounded text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
