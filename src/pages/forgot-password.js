import React, { useState } from 'react';
import Link from 'next/link';
import { Pickaxe, Phone, ArrowLeft, Send } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Please contact Admin Support via Telegram/Support Ticket to reset your password.');
  };

  return (
    <MobileWrapper>
      <div className="flex-1 flex flex-col justify-center p-6 bg-darkBg relative overflow-hidden">
        <Link href="/login" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1 text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center mb-8 mt-12">
          <div className="w-16 h-16 rounded-2xl bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center mx-auto mb-3 text-goldPrimary shadow-lg">
            <Pickaxe className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-gray-400 mt-1">Enter mobile number to request password reset</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Registered Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {message && (
            <div className="bg-goldPrimary/10 border border-goldPrimary/30 text-goldPrimary text-xs font-semibold p-3 rounded-xl text-center">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-goldPrimary/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" /> Request Password Reset
          </button>
        </form>
      </div>
    </MobileWrapper>
  );
}