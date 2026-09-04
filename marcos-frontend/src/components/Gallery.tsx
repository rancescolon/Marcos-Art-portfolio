'use client';
import { useState } from 'react';
import { getAssetPath } from '@/utils/utils';

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const currentTouch = e.targetTouches[0].clientY;
        const diff = Math.abs(currentTouch - touchStart);

        // Close modal if user scrolls/swipes more than 40px on mobile
        if (diff > 40) {
            setSelectedImage(null);
            setTouchStart(null);
        }
    };

    const artworks = [
        {
            id: 1,
            title: "300 Brothers",
            year: "2026",
            imagePath: "/art/IMG_2676.jpeg",
            description: "Printed on Fabric\n Overall: 46 in x 48 in"
        },
        {
            id: 2,
            title: "Tempted 9 times",
            year: "2025",
            imagePath: "/art/IMG_2674.jpeg",
            description: "Acrylic and screenprint on canvas, nine parts\n Overall: 60 in x 48 in\n"
        },
        {
            id: 3,
            title: "Too Much Is The Point",
            year: "2026",
            imagePath: "/art/IMG_2677.jpeg",
            description: "Fabric, leather and string on canvas\n 43 in x 43 in"
        },
        {
            id: 4,
            title: "THE RUNNER",
            year: "2025",
            imagePath: "/art/IMG_2680.jpeg",
            description: "Fabric and string on canvas\n 20 in x 20 in"
        },
        {
            id: 5,
            title: "WATCH ME FLY",
            year: "2026",
            imagePath: "/art/IMG_2682.jpeg",
            description: "Fabric and string on canvas\n 20 in x 20 in"
        },
        {
            id: 6,
            title: "BORN HERE",
            year: "2026",
            imagePath: "/art/IMG_2678.jpeg",
            description: "Acrylic and screenprint on canvas, four parts\n Overall: 40 in x 32 in"
        },
        {
            id: 7,
            title: "The fighter",
            year: "2026",
            imagePath: "/art/IMG_2669.jpeg",
            description: "Acrylic and Oil pastel on canvas \n 30 in X 24 in"
        },
    ];

    return (
        <section id="gallery" className="py-20 px-6 max-w-[90rem] mx-auto scroll-mt-48">
            <div className="flex flex-col gap-24">
                {artworks.map((art) => (
                    <div key={art.id} className="flex flex-col">
                        {/* Scaled-down clickable image container */}
                        <div
                            className="w-full h-[55vh] md:h-[70vh] flex items-center justify-center bg-neutral-50 cursor-pointer group relative overflow-hidden border border-black/10"
                            onClick={() => setSelectedImage({ src: getAssetPath(art.imagePath), title: art.title })}
                        >
                            <img
                                src={getAssetPath(art.imagePath)}
                                alt={art.title}
                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-poetsen uppercase text-2xl tracking-tighter">{art.title}</h3>
                                <p className="text-base text-gray-700 max-w-2xl whitespace-pre-line">{art.description}</p>
                            </div>
                            <span className="font-poetsen font-normal text-lg text-gray-500 self-start md:self-center">{art.year}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto cursor-zoom-out"
                    onWheel={() => setSelectedImage(null)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-7xl w-full my-auto flex items-center justify-center"
                    >
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="max-h-[90vh] max-w-full object-contain shadow-2xl cursor-pointer"
                            onClick={() => setSelectedImage(null)}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}