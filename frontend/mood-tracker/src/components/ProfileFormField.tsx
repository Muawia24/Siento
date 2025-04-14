 // components/ProfileFormField.tsx
 export function ProfileFormField({ 
    id, name, label, value, onChange, type = 'text', placeholder = '', textarea = false 
  }: {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    textarea?: boolean;
  }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {textarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }