import { getAssetPath } from '@/utils/utils';

export default function Gallery() {
    const artworks = [
        { id: 1, title: "Untitled I", year: "2024", imagePath: "/art/piece1.jpg" },
        { id: 2, title: "Untitled II", year: "2024", imagePath: "/art/piece2.jpg" },
    ];

    return (
        <section id="gallery" className="py-20 px-6 max-w-[90rem] mx-auto scroll-mt-48">
            <div className="flex flex-col gap-24">
                {artworks.map((art) => (
                    <div key={art.id} className="flex flex-col">
                        <div className="w-full flex items-center justify-center bg-neutral-50">
                            <img
                                src={getAssetPath(art.imagePath)}
                                alt={art.title}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-4">
                            <h3 className="font-black uppercase text-2xl tracking-tighter">{art.title}</h3>
                            <span className="text-lg font-bold text-gray-500">{art.year}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}