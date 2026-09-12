export default function About() {
    return (
        <main className="py-24 px-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-16 md:gap-20">
                {/* Bio */}
                <div className="space-y-6 text-lg md:text-xl leading-relaxed tracking-tight text-gray-900 max-w-[65ch]">
                    <p>
                        Marcos Villa Marin is an architecture and art graduate from
                        Connecticut College, working at the intersection of spatial
                        design, materiality, and technical drafting.
                    </p>
                    <p>
                        His experience spans architectural detailing and Revit
                        production work at PJC Architecture, alongside on-site
                        construction work with Quadrant Consultants Development —
                        a combination of design-side and build-side perspective that
                        shapes how he approaches a project.
                    </p>
                    <p>
                        More recently, his focus has shifted toward sustainable
                        building systems and landscape architecture, using tools like
                        Revit, Adobe Illustrator, and Photoshop to move ideas from
                        concept sketch to buildable detail.
                    </p>
                </div>

                {/* Credentials */}
                <div className="space-y-12 md:border-l-2 md:border-gray-300 md:pl-14 pt-4 border-t md:border-t-0 md:pt-0">
                    <div>
                        <h3 className="font-poetsen text-base tracking-tight text-accent mb-4">
                            Education
                        </h3>
                        <p className="font-bold text-2xl leading-snug">
                            Connecticut College
                        </p>
                        <p className="text-gray-500 text-base mb-2">New London, CT</p>
                        <p className="text-gray-700 text-lg">
                            B.A., Architectural Studies &amp; Art
                        </p>
                    </div>

                    <div>
                        <h3 className="font-poetsen text-base tracking-tight text-accent mb-4">
                            Skills &amp; Languages
                        </h3>
                        <ul className="space-y-1.5 text-lg text-gray-700">
                            <li>Revit</li>
                            <li>Adobe Illustrator</li>
                            <li>Adobe Photoshop</li>
                        </ul>
                        <ul className="space-y-1.5 text-lg text-gray-700 mt-4">
                            <li>Spanish (intermediate)</li>
                            <li>German (beginner)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}