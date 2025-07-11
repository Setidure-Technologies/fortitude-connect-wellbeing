import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'awareness' | 'support' | 'celebration' | 'connection';
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/lovable-uploads/7f7e6e3e-fffc-4705-baae-60d0e4aa1b34.jpeg',
    alt: 'Cancer Awareness Rally - Join the Fight',
    category: 'awareness',
    description: 'Community members gathering to raise awareness and support cancer patients'
  },
  {
    id: '2', 
    src: '/lovable-uploads/2ae2a92f-5b0c-409c-a23a-9bc9b0dc3e92.jpeg',
    alt: 'Hands Holding in Support',
    category: 'connection',
    description: 'The power of human connection in cancer support'
  },
  {
    id: '3',
    src: '/lovable-uploads/b48b7b3e-3bd2-451c-8c88-1825c1c69fcf.jpeg', 
    alt: 'Survivors Celebration at Sunset',
    category: 'celebration',
    description: 'Cancer survivors celebrating life and community together'
  },
  {
    id: '4',
    src: '/lovable-uploads/2bbaacdb-8fcb-4e52-a1c8-ad95bb2c7f36.jpeg',
    alt: 'Community Unity - Paper Figures Holding Hands',
    category: 'support',
    description: 'Representing the unity and support within our community'
  },
  {
    id: '5',
    src: '/lovable-uploads/60bc3b03-82ea-4157-a7c4-ee3abfebd95e.jpeg',
    alt: 'One Step at a Time Campaign',
    category: 'awareness',
    description: 'Our community campaign encouraging cancer patients to take it one step at a time'
  },
  {
    id: '6',
    src: '/lovable-uploads/2e45fdc8-7b96-42f8-b96a-ef0c2eeff3c8.jpeg',
    alt: 'Celebration of Life and Support',
    category: 'celebration',
    description: 'Community members celebrating milestones and showing support'
  }
];

const CommunityGallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'support', label: 'Support' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'connection', label: 'Connection' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Our Community in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            See the real faces and moments that make Fortitude Network a true community. 
            From awareness campaigns to celebration milestones, we're here for each other every step of the way.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="transition-all duration-200"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => openModal(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.alt}</h3>
                <p className="text-gray-200">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityGallery;