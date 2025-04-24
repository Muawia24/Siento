import { ChevronRight, LogOut, Loader2 } from 'lucide-react';
 
 export function DangerZone({ 
    onDelete, 
    isDeleting 
  }: { 
    onDelete: () => void; 
    isDeleting: boolean 
  }) {
    return (
      <div className="border-t border-gray-200 px-8 py-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <button 
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <div>
                <h3 className="text-sm font-medium">Delete Account</h3>
                <p className="text-sm opacity-75">Permanently delete your account and all data</p>
              </div>
            </div>
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    );
  }