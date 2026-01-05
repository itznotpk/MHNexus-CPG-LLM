import React, { useState } from 'react';
import { 
  FileEdit, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  ChevronDown,
  AlertCircle,
  History
} from 'lucide-react';
import { Badge, Button } from '../shared';

// Workflow States
export const WORKFLOW_STATES = {
  DRAFT: 'draft',
  REVIEWED: 'reviewed',
  APPROVED: 'approved'
};

const stateConfig = {
  [WORKFLOW_STATES.DRAFT]: {
    label: 'Draft',
    icon: FileEdit,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Pending review'
  },
  [WORKFLOW_STATES.REVIEWED]: {
    label: 'Reviewed',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    description: 'Awaiting final approval'
  },
  [WORKFLOW_STATES.APPROVED]: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 border-green-200',
    dotColor: 'bg-green-500',
    description: 'Ready for implementation'
  }
};

// Workflow Status Badge
export function WorkflowStatusBadge({ status, size = 'md' }) {
  const config = stateConfig[status] || stateConfig[WORKFLOW_STATES.DRAFT];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses[size]}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
}

// Workflow Progress Indicator
export function WorkflowProgress({ currentStatus }) {
  const states = [WORKFLOW_STATES.DRAFT, WORKFLOW_STATES.REVIEWED, WORKFLOW_STATES.APPROVED];
  const currentIndex = states.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-2">
      {states.map((state, index) => {
        const config = stateConfig[state];
        const Icon = config.icon;
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={state}>
            <div className={`flex items-center gap-1.5 ${isCurrent ? 'opacity-100' : isComplete ? 'opacity-70' : 'opacity-40'}`}>
              <div className={`p-1.5 rounded-full ${isCurrent ? config.color : isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-medium ${isCurrent ? 'text-slate-700' : 'text-slate-500'}`}>
                {config.label}
              </span>
            </div>
            {index < states.length - 1 && (
              <div className={`w-8 h-0.5 ${index < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Workflow Actions Panel
export function WorkflowActions({ 
  currentStatus, 
  onStatusChange, 
  onReject,
  history = [],
  disabled = false 
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [comment, setComment] = useState('');

  const handleAdvance = () => {
    let nextStatus;
    if (currentStatus === WORKFLOW_STATES.DRAFT) {
      nextStatus = WORKFLOW_STATES.REVIEWED;
    } else if (currentStatus === WORKFLOW_STATES.REVIEWED) {
      nextStatus = WORKFLOW_STATES.APPROVED;
    }
    
    if (nextStatus && onStatusChange) {
      onStatusChange(nextStatus, comment);
      setComment('');
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(comment);
      setComment('');
    }
  };

  const getActionButton = () => {
    switch (currentStatus) {
      case WORKFLOW_STATES.DRAFT:
        return (
          <Button
            variant="primary"
            size="sm"
            icon={CheckCircle}
            onClick={handleAdvance}
            disabled={disabled}
          >
            Mark as Reviewed
          </Button>
        );
      case WORKFLOW_STATES.REVIEWED:
        return (
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            onClick={handleAdvance}
            disabled={disabled}
          >
            Approve
          </Button>
        );
      case WORKFLOW_STATES.APPROVED:
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Approved</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-primary-600" />
          Approval Workflow
        </h3>
        <WorkflowStatusBadge status={currentStatus} size="sm" />
      </div>

      {/* Progress Indicator */}
      <div className="mb-4">
        <WorkflowProgress currentStatus={currentStatus} />
      </div>

      {/* Comment Input */}
      {currentStatus !== WORKFLOW_STATES.APPROVED && (
        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white/80"
            rows={2}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getActionButton()}
          {currentStatus !== WORKFLOW_STATES.DRAFT && currentStatus !== WORKFLOW_STATES.APPROVED && (
            <Button
              variant="danger"
              size="sm"
              icon={AlertCircle}
              onClick={handleReject}
              disabled={disabled}
            >
              Reject
            </Button>
          )}
        </div>
        
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <History className="w-3.5 h-3.5" />
            History ({history.length})
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div className={`p-1 rounded-full ${stateConfig[item.status]?.dotColor || 'bg-slate-400'}`}>
                  <div className="w-2 h-2" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{item.action}</span>
                    <span className="text-xs text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <User className="w-3 h-3" />
                    {item.user}
                  </div>
                  {item.comment && (
                    <p className="text-xs text-slate-600 mt-1 italic">"{item.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Workflow Indicator for List Items
export function WorkflowIndicator({ status, onClick }) {
  const config = stateConfig[status] || stateConfig[WORKFLOW_STATES.DRAFT];
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${config.color} hover:opacity-80 transition-opacity`}
      title={config.description}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </button>
  );
}
