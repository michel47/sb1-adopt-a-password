import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Password } from './lib/types';
import { initialPasswords } from './lib/passwordData';
import { PasswordBoard } from './components/PasswordBoard';
import { BidForm } from './components/BidForm';
import { hashPassword, deriveKey, computeIndex } from './lib/crypto';

function App() {
  const [passwords, setPasswords] = useState<Password[]>(initialPasswords);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);

  const selectedPassword = passwords.find(p => p.id === selectedPasswordId);

  const handlePasswordSelect = (password: Password) => {
    setSelectedPasswordId(password.id);
  };

  const handleBid = async (amount: number, bidder: string) => {
    if (!selectedPassword) return;

    try {
      const hashedPassword = await hashPassword(selectedPassword.value, bidder);
      const key = await deriveKey(hashedPassword);
      const index = computeIndex(key);

      if (amount >= selectedPassword.reservePrice) {
        setPasswords(passwords.map(p => 
          p.id === selectedPassword.id
            ? { ...p, sold: true, owner: bidder, currentPrice: amount }
            : p
        ));
        
        console.log('Transaction recorded in ledger:', {
          index,
          passwordId: selectedPassword.id,
          owner: bidder,
          publicKey: key.substring(0, 16),
          timestamp: new Date().toISOString()
        });

        setSelectedPasswordId(null);
      } else {
        alert('Bid does not meet the reserve price. Try a higher amount!');
      }
    } catch (error) {
      console.error('Error processing bid:', error);
      alert('There was an error processing your bid. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Adopt a Password</h1>
          </div>
          <p className="mt-2 text-gray-600">Own a piece of internet history - Adopt the world's most compromised passwords!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PasswordBoard
              passwords={passwords}
              onSelect={handlePasswordSelect}
              selectedId={selectedPasswordId}
            />
          </div>
          <div>
            <BidForm
              selectedPassword={selectedPassword}
              onBid={handleBid}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;