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
        address: userInfo.address || '',
      });
      loadingService.hideLoading();
    } catch (error) {
      console.error('Error loading user information:', error);
      loadingService.hideLoading();
    }
  };

  const handleFinish = async (values: any) => {
    try {
      loadingService.showLoading();
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
      console.error('Error updating shipping information:', error);
      loadingService.hideLoading();
    }
  };

  return (
    <div className={styles.shippingContainer}>
      <h2 className={styles.sectionTitle}>Shipping Information</h2>
      <Form form={form} layout="vertical" onFinish={handleFinish} className={styles.form}>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Recipient's full name" />
        </Form.Item>

        <Form.Item
          name="street"
          label="Street"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input placeholder="Street address" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Please enter your city' }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          name="state"
          label="State/Province"
          rules={[{ required: true, message: 'Please enter your state/province' }]}
        >
          <Input placeholder="State/Province" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: 'Please select your country' }]}
        >
          <Select placeholder="Select country">
            <Option value="Vietnam">Vietnam</Option>
            <Option value="USA">USA</Option>
            <Option value="China">China</Option>
            <Option value="Japan">Japan</Option>
            <Option value="Korea">Korea</Option>
          </Select>
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input placeholder="Recipient's full name" />
        </Form.Item>

        <Form.Item name="homePhone" label="Home Phone">
          <Input placeholder="Home phone (optional)" />
        </Form.Item>

        <Form.Item
          name="mobilePhone"
          label="Mobile Phone"
          rules={[{ required: true, message: 'Please enter your mobile phone number' }]}
        >
          <Input placeholder="Mobile phone number" />
        </Form.Item>

        <div className={styles.buttonGroup}>
          <Button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className={styles.continueButton}>
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ShippingInfo;
