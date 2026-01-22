import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const displayImages = images.length > 0 ? images : ['/placeholder.svg'];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          className="aspect-[4/3] md:aspect-square cursor-pointer overflow-hidden rounded-lg"
          onClick={() => {
            setSelectedIndex(0);
            setIsOpen(true);
          }}
        >
          <img
            src={displayImages[0]}
            alt={`${title} - Image 1`}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {displayImages.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {displayImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg relative"
                onClick={() => {
                  setSelectedIndex(index + 1);
                  setIsOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`${title} - Image ${index + 2}`}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {index === 3 && displayImages.length > 5 && (
                  <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                    <span className="text-card text-lg font-semibold">
                      +{displayImages.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-foreground/95">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-card hover:bg-card/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative aspect-video">
              <img
                src={displayImages[selectedIndex]}
                alt={`${title} - Image ${selectedIndex + 1}`}
                className="h-full w-full object-contain"
              />

              {displayImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-card hover:bg-card/20"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-card hover:bg-card/20"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            <div className="p-4 text-center text-card text-sm">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
