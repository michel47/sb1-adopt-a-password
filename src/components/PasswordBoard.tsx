import React from 'react';
import { Password } from '../lib/types';
import { Lock } from 'lucide-react';

interface PasswordBoardProps {
  passwords: Password[];
  onSelect: (password: Password) => void;
  selectedId: string | null;
}

export function PasswordBoard({ passwords, onSelect, selectedId }: PasswordBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {passwords.map((password) => (
        <div
          key={password.id}
          className={`
            p-6 rounded-lg shadow-md transition-all cursor-pointer
            ${password.sold ? 'bg-gray-100' : 'bg-white hover:shadow-lg'}
            ${selectedId === password.id ? 'ring-2 ring-blue-500' : ''}
          `}
          onClick={() => onSelect(password)}
        >
          <div className="flex items-center justify-between mb-4">
            <Lock className={password.sold ? 'text-gray-400' : 'text-blue-500'} />
            <span className="text-sm font-medium text-gray-500">ID: {password.id}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{password.value}</h3>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Pwned Count: {password.pwnedCount.toLocaleString()}
            </p>
            <p className="text-sm font-medium">
              Starting Price: ${password.startingPrice}
            </p>
            {password.sold && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Owned by: {password.owner}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Sold for: ${password.currentPrice}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}