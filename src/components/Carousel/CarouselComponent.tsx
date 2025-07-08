import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductCard from '../../components/Card/productCard';
import type { Product } from '../../types/index';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1
  }
};

const CarouselComponent = ({
  title,
  products,
  itemsPerView = { desktop: 4, tablet: 2, mobile: 1 }  ,
   onAddToCartSuccess,
   onAddToCartFail,
}: {
  title: string;
  products: Product[];
  itemsPerView?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
     onAddToCartSuccess?: () => void;
     onAddToCartFail? : () => void;
}) => {
  return (
    <section className="mb-5">
      <h4 className="mb-3 text-start">{title}</h4>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={3000}
        arrows={true}
        showDots={false}
        draggable={true}
        pauseOnHover
        
      >
        {products.map((product) => (
          <div key={product.productId} className="px-2">
            <ProductCard product={product} onAddToCartSuccess={onAddToCartSuccess} onAddToCartFail={onAddToCartFail}/>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default CarouselComponent;
