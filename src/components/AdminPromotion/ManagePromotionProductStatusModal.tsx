import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, message } from 'antd';
import { fetchPromotions } from '../../services/promotionService';
import { getAllProductsForAdmin } from '../../services/productService';
import { updateProductPromotionIsActive } from '../../services/promotionService';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ManagePromotionProductStatusModal({ visible, onClose }: Props) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchPromotions().then(setPromotions);
      getAllProductsForAdmin().then(setProducts);
      setSelectedPromotionId(null);
    }
  }, [visible]);

  const handleToggleProductStatus = async (productId: number, isActive: boolean) => {
    if (!selectedPromotionId) return;
    try {
      await updateProductPromotionIsActive(selectedPromotionId, productId, isActive);
      message.success('Cập nhật trạng thái thành công');
    } catch {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <Modal
      open={visible}
      title="Quản lý trạng thái sản phẩm theo Promotion"
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4>Chọn Promotion</h4>
          <Table
            dataSource={promotions}
            rowKey="promotionId"
            columns={[
              {
                title: 'Loại',
                dataIndex: 'promotionType',
                render: (value: string) =>
                  value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              },
              { title: 'Mô tả', dataIndex: 'description' },
            ]}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedPromotionId ? [selectedPromotionId] : [],
              onChange: (selectedRowKeys) => setSelectedPromotionId(selectedRowKeys[0] as number),
            }}
            pagination={false}
            size="small"
          />
        </div>

        <div style={{ flex: 2 }}>
          <h4>Danh sách sản phẩm</h4>
          <Table
            dataSource={products}
            rowKey="productId"
            columns={[
              {
                title: 'Ảnh',
                dataIndex: 'imageUrl',
                render: (url: string) => (
                  <img
                    src={`/img/${url}`}
                    alt="product"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                  />
                ),
              },
              { title: 'Tên sản phẩm', dataIndex: 'productName' },
              {
                title: 'Giá',
                dataIndex: 'price',
                render: (price: number) => `${price?.toLocaleString()} ₫`,
              },
              {
                title: 'Kích hoạt',
                dataIndex: 'isActive',
                render: (isActive: boolean, record: any) => (
                  <Button
                    size="small"
                    type={isActive ? 'primary' : 'default'}
                    onClick={() => handleToggleProductStatus(record.productId, !isActive)}
                  >
                    {isActive ? 'Đang bật' : 'Tắt'}
                  </Button>
                ),
              },
            ]}
            pagination={{ pageSize: 8 }}
            size="small"
          />
        </div>
      </div>
    </Modal>
  );
}
