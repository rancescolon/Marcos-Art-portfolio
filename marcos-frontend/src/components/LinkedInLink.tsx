import { getAssetPath } from '@/utils/utils';

export default function LinkedInLink() {
    return (
        <div className="mt-20 mb-8 flex justify-center w-full">
            <a
                href="https://www.linkedin.com/in/marcos-villa-marin-719289293/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group cursor-pointer"
            >
                <div className="relative w-8 h-8 group-hover:opacity-70 transition-opacity flex items-center justify-center">
                    <img
                        src={getAssetPath('/LinkedIn_icon.svg.webp')}
                        alt="LinkedIn Icon"
                        className="w-full h-full object-contain"
                    />
                </div>
                <span className="font-black uppercase tracking-widest text-lg group-hover:text-accent transition-colors">
          Connect on LinkedIn
        </span>
            </a>
        </div>
    );
}