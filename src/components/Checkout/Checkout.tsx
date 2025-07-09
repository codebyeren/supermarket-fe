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

  // Lấy dữ liệu giỏ hàng và chuyển đổi thành OrderItem
  useEffect(() => {
    loadUserInfo();
    prepareOrderData();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      // Thiết lập thông tin thanh toán nếu có
      setPaymentInfo({
        cardNumber: userInfo.paymentInfo?.cardNumber,
        cardHolder: userInfo.paymentInfo?.cardHolder,
        expiryDate: userInfo.paymentInfo?.expiryDate,
        cvv: userInfo.paymentInfo?.cvv,
      });
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
    }
  };

  const prepareOrderData = () => {
    // Chuyển đổi từ giỏ hàng sang OrderItem
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
    
    // Tính tổng giá sản phẩm
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
    
    // Thêm phí và thuế
    const tax = total * 0.08; // 8% thuế
    const fee = 1; // $1 phí dịch vụ
    
    const details: BillDetail[] = [
      {
        itemType: 'TAX',
        amount: tax,
        description: 'Thuế VAT 8%',
      },
      {
        itemType: 'FEE',
        amount: fee,
        description: 'Phí dịch vụ $1',
      },
    ];
    
    setBillDetails(details);
    setBillAmount(total + tax + fee);
  };

  const getPromotionDescription = (product: any): string | null => {
    if (!product.promotionType) return null;
    
    if (product.promotionType === 'PERCENT_DISCOUNT' && product.discountPercent) {
      return `Giảm ${product.discountPercent}%`;
    } else if (product.promotionType === 'FIXED_DISCOUNT' && product.discountAmount) {
      return `Giảm $${product.discountAmount.toFixed(2)}`;
    } else if (product.promotionType === 'BUY_ONE_GET_ONE') {
      return 'Mua 1 tặng 1';
    }
    
    return null;
  };

  // Xử lý khi hoàn thành bước 1
  const handleShippingComplete = (address: CustomerAddress) => {
    setShippingInfo(address);
    setCurrentStep('summary');
  };

  // Xử lý khi chuyển từ bước 2 sang bước 3
  const handleSummaryComplete = () => {
    setCurrentStep('payment');
  };

  // Xử lý khi hoàn tất thanh toán
  const handlePaymentComplete = async (paymentMethod: PaymentMethodType, isPay: boolean) => {
    try {
      loadingService.showLoading();
      
      // Lưu phương thức thanh toán đã chọn
      setSelectedPaymentMethod(paymentMethod);
      setPaymentStatus(isPay ? 'COMPLETED' : 'PENDING');
      
      // Chuẩn bị dữ liệu đơn hàng theo định dạng request body mới
      const orderData = {
        items: orderItems,
        paymentMethod,
        isPay,
      };
      
      // Gọi API tạo đơn hàng
      const response = await orderService.createOrder(orderData);
      
      if (response.code === 200) {
        // Xóa giỏ hàng
        clearCart();
        
        // Đặt hàng thành công
        setCurrentStep('success');
        setOrderId(Math.floor(Math.random() * 1000) + 1); // Giả định ID đơn hàng vì API chỉ trả về boolean
        
        message.success('Đặt hàng thành công!');
      } else {
        message.error('Có lỗi xảy ra khi đặt hàng: ' + response.message);
      }
      
      loadingService.hideLoading();
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      message.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
      loadingService.hideLoading();
    }
  };

  // Xử lý khi hoàn tất quá trình đặt hàng
  const handleOrderSuccess = () => {
    navigate('/');
  };

  const steps = [
    {
      title: 'Thông tin giao hàng',
      key: 'shipping',
    },
    {
      title: 'Thông tin đơn hàng',
      key: 'summary',
    },
    {
      title: 'Thanh toán',
      key: 'payment',
    },
  ];

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = 
            (step.key === 'shipping' && currentStep !== 'shipping') ||
            (step.key === 'summary' && (currentStep === 'payment' || currentStep === 'success')) ||
            (step.key === 'payment' && currentStep === 'success');
          
          return (
            <div key={step.key} className={styles.step}>
              <div 
                className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <div 
                className={`${styles.stepTitle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return (
          <ShippingInfo
            onNext={handleShippingComplete}
            onCancel={onCancel}
          />
        );
      case 'summary':
        return (
          <OrderSummary
            orderItems={orderItems}
            billDetails={billDetails}
            orderAmount={orderAmount}
            billAmount={billAmount}
            onNext={handleSummaryComplete}
            onBack={() => setCurrentStep('shipping')}
            onCancel={onCancel}
          />
        );
      case 'payment':
        return (
          <PaymentMethod
            onComplete={handlePaymentComplete}
            onBack={() => setCurrentStep('summary')}
            onCancel={onCancel}
            paymentInfo={paymentInfo}
          />
        );
      case 'success':
        return (
          <OrderSuccess
            orderId={orderId || 0}
            onComplete={handleOrderSuccess}
            orderItems={orderItems}
            billDetails={billDetails}
            orderAmount={orderAmount}
            billAmount={billAmount}
            paymentMethod={selectedPaymentMethod}
            paymentStatus={paymentStatus}
            customerInfo={shippingInfo ? {
              fullName: shippingInfo.fullName,
              address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`,
              phone: shippingInfo.mobilePhone
            } : {
              fullName: 'Nguyễn Văn A',
              address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
              phone: '0987654321'
            }}
          />
        );
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