import React, { useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { getUserInfo, updateUserAddress } from '../../services/user';
import type { CustomerAddress } from '../../types';
import styles from './Checkout.module.css';
import { LoadingService } from '../../services/LoadingService';

const { Option } = Select;

interface ShippingInfoProps {
  onNext: (address: CustomerAddress) => void;
  onCancel: () => void;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({ onNext, onCancel }) => {
  const [form] = Form.useForm();
  const loadingService = LoadingService.getInstance();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      loadingService.showLoading();
      const userInfo = await getUserInfo();
      const fullName = `${userInfo.firstName} ${userInfo.middleName ? userInfo.middleName + ' ' : ''}${userInfo.lastName}`;
      form.setFieldsValue({
        fullName: fullName,
        street: userInfo.street || '',
        city: userInfo.city || '',
        state: userInfo.state || '',
        country: userInfo.country || '',
        homePhone: userInfo.homePhone || '',
        mobilePhone: userInfo.mobile || '',
      });
      loadingService.hideLoading();
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      loadingService.hideLoading();
    }
  };

  const handleFinish = async (values: any) => {
    try {
      loadingService.showLoading();
      
      // Cập nhật thông tin địa chỉ nếu cần
      await updateUserAddress({
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        homePhone: values.homePhone,
        mobilePhone: values.mobilePhone,
      });
      
      const shippingInfo: CustomerAddress = {
        fullName: values.fullName,
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        homePhone: values.homePhone,
        mobilePhone: values.mobilePhone,
      };
      
      loadingService.hideLoading();
      onNext(shippingInfo);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin giao hàng:', error);
      loadingService.hideLoading();
    }
  };

  return (
    <div className={styles.shippingContainer}>
      <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={styles.form}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input placeholder="Họ và tên người nhận" />
        </Form.Item>

        <Form.Item
          name="street"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Số nhà, tên đường" />
        </Form.Item>

        <Form.Item
          name="city"
          label="Thành phố"
          rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}
        >
          <Input placeholder="Thành phố" />
        </Form.Item>

        <Form.Item
          name="state"
          label="Tỉnh/Thành"
          rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành' }]}
        >
          <Input placeholder="Tỉnh/Thành" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: 'Vui lòng chọn quốc gia' }]}
        >
          <Select placeholder="Chọn quốc gia">
            <Option value="Vietnam">Việt Nam</Option>
            <Option value="USA">Hoa Kỳ</Option>
            <Option value="China">Trung Quốc</Option>
            <Option value="Japan">Nhật Bản</Option>
            <Option value="Korea">Hàn Quốc</Option>
          </Select>
        </Form.Item>

        <Form.Item name="homePhone" label="Số điện thoại nhà">
          <Input placeholder="Số điện thoại nhà (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          name="mobilePhone"
          label="Số điện thoại di động"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại di động' }]}
        >
          <Input placeholder="Số điện thoại di động" />
        </Form.Item>

        <div className={styles.buttonGroup}>
          <Button onClick={onCancel} className={styles.cancelButton}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" className={styles.continueButton}>
            Tiếp tục
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ShippingInfo; 