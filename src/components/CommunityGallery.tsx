import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'awareness' | 'support' | 'celebration' | 'connection';
  description: string;
}

const galleryImages: GalleryImage[] = [
  // Event Images
  {
    id: '1',
    src: '/images/events/Vana 1.jpg',
    alt: 'Fortitude Network Community Event',
    category: 'celebration',
    description: 'Community members coming together at our awareness event'
  },
  {
    id: '2',
    src: '/images/events/Vana 2.jpg',
    alt: 'Community Support Gathering',
    category: 'support',
    description: 'Building connections and sharing support within our community'
  },
  {
    id: '3',
    src: '/images/events/Vana 3.jpeg',
    alt: 'Awareness Campaign Event',
    category: 'awareness',
    description: 'Spreading awareness and hope throughout the community'
  },
  {
    id: '4',
    src: '/images/events/Vana 4.jpeg',
    alt: 'Community Unity Event',
    category: 'connection',
    description: 'Connecting individuals and families affected by cancer'
  },
  {
    id: '5',
    src: '/images/events/Vana 5.jpg',
    alt: 'Celebration of Survivors',
    category: 'celebration',
    description: 'Honoring survivors and celebrating their strength'
  },
  {
    id: '6',
    src: '/images/events/Vana 6.jpg',
    alt: 'Support Network Meeting',
    category: 'support',
    description: 'Creating lasting support networks within our community'
  },
  {
    id: '7',
    src: '/images/events/Vana 7.jpg',
    alt: 'Community Outreach Program',
    category: 'awareness',
    description: 'Reaching out to expand our supportive community'
  },
  // Vanshika Images
  {
    id: '8',
    src: '/images/vanshika/vanshika_1.jpeg',
    alt: 'Vanshika Rao - Founder Vision',
    category: 'connection',
    description: 'Our founder Vanshika sharing her vision for community support'
  },
  {
    id: '9',
    src: '/images/vanshika/vanshika_2.jpeg',
    alt: 'Leadership in Action',
    category: 'support',
    description: 'Leading by example in community building and support'
  },
  {
    id: '10',
    src: '/images/vanshika/vanshika_3.jpeg',
    alt: 'Community Engagement',
    category: 'awareness',
    description: 'Engaging with community members and spreading awareness'
  },
  {
    id: '11',
    src: '/images/vanshika/vanshika_4.jpeg',
    alt: 'Inspiring Hope',
    category: 'celebration',
    description: 'Inspiring hope and resilience in the cancer community'
  },
  {
    id: '12',
    src: '/images/vanshika/vanshika_5.jpeg',
    alt: 'Building Connections',
    category: 'connection',
    description: 'Creating meaningful connections within our network'
  },
  {
    id: '13',
    src: '/images/vanshika/vanshika_6.jpeg',
    alt: 'Advocacy in Action',
    category: 'support',
    description: 'Advocating for better support systems for cancer patients'
  },
  {
    id: '14',
    src: '/images/vanshika/vanshika_7.jpeg',
    alt: 'Community Leadership',
    category: 'awareness',
    description: 'Leading community initiatives for cancer awareness and support'
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

        {/* Image Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredImages.map((image) => (
                <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div
                    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => openModal(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/images/events/Vana 1.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-sm font-medium">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
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