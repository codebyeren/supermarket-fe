import React, { useEffect, useState } from 'react';
import { Modal, Table, message } from 'antd';
import { attachProductToPromotion, fetchPromotions, getPromotionById, updateProductPromotionIsActive } from '../../services/promotionService';
import { getAllProductsForAdmin } from '../../services/productService';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function AttachPromotionProductModal({ visible, onClose }: Props) {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [originalProductIds, setOriginalProductIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchPromotions().then(setPromotions);
            getAllProductsForAdmin().then(setProducts);
            setSelectedPromotionId(null);
            setSelectedProductIds([]);
            setOriginalProductIds([]);
        }
    }, [visible]);

    const handleSelectPromotion = async (promotionId: number) => {
        setSelectedPromotionId(promotionId);
        try {
            const res = await getPromotionById(promotionId);
            const productIds = res.products.map((p: any) => p.productId);
            setSelectedProductIds(productIds);
            setOriginalProductIds(productIds);
        } catch {
            message.error('Không thể load sản phẩm đã gán.');
            setSelectedProductIds([]);
            setOriginalProductIds([]);
        }
    };

    const handleAttach = async () => {
        if (!selectedPromotionId) {
            message.warning('Vui lòng chọn promotion trước!');
            return;
        }
        setLoading(true);
        try {
            const selected = new Set(selectedProductIds);
            const original = new Set(originalProductIds);
            const toCreate = selectedProductIds.filter(id => !original.has(id));
            const toDeactivate = originalProductIds.filter(id => !selected.has(id));
            for (const productId of toCreate) {
                await attachProductToPromotion(selectedPromotionId, productId);
            }
            for (const productId of toDeactivate) {
                await updateProductPromotionIsActive(selectedPromotionId, productId, false);
            }
            message.success('Cập nhật thành công!');
            onClose();
        } catch {
            message.error('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title="Gán promotion vào sản phẩm"
            onCancel={onClose}
            onOk={handleAttach}
            okButtonProps={{ disabled: !selectedPromotionId, loading }}
            width={1000}
        >
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h4>Promotion</h4>
                    <Table
                        dataSource={promotions}
                        rowKey="promotionId"
                        columns={[
                            {
                                title: 'Loại',
                                dataIndex: 'promotionType',
                                render: (value: string) =>
                                    value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
                            },
                            { title: 'Mô tả', dataIndex: 'description' },
                        ]}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: selectedPromotionId ? [selectedPromotionId] : [],
                            onChange: (selectedRowKeys) => handleSelectPromotion(selectedRowKeys[0] as number),
                        }}
                        pagination={false}
                        size="small"
                    />
                </div>

                <div style={{ flex: 2 }}>
                    <h4>Sản phẩm</h4>
                    <Table
                        dataSource={products}
                        rowKey="productId"
                        columns={[
                            {
                                title: 'Ảnh',
                                dataIndex: 'imageUrl',
                                render: (url: string) => (
                                    <img src={`/img/${url}`} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                                ),
                            },
                            { title: 'Tên sản phẩm', dataIndex: 'productName' },
                            {
                                title: 'Giá',
                                dataIndex: 'price',
                                render: (price: number) => `${price?.toLocaleString()} ₫`,
                            },
                        ]}
                        rowSelection={{
                            selectedRowKeys: selectedProductIds,
                            onChange: (keys) => setSelectedProductIds(keys as number[]),
                        }}
                        pagination={{ pageSize: 8 }}
                        size="small"
                    />
                </div>
            </div>
        </Modal>
    );
}
