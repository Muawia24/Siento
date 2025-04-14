// components/ToggleSetting.ts
export function ToggleSetting({ 
    icon: Icon, 
    title, 
    description, 
    enabled, 
    onToggle 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }