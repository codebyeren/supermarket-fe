import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types';
import ProductCard from '../../components/Card/productCard';
import { getProductBySlug } from '../../services/productService';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                if (!slug) return;

                const data = await getProductBySlug(slug);
                setProduct(data.productDto);
                setRelatedProducts(data.relatedProducts);
            } catch (err) {
                console.error('❌ Lỗi khi tải sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug]);

    if (loading) return <div className="container py-4">Đang tải sản phẩm...</div>;
    if (!product) return <div className="container py-4">Sản phẩm không tồn tại.</div>;

    return (
        <div className="container py-4">
            {/* Chi tiết sản phẩm */}
            <div className="row mb-5">
                <div className="col-md-5 text-center">
                    <img
                        src="/samsung.jpg"
                        alt={product.productName}
                        className="img-fluid border rounded"
                        style={{ maxHeight: 600, objectFit: 'contain',width: '20vw' }}
                    />
                </div>

                <div className="col-md-7">
                    <h4 className="fw-bold text-start">{product.productName}</h4>
                    <p className="text-muted small mb-1 text-start">Thương hiệu: {product.brand}</p>

                    <div className="d-flex align-items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(product.ratingScore) ? 'text-warning' : 'text-secondary'}>
                                ★
                            </span>
                        ))}
                        <span className="ms-2 text-muted small">{product.ratingScore.toFixed(1)}</span>
                    </div>

                    <div className="mb-3 text-start">
                        <h5 className="text-danger mb-0">
                            {product.price - (product.discountAmount ?? 0)} ₫
                        </h5>
                        {product.discountAmount != null && product.discountAmount > 0 && (
                            <small className="text-muted text-decoration-line-through">
                                {product.price} ₫
                            </small>
                        )}
                    </div>

                    <p className="text-muted text-start mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
                    </p>

                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold">Tồn kho: {product.quantity}</span>
                        <button className="btn btn-success btn-sm">+ Add to cart</button>
                    </div>
                </div>
            </div>

            {/* Sản phẩm liên quan */}
            {relatedProducts.length > 0 && (
                <>
                    <h5 className="mb-3 mt-5 text-start">Sản Phẩm Liên Quan</h5>
                    <div className="row row-cols-2 row-cols-md-5 g-3">
                        {relatedProducts.slice(0, 5).map((item) => (
                            <div className="col" key={item.productId}>
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                </>     
            )}
        </div>
    );
};

export default ProductDetail;
