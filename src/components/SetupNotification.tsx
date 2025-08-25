import React, { useState } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';

interface SetupNotificationProps {
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  onClose?: () => void;
}

const SetupNotification: React.FC<SetupNotificationProps> = ({
  title,
  message,
  actionText,
  actionUrl,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
            {title}
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            {message}
          </p>
          {actionText && actionUrl && (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 mt-2 font-medium"
            >
              {actionText}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SetupNotification;