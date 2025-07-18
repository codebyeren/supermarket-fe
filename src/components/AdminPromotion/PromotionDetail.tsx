import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spin } from 'antd';
import type { Promotion } from '../../pages/Admin/Promotions';
import { getPromotionById } from '../../services/promotionService';
import ProductCard from '../Card/productCard';


interface Props {
    visible: boolean;
    onClose: () => void;
    promotionId: number | null;
}

export default function PromotionDetailPopup({ visible, onClose, promotionId }: Props) {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (promotionId) {
            setLoading(true);
            getPromotionById(promotionId)
                .then(res => setPromotion(res))
                .finally(() => setLoading(false));
        } else {
            setPromotion(null);
        }
    }, [promotionId]);

    const columns = [
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => `${price.toLocaleString()} ₫` },
        { title: 'Thương hiệu', dataIndex: 'brand', key: 'brand' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    ];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={<Button onClick={onClose}>Đóng</Button>}
            title={`Chi tiết khuyến mãi`}
            width={800}
        >
            {loading ? (
                <Spin />
            ) : promotion ? (
                <>
                    <div>
                        <p><b>Mô tả:</b> {promotion.description}</p>
                        <p><b>Thời gian:</b> {new Date(promotion.startDate).toLocaleString()} - {new Date(promotion.endDate).toLocaleString()}</p>
                        <p><b>Loại giảm:</b> {promotion.discountPercent ? `${promotion.discountPercent}%` : promotion.discountAmount ? `${promotion.discountAmount.toLocaleString()} ₫` : 'Không'}</p>
                        <p><b>Quà tặng:</b> {promotion.giftProductName || 'Không có'}</p>
                        <p><b>Giá trị tối thiểu đơn hàng:</b> {promotion.minOrderValue ? `${promotion.minOrderValue.toLocaleString()} ₫` : 'Không'}</p>
                        <p><b>Số lượng tối thiểu:</b> {promotion.minOrderQuantity || 'Không'}</p>
                        <p><b>Trạng thái:</b> {promotion.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                    </div>
                    {promotion?.products?.length > 0 ? (

                        <div className="product-list">
                            <h5>Áp dụng với:</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '20px 0' }}>
                                {promotion.products.map(product => (
                                    <ProductCard key={product.productId} product={product} hideAddToCartButton />
                                ))}
                            </div>
                        </div>

                    ) : (
                        <p>Chưa được áp dụng</p>
                    )}

                </>
            ) : (
                <p>Không tìm thấy dữ liệu</p>
            )}
        </Modal>
    );
}
