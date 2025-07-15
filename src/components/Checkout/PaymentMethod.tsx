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
      <h2 className={styles.sectionTitle}>Payment Method</h2>

      <div className={styles.methodSelection}>
        <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
          <Radio value="CASH" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>💵</span>
              <div>
                <div className={styles.paymentOptionTitle}>Cash</div>
                <div className={styles.paymentOptionDescription}>Pay on delivery</div>
              </div>
            </div>
          </Radio>

          <Radio value="CREDIT_CARD" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>💳</span>
              <div>
                <div className={styles.paymentOptionTitle}>Credit Card</div>
                <div className={styles.paymentOptionDescription}>
                  {paymentInfo?.cardNumber
                    ? `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`
                    : 'Pay using credit/debit card'}
                </div>
              </div>
            </div>
          </Radio>

          <Radio value="BANK_TRANSFER" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>🏦</span>
              <div>
                <div className={styles.paymentOptionTitle}>Bank Transfer</div>
                <div className={styles.paymentOptionDescription}>Transfer directly to our account</div>
              </div>
            </div>
          </Radio>

          <Radio value="MOBILE_PAYMENT" className={styles.paymentOption}>
            <div className={styles.paymentOptionContent}>
              <span className={styles.paymentOptionIcon}>📱</span>
              <div>
                <div className={styles.paymentOptionTitle}>Mobile Payment</div>
                <div className={styles.paymentOptionDescription}>Pay via mobile apps (MoMo, ZaloPay, VNPay...)</div>
              </div>
            </div>
          </Radio>
        </Radio.Group>
      </div>

      {showCardForm && (
        <div className={styles.cardFormContainer}>
          <h3>Credit Card Information</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreditCardSubmit}
            className={styles.cardForm}
          >
            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[
                { required: true, message: 'Please enter your card number' },
                { pattern: /^\d{16}$/, message: 'Card number must be 16 digits' }
              ]}
            >
              <Input placeholder="1234 5678 9012 3456" maxLength={16} />
            </Form.Item>

            <Form.Item
              name="cardHolder"
              label="Card Holder Name"
              rules={[{ required: true, message: 'Please enter the card holder name' }]}
            >
              <Input placeholder="JOHN DOE" />
            </Form.Item>

            <div className={styles.cardFormRow}>
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[
                  { required: true, message: 'Please enter expiry date' },
                  { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format MM/YY' }
                ]}
              >
                <Input placeholder="MM/YY" maxLength={5} />
              </Form.Item>

              <Form.Item
                name="cvv"
                label="CVV"
                rules={[
                  { required: true, message: 'Please enter CVV' },
                  { pattern: /^\d{3,4}$/, message: 'CVV must be 3–4 digits' }
                ]}
              >
                <Input placeholder="123" maxLength={4} />
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" block>
              Save Information
            </Button>
          </Form>
        </div>
      )}

      <Modal
        title="Bank Transfer Payment"
        open={showQRCode}
        onCancel={() => setShowQRCode(false)}
        footer={[
          <Button key="back" onClick={() => setShowQRCode(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleQRConfirm}>
            Payment Completed
          </Button>,
        ]}
      >
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCodeImage}>
            <div className={styles.mockQRCode}>
              <img src="/img/qr_thanh_toan.png" alt="QR Code" />
            </div>
          </div>
          <p className={styles.bankInfo}>
            <strong>Bank:</strong> TECHCOMBANK<br />
            <strong>Account Holder:</strong> SUPERMARKET COMPANY<br />
            <strong>Account Number:</strong> 19028450192845<br />
            <strong>Content:</strong> Payment for order #[ORDER_ID]
          </p>
        </div>
      </Modal>

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onBack} className={styles.backButton}>
          Back
        </Button>
        <Button type="primary" onClick={handleSubmit} className={styles.continueButton}>
          Complete Order
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod; 