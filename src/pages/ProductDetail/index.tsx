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
import { useCartStore } from '../../stores/cartStore';
import Notification from '../../components/Notification';
import { FaHeart } from 'react-icons/fa';
import { deleteFavorite, toggleFavorite } from '../../services/favoriteService';
import { useAuthStore } from '../../stores/authStore';
import CompareTwoProductsView from '../../components/Compare/CompareTwoProductsView';
import './index.css'

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
    const [showNotification, setShowNotification] = useState(false);
    const [success, setSuccess] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedCompareProduct, setSelectedCompareProduct] = useState<Product | null>(null);


    const { isAuthenticated } = useAuthStore();

    const addToCart = useCartStore(state => state.addToCart);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || !product) return;

        try {
            if (isFavorite) {
                await deleteFavorite(product.productId);
                setIsFavorite(false);
            } else {
                await toggleFavorite(product.productId);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Toggle favorite failed', err);
        }
    };

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
                setIsFavorite(data.productDto.isFavorite)
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

    if (loading) return <div className="container py-4">Loading product...</div>;
    if (!product) return <div className="container py-4">Product not found.</div>;

    return (
        <div className="container py-4">
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
                    <h4 className="fw-bold text-start d-flex align-items-center gap-2 mb-1">
                        <span
                            className="badge px-2 py-1 text-white"
                            style={{
                                backgroundColor:
                                    product.status === 'Hot Deal'
                                        ? '#e53935'
                                        : product.status === 'Best Seller'
                                            ? '#fb8c00'
                                            : product.status === 'New Arrival'
                                                ? '#43a047'
                                                : '#6c757d',
                                fontSize: 12,
                                borderRadius: 4,
                                textTransform: 'uppercase',
                            }}
                        >
                            {product.status}
                        </span>
                        <span style={{ fontSize: '1.1rem' }}>{product.productName}</span>
                        <button
                            onClick={handleToggleFavorite}
                            className="btn btn-link p-0 ms-2"
                            style={{ color: 'red', fontSize: '1.2rem' }}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <FaHeart color={isFavorite ? 'red' : 'gray'} />
                        </button>
                    </h4>

                    <PromotionDescription product={product} />
                    <p className="text-muted small mb-1 text-start">Brand: {product.brand}</p>

                    <div className="d-flex align-items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(product.ratingScore) ? 'text-warning' : 'text-secondary'}>
                                ★
                            </span>
                        ))}
                        <span className="ms-2 text-muted small">{product.ratingScore.toFixed(1)}</span>
                    </div>

                    <div className="d-flex align-items-baseline gap-2">
                        <div className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                            {formatCurrency(product.price * (1 - (product.discountPercent ?? 0) / 100))}
                        </div>
                        {product.discountPercent && (
                            <div className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>
                                {formatCurrency(product.price)}
                            </div>
                        )}
                    </div>

                    <div className="row g-2">
                        <div className="col-6">
                            <button
                                className="btn btn-outline-primary btn-sm w-100"
                                onClick={() => setShowCompareModal(true)}
                            >
                                Compare products
                            </button>
                        </div>
                    </div>

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

                    <button
                        style={{
                            backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: '#fff',
                            border: 'none',
                        }}
                        className="btn btn-success btn-sm w-100 p-2 mt-2"
                        onClick={() => {
                            try {
                                if (!product) return;
                                addToCart({
                                    productId: product.productId,
                                    productName: product.productName,
                                    price: product.price,
                                    slug: product.slug,
                                    status: product.status,
                                    brand: product.brand,
                                    imageUrl: product.imageUrl,
                                    stock: product.quantity,
                                    quantity: 1,
                                    promotionType: product.promotionType,
                                    discountPercent: product.discountPercent,
                                    discountAmount: product.discountAmount,
                                    giftProductId: product.giftProductId,
                                    minOrderValue: product.minOrderValue,
                                    minOrderQuantity: product.minOrderQuantity,
                                    startDate: product.startDate,
                                    endDate: product.endDate,
                                });
                                setSuccess(true);
                                setShowNotification(true);
                            } catch (error) {
                                console.error("Add to cart error", error);
                                setSuccess(false);
                                setShowNotification(true);
                            }
                        }}
                    >
                        + Add to cart
                    </button>
                </div>
            </div>

            <CarouselComponent
                title="Related Products"
                products={relatedProducts}
                itemsPerView={{ desktop: 5, tablet: 3, mobile: 2 }}
                onAddToCartSuccess={() => {
                    setSuccess(true);
                    setShowNotification(true);
                }}
                onAddToCartFail={() => {
                    setSuccess(false);
                    setShowNotification(true);
                }}
            />

            <ProductRatings
                ratings={ratings}
                ratingScore={product.ratingScore}
                onWriteRating={() => {
                    hasUserRated ? setShowRatingEditModal(true) : setShowRatingModal(true);
                }}
            />

            {showCompareModal && (
                <ComparePopup
                    show={showCompareModal}
                    onClose={() => setShowCompareModal(false)}
                    products={compareProducts}
                    onCompare={(p) => {
                        setSelectedCompareProduct(p);
                        setShowCompareModal(false);
                    }}
                />
            )}

            {selectedCompareProduct && product && (
                <CompareTwoProductsView
                    productA={product}
                    productB={selectedCompareProduct}
                    onClose={() => setSelectedCompareProduct(null)}
                />
            )}

            {showNotification && (
                <Notification
                    message={success ? 'Added to cart successfully' : 'Failed to add to cart'}
                    duration={2000}
                    borderColor={success ? 'green' : 'red'}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    );
};

export default ProductDetail;















































