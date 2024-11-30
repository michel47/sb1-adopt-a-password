import React, { useState } from 'react';
import { Password } from '../lib/types';

interface BidFormProps {
  selectedPassword: Password | null;
  onBid: (amount: number, bidder: string) => void;
}

export function BidForm({ selectedPassword, onBid }: BidFormProps) {
  const [amount, setAmount] = useState('');
  const [bidder, setBidder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedPassword) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && bidder && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onBid(Number(amount), bidder);
        setAmount('');
        setBidder('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Selected Password: {selectedPassword.value}</h3>
        <p className="text-gray-600">Starting Price: ${selectedPassword.startingPrice}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bidder" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="bidder"
            value={bidder}
            onChange={(e) => setBidder(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Bid Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={selectedPassword.startingPrice}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Bid'}
        </button>
      </form>
    </div>
  );
}