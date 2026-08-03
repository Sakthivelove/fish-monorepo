// frontend/src/app/order/page.tsx

import React from 'react';
import { Metadata } from 'next';
import CreateOrderForm from '@/components/CreateOrderForm';

export const metadata: Metadata = {
  title: "புதிய ஆர்டரை இடவும் | எமனேரி மீனவன்",
  description: "புதிய மீன் வகைகளை ஆர்டர் செய்வதற்கான படிவத்தைப் பூர்த்தி செய்யவும்.",
};

export default function OrderPage() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="text-center py-8 bg-blue-100 rounded-lg shadow-sm mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800">
          ஆர்டர் படிவம்
        </h1>
        <p className="text-lg mt-2 text-gray-600">
          உங்கள் ஆர்டரைச் சமர்ப்பிக்கக் கீழே உள்ள படிவத்தைப் பூர்த்தி செய்யவும்.
        </p>
      </header>

      {/* CreateOrderForm ஐ இங்கே மட்டும் காட்டுங்கள் */}
      <section className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-gray-200">
        <CreateOrderForm />
      </section>
    </main>
  );
}