import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product, Rating } from '../../types';
import ProductCard from '../../components/Card/productCard';
import { fetchProductsByCategory, getProductBySlug } from '../../services/productService';
import PromotionDescription from '../../components/Promotion/PromotionDescription';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import RatingModal from '../../components/Rating/addProductRating';
import RatingEditModal from '../../components/Rating/editProductRating';
import { jwtDecode } from 'jwt-decode';
import ProductRatings from '../../components/Rating/listProductRatings';
import CompareTable from '../../components/Compare/CompareTable';
import ComparePopup from '../../components/Compare/CompareTable';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showRatingEditModal, setShowRatingEditModal] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasUserRated, setHasUserRated] = useState(false);
    const [userRatingId, setUserRatingId] = useState<number | null>(null);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [compareProducts, setCompareProducts] = useState<Product[]>([]);


    useEffect(() => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        const loadProduct = async () => {
            try {
                if (!slug) return;

                const data = await getProductBySlug(slug);
                setProduct(data.productDto);
                setRelatedProducts(data.relatedProducts);
                setRatings(data.ratings);
                const mainCategorySlug = data.categories?.[0]?.slug;


                const decoded = jwtDecode<{ userId?: string; id?: string }>(token);
                const userId = decoded?.userId || decoded?.id;
                if (mainCategorySlug) {
                    const allInCategory = await fetchProductsByCategory(mainCategorySlug);

                    const productsInCategory = Object.values(allInCategory).flat();

                    const filtered = productsInCategory.filter(
                        (p) => p.productId !== data.productDto.productId


                    );
                    setCompareProducts(filtered);


                }

                const userRating = data.ratings.find(
                    (r) => String(r.customerId) === String(userId)
                );

                if (userRating) {
                    setHasUserRated(true);
                    setUserRatingId(userRating.ratingId);
                } else {
                    setHasUserRated(false);
                    setUserRatingId(null);
                }
            } catch (err) {
                console.error('❌ Lỗi khi tải sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug]);
    const formatCurrency = (value: number, currency: string = 'USD') =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    if (loading) return <div className="container py-4">Đang tải sản phẩm...</div>;
    if (!product) return <div className="container py-4">Sản phẩm không tồn tại.</div>;

    return (
        <div className="container py-4">
            {/* Chi tiết sản phẩm */}
            <div className="row mb-5">
                <div className="col-md-5 text-center">
                    <img
                        src={`/img/${product.imageUrl}`}
                        alt={product.productName}
                        className="img-fluid border rounded"
                        style={{ maxHeight: 600, objectFit: 'contain', width: '20vw' }}
                    />
                </div>

                <div className="col-md-7">
                    <h4 className="fw-bold text-start">{product.productName}</h4>
                    <PromotionDescription product={product} />
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
                        <h5 className="text-danger mb-0">{product.price - (product.discountAmount ?? 0)} ₫</h5>
                        {product.discountAmount != null && product.discountAmount > 0 && (
                            <small className="text-muted text-decoration-line-through">
                                {product.price} ₫
                            </small>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold">Tồn kho: {product.quantity}</span>
                    </div>
                    <button
                        className="btn btn-outline-secondary btn-sm mt-2 w-100"
                        onClick={() => setShowCompareModal(true)}
                    >
                        So sánh sản phẩm cùng danh mục
                    </button>


                    {localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') ? (
                        <button
                            onClick={() => {
                                if (hasUserRated) {
                                    setShowRatingEditModal(true);
                                } else {
                                    setShowRatingModal(true);
                                }
                            }}
                            className="btn btn-outline-primary btn-sm mt-3"
                        >
                            Gửi đánh giá sản phẩm
                        </button>
                    ) : null}

                    {showRatingModal && (
                        <RatingModal
                            productId={product.productId}
                            onClose={() => setShowRatingModal(false)}
                            onSuccess={async () => {
                                const data = await getProductBySlug(slug!);
                                setRatings(data.ratings);
                                setProduct(data.productDto);
                            }}
                        />
                    )}
                    {showRatingEditModal && userRatingId && (
                        <RatingEditModal
                            ratingId={userRatingId}
                            onClose={() => setShowRatingEditModal(false)}
                            onSuccess={async () => {
                                const data = await getProductBySlug(slug!);
                                setRatings(data.ratings);
                                setProduct(data.productDto);
                            }}
                        />
                    )}

                    <button className="btn btn-success btn-sm w-100 p-2 mt-2">+ Add to cart</button>
                </div>
            </div>

            {/* Sản phẩm liên quan */}
            {relatedProducts.length > 0 && (
                <CarouselComponent title="Sản Phẩm Liên Quan" products={relatedProducts} itemsPerView={{ desktop: 5, tablet: 3, mobile: 2 }} />
            )}

            {ratings.length > 0 && <ProductRatings ratings={ratings} ratingScore={product.ratingScore} />}
            {showCompareModal && (
                <ComparePopup
                    show={showCompareModal}
                    onClose={() => setShowCompareModal(false)}
                    products={compareProducts}
                />
            )}


        </div>
    );
};

export default ProductDetail;
