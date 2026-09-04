'use client';
import { useState, useRef } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Guard against double-submits (e.g. double-click, slow network + repeat tap)
        if (isSubmitting) return;

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Honeypot: real users never see or fill this field. If it's
        // populated, it's almost certainly a bot — quietly no-op instead
        // of hitting the API at all, saving your email quota.
        if (typeof data.website === 'string' && data.website.trim() !== '') {
            setStatus('Message sent successfully.');
            formRef.current?.reset();
            return;
        }

        setIsSubmitting(true);
        setStatus('Sending...');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('Message sent successfully.');
                formRef.current?.reset();
            } else if (response.status === 429) {
                setStatus('Too many messages sent. Please try again later.');
            } else {
                const text = await response.text().catch(() => '');
                setStatus(text || 'Failed to send message.');
            }
        } catch (error) {
            setStatus('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 px-6 w-full max-w-2xl md:max-w-4xl mx-auto border-t-2 border-black mt-20 scroll-mt-48">
            <h2 className="font-poetsen text-3xl md:text-5xl uppercase tracking-tight mb-8 md:mb-12">Contact</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-10">
                {/* Honeypot field — hidden from real users, catches bots that
                    auto-fill every input. Name must match the backend DTO. */}
                <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <input
                    name="name"
                    type="text"
                    placeholder="NAME"
                    required
                    maxLength={100}
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="EMAIL"
                    required
                    maxLength={254}
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors"
                />
                <textarea
                    name="message"
                    placeholder="MESSAGE"
                    rows={4}
                    required
                    maxLength={5000}
                    className="w-full border-b border-black md:border-b-2 py-3 md:py-5 px-2 outline-none uppercase text-sm md:text-xl font-bold tracking-widest placeholder-gray-400 focus:bg-gray-50 transition-colors resize-none"
                ></textarea>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-start mt-4 bg-black text-white px-10 md:px-14 py-3 md:py-5 uppercase text-sm md:text-xl font-poetsen font-normal tracking-widest hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
                {status && <p className="text-sm md:text-lg font-mono mt-4 font-bold">{status}</p>}
            </form>
        </section>
    );
}