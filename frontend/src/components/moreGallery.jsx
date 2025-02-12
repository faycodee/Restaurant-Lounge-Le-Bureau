import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RestaurantGallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredImages, setFilteredImages] = useState([]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'starters', label: 'Starters' },
    { id: 'main', label: 'Main Course' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Drinks' }
  ];

  const galleryItems = [
    {
      id: 1,
      src: '/api/placeholder/800/600',
      title: 'Mediterranean Salad',
      category: 'starters',
      description: 'Fresh vegetables with olive oil and feta cheese'
    },
    {
      id: 2,
      src: '/api/placeholder/800/600',
      title: 'Grilled Salmon',
      category: 'main',
      description: 'Atlantic salmon with herbs and lemon'
    },
    {
      id: 3,
      src: '/api/placeholder/800/600',
      title: 'Tiramisu',
      category: 'desserts',
      description: 'Classic Italian dessert with coffee and mascarpone'
    },
    {
      id: 4,
      src: '/api/placeholder/800/600',
      title: 'Craft Cocktail',
      category: 'drinks',
      description: 'House special with premium spirits'
    },
    {
      id: 5,
      src: '/api/placeholder/800/600',
      title: 'Bruschetta',
      category: 'starters',
      description: 'Toasted bread with tomatoes and basil'
    },
    {
      id: 6,
      src: '/api/placeholder/800/600',
      title: 'Beef Tenderloin',
      category: 'main',
      description: 'Prime cut with red wine reduction'
    }
  ];

  useEffect(() => {
    setFilteredImages(
      activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl text-white mb-4 tracking-wide"
            style={{ fontFamily: 'Didot, serif' }}
          >
            Our Culinary Gallery
          </h2>
          <p 
            className="text-gray-400 text-lg"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Explore our signature dishes and creations
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm tracking-wider transition-all duration-300
                ${activeCategory === category.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              style={{ fontFamily: 'Didot, serif' }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 3D Swiper Gallery */}
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[EffectCoverflow, Navigation, Pagination]}
          className="w-full"
        >
          {filteredImages.map((item) => (
            <SwiperSlide
              key={item.id}
              className="w-full max-w-[500px] rounded-xl overflow-hidden"
            >
              <div className="group relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 
                      className="text-2xl mb-2 tracking-wide"
                      style={{ fontFamily: 'Didot, serif' }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-gray-200"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RestaurantGallery;