import React, { useState } from 'react';
import { Button, Form, Input, Radio, Modal } from 'antd';
import type { PaymentMethod as PaymentMethodType, PaymentInfo } from '../../types';
import styles from './Checkout.module.css';
import { LoadingService } from '../../services/LoadingService';
import { updatePaymentInfo } from '../../services/user';

interface PaymentMethodProps {
  onComplete: (paymentMethod: PaymentMethodType, isPay: boolean) => void;
  onBack: () => void;
  onCancel: () => void;
  paymentInfo?: PaymentInfo;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onComplete,
  onBack,
  onCancel,
  paymentInfo
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('CASH');
  const [showCardForm, setShowCardForm] = useState(false);
  const [form] = Form.useForm();
  const [showQRCode, setShowQRCode] = useState(false);
  const loadingService = LoadingService.getInstance();

  const handlePaymentMethodChange = (e: any) => {
    const method = e.target.value as PaymentMethodType;
    setPaymentMethod(method);
    
    if (method === 'CREDIT_CARD') {
      if (!paymentInfo?.cardNumber) {
        setShowCardForm(true);
      }
    } else {
      setShowCardForm(false);
    }
  };

  const handleCreditCardSubmit = async (values: PaymentInfo) => {
    try {
      loadingService.showLoading();
      await updatePaymentInfo({
        cardNumber: values.cardNumber || '',
        cardHolder: values.cardHolder || '',
        expiryDate: values.expiryDate || '',
        cvv: values.cvv || '',
      });
      setShowCardForm(false);
      loadingService.hideLoading();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin thẻ:', error);
      loadingService.hideLoading();
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === 'BANK_TRANSFER') {
      setShowQRCode(true);
    } else {
      completePayment();
    }
  };

  const completePayment = () => {
    // CASH luôn là PENDING, các phương thức khác mặc định là COMPLETED
    const isPay = paymentMethod !== 'CASH';
    onComplete(paymentMethod, isPay);
  };

  const handleQRConfirm = () => {
    setShowQRCode(false);
    completePayment();
  };

  return (
    <div className={styles.paymentMethodContainer}>
      <h2 className={styles.sectionTitle}>Phương thức thanh toán</h2>
      
      <div className={styles.methodSelection}>
        <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
          <Radio value="CASH" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>💵</span>
              <div>
                <div className={styles.paymentOptionTitle}>Tiền mặt</div>
                <div className={styles.paymentOptionDescription}>Thanh toán khi nhận hàng</div>
              </div>
            </div>
          </Radio>
          
          <Radio value="CREDIT_CARD" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>💳</span>
              <div>
                <div className={styles.paymentOptionTitle}>Thẻ tín dụng</div>
                <div className={styles.paymentOptionDescription}>
                  {paymentInfo?.cardNumber 
                    ? `**** **** **** ${paymentInfo.cardNumber.slice(-4)}` 
                    : 'Thanh toán bằng thẻ tín dụng/ghi nợ'}
                </div>
              </div>
            </div>
          </Radio>
          
          <Radio value="BANK_TRANSFER" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>🏦</span>
              <div>
                <div className={styles.paymentOptionTitle}>Chuyển khoản ngân hàng</div>
                <div className={styles.paymentOptionDescription}>Chuyển khoản trực tiếp đến tài khoản của chúng tôi</div>
              </div>
            </div>
          </Radio>
          
          <Radio value="MOBILE_PAYMENT" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>📱</span>
              <div>
                <div className={styles.paymentOptionTitle}>Thanh toán di động</div>
                <div className={styles.paymentOptionDescription}>Thanh toán qua ứng dụng di động (MoMo, ZaloPay, VNPay...)</div>
              </div>
            </div>
          </Radio>
        </Radio.Group>
      </div>

      {showCardForm && (
        <div className={styles.cardFormContainer}>
          <h3>Thông tin thẻ tín dụng</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreditCardSubmit}
            className={styles.cardForm}
          >
            <Form.Item
              name="cardNumber"
              label="Số thẻ"
              rules={[
                { required: true, message: 'Vui lòng nhập số thẻ' },
                { pattern: /^\d{16}$/, message: 'Số thẻ phải gồm 16 chữ số' }
              ]}
            >
              <Input placeholder="1234 5678 9012 3456" maxLength={16} />
            </Form.Item>

            <Form.Item
              name="cardHolder"
              label="Tên chủ thẻ"
              rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ' }]}
            >
              <Input placeholder="NGUYEN VAN A" />
            </Form.Item>

            <div className={styles.cardFormRow}>
              <Form.Item
                name="expiryDate"
                label="Ngày hết hạn"
                rules={[
                  { required: true, message: 'Vui lòng nhập ngày hết hạn' },
                  { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Định dạng MM/YY' }
                ]}
              >
                <Input placeholder="MM/YY" maxLength={5} />
              </Form.Item>

              <Form.Item
                name="cvv"
                label="CVV"
                rules={[
                  { required: true, message: 'Vui lòng nhập CVV' },
                  { pattern: /^\d{3,4}$/, message: 'CVV phải gồm 3-4 chữ số' }
                ]}
              >
                <Input placeholder="123" maxLength={4} />
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" block>
              Lưu thông tin
            </Button>
          </Form>
        </div>
      )}

      <Modal
        title="Thanh toán chuyển khoản"
        open={showQRCode}
        onCancel={() => setShowQRCode(false)}
        footer={[
          <Button key="back" onClick={() => setShowQRCode(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleQRConfirm}>
            Đã thanh toán
          </Button>,
        ]}
      >
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCodeImage}>
            {/* Đây là nơi sẽ hiển thị mã QR */}
            <div className={styles.mockQRCode}>
              <img src="/img/qr_thanh_toan.png" alt="" />
            </div>
          </div>
          <p className={styles.bankInfo}>
            <strong>Ngân hàng:</strong> TECHCOMBANK<br />
            <strong>Chủ tài khoản:</strong> CONG TY SUPERMARKET<br />
            <strong>Số tài khoản:</strong> 19028450192845<br />
            <strong>Nội dung:</strong> Thanh toan don hang #[ORDER_ID]
          </p>
        </div>
      </Modal>

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Hủy
        </Button>
        <Button onClick={onBack} className={styles.backButton}>
          Quay lại
        </Button>
        <Button type="primary" onClick={handleSubmit} className={styles.continueButton}>
          Hoàn tất đơn hàng
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod; 