import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ShippingInfo from './ShippingInfo';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import OrderSuccess from './OrderSuccess';
import type { CustomerAddress, PaymentMethod as PaymentMethodType, OrderItem, BillDetail, PaymentInfo } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { getUserInfo } from '../../services/user';
import { LoadingService } from '../../services/LoadingService';
import orderService from '../../services/orderService';
import styles from './Checkout.module.css';

type CheckoutStep = 'shipping' | 'summary' | 'payment' | 'success';

interface CheckoutProps {
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState<CustomerAddress | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [billDetails, setBillDetails] = useState<BillDetail[]>([]);
  const [orderAmount, setOrderAmount] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('CASH');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const navigate = useNavigate();
  const loadingService = LoadingService.getInstance();
  const { items: cartItems, clearCart } = useCartStore();

  useEffect(() => {
    loadUserInfo();
    prepareOrderData();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setPaymentInfo({
          cardNumber: userInfo.creditCardNumber || '',
          cardHolder: `${userInfo.firstName} ${userInfo.lastName}`,
          expiryDate: userInfo.creditCardExpiry || '',
          cvv: '',
        });
      }
    } catch (error) {
      console.error('Error loading user information:', error);
    }
  };

  const prepareOrderData = () => {
    const items: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      slug: item.slug,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      promotionId: null,
      promotionType: item.promotionType as any,
      promotionDescription: getPromotionDescription(item),
      discountPercent: item.discountPercent || null,
      discountAmount: item.discountAmount || null,
      giftProductId: item.giftProductId || null,
      giftProductName: null,
      giftProductImg: null,
      giftProductSlug: null,
      minOrderValue: item.minOrderValue || null,
      minOrderQuantity: item.minOrderQuantity || null,
    }));

    setOrderItems(items);

    const total = cartItems.reduce((sum: number, item) => {
      let price = item.price;
      if (item.discountPercent) {
        price = price * (1 - item.discountPercent / 100);
      } else if (item.discountAmount) {
        price = price - item.discountAmount;
      }
      return sum + price * item.quantity;
    }, 0);

    setOrderAmount(total);

    const tax = total * 0.08;
    const fee = 1;

    const details: BillDetail[] = [
      {
        itemType: 'TAX',
        amount: tax,
        description: 'VAT Tax 8%',
      },
      {
        itemType: 'FEE',
        amount: fee,
        description: 'Service fee $1',
      },
    ];

    setBillDetails(details);
    setBillAmount(total + tax + fee);
  };

  const getPromotionDescription = (product: any): string | null => {
    if (!product.promotionType) return null;
    if (product.promotionType === 'PERCENT_DISCOUNT' && product.discountPercent) {
      return `Discount ${product.discountPercent}%`;
    } else if (product.promotionType === 'FIXED_DISCOUNT' && product.discountAmount) {
      return `Discount $${product.discountAmount.toFixed(2)}`;
    } else if (product.promotionType === 'BUY_ONE_GET_ONE') {
      return 'Buy one get one free';
    }
    return null;
  };

  const handleShippingComplete = (address: CustomerAddress) => {
    setShippingInfo(address);
    setCurrentStep('summary');
  };

  const handleSummaryComplete = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async (paymentMethod: PaymentMethodType, isPay: boolean) => {
    try {
      loadingService.showLoading();
      setSelectedPaymentMethod(paymentMethod);
      setPaymentStatus(isPay ? 'COMPLETED' : 'PENDING');
      const orderData = {
        items: orderItems,
        paymentMethod,
        isPay,
      };
      const response = await orderService.createOrder(orderData);
      if (response.code === 200) {
        clearCart();
        setCurrentStep('success');
        setOrderId(Math.floor(Math.random() * 1000) + 1);
        message.success('Order placed successfully!');
      } else {
        message.error('An error occurred while placing the order: ' + response.message);
      }
      loadingService.hideLoading();
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('An error occurred while placing the order. Please try again later.');
      loadingService.hideLoading();
    }
  };

  const handleOrderSuccess = () => {
    navigate('/');
  };

  const steps = [
    { title: 'Shipping Information', key: 'shipping' },
    { title: 'Order Summary', key: 'summary' },
    { title: 'Payment', key: 'payment' },
  ];

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {steps.map((step, index) => {
        const isActive = currentStep === step.key;
        const isCompleted =
          (step.key === 'shipping' && currentStep !== 'shipping') ||
          (step.key === 'summary' && (currentStep === 'payment' || currentStep === 'success')) ||
          (step.key === 'payment' && currentStep === 'success');
        return (
          <div key={step.key} className={styles.step}>
            <div className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>{isCompleted ? '✓' : index + 1}</div>
            <div className={`${styles.stepTitle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>{step.title}</div>
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return <ShippingInfo onNext={handleShippingComplete} onCancel={onCancel} />;
      case 'summary':
        return <OrderSummary orderItems={orderItems} billDetails={billDetails} orderAmount={orderAmount} billAmount={billAmount} onNext={handleSummaryComplete} onBack={() => setCurrentStep('shipping')} onCancel={onCancel} />;
      case 'payment':
        return <PaymentMethod onComplete={handlePaymentComplete} onBack={() => setCurrentStep('summary')} onCancel={onCancel} paymentInfo={paymentInfo} />;
      case 'success':
        return <OrderSuccess orderId={orderId || 0} onComplete={handleOrderSuccess} orderItems={orderItems} billDetails={billDetails} orderAmount={orderAmount} billAmount={billAmount} paymentMethod={selectedPaymentMethod} paymentStatus={paymentStatus} customerInfo={shippingInfo ? { fullName: shippingInfo.fullName, address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`, phone: shippingInfo.mobilePhone } : { fullName: 'John Doe', address: '123 Le Loi Street, District 1, Ho Chi Minh City', phone: '0987654321' }} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      {currentStep !== 'success' && renderStepIndicator()}
      {renderStepContent()}
    </div>
  );
};

export default Checkout;
