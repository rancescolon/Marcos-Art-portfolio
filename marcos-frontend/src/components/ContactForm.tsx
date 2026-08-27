'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('Sending...');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('Message sent successfully.');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('Failed to send message.');
            }
        } catch (error) {
            setStatus('Network error. Please try again.');
        }
    };

    return (
        <section id="contact" className="py-20 px-6 w-full max-w-2xl md:max-w-4xl mx-auto border-t-2 border-black mt-20 scroll-mt-48">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 md:mb-12">Contact</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-10">
                <input
                    name="name"
                    type="text"
                    placeholder="NAME"
                    required
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="EMAIL"
                    required
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors"
                />
                <textarea
                    name="message"
                    placeholder="MESSAGE"
                    rows={4}
                    required
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors resize-none"
                ></textarea>
                <button
                    type="submit"
                    className="self-start mt-4 bg-black text-white px-10 md:px-14 py-3 md:py-5 uppercase text-sm md:text-xl font-black tracking-widest hover:text-accent transition-colors"
                >
                    Submit
                </button>
                {status && <p className="text-sm md:text-lg font-mono mt-4 font-bold">{status}</p>}
            </form>
        </section>
    );
}