export default function About() {
    return (
        <main className="py-24 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
            <div className="max-w-3xl space-y-8 text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-gray-900">
                <p>[Paragraph 1: Insert your introduction...]</p>
                <p>[Paragraph 2: Detail your foundational experience...]</p>
                <p>[Paragraph 3: Discuss your recent focus...]</p>
            </div>

            <div className="mt-20 flex flex-wrap justify-center gap-12 border-t-2 border-black pt-12 w-full max-w-2xl text-left">
                <div>
                    <h3 className="font-black uppercase tracking-tighter text-2xl mb-2">Education</h3>
                    <p className="font-bold text-lg">[Institution Name]</p>
                    <p className="text-gray-600">[Degree / Major]</p>
                </div>
                <div>
                    <h3 className="font-black uppercase tracking-tighter text-2xl mb-2">Certifications</h3>
                    <p className="font-bold text-lg">[Organization Name]</p>
                    <p className="text-gray-600">[Certification Title]</p>
                </div>
            </div>
        </main>
    );
}