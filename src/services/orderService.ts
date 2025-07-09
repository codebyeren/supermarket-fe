import axiosInstance from './axiosInstance';
import type { PaymentMethod, OrderStatus, PaymentStatus, Order } from '../types';

// Định nghĩa theo cấu trúc request body mới
interface OrderItem {
  ProductId: number;
  Quantity: number;
  Price: number;
  PromotionId?: number;
}

interface CreateOrderRequest {
  Items: OrderItem[];
  PaymentMethod: PaymentMethod;
  IsPay: boolean;
}

interface OrderResponse {
  code: number;
  message: string;
  data: boolean | any;
}

interface GetOrdersResponse {
  code: number;
  message: string;
  data: Order[];
}

interface UpdateOrderRequest {
  orderId: number;
  orderStatus: OrderStatus;
}

interface UpdateBillRequest {
  billId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

const orderService = {
  getOrders: async (): Promise<GetOrdersResponse> => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },
  
  createOrder: async (orderData: any): Promise<OrderResponse> => {
    const requestData: CreateOrderRequest = {
      Items: orderData.items.map((item: any) => ({
        ProductId: item.productId,
        Quantity: item.quantity,
        Price: item.price,
        PromotionId: item.promotionId || undefined
      })),
      PaymentMethod: orderData.paymentMethod,
      IsPay: orderData.isPay
    };
    
    // Gửi request với định dạng body mới
    const response = await axiosInstance.post('/orders', requestData);
    return response.data;
  },
  
  updateOrder: async (updateData: UpdateOrderRequest) => {
    const response = await axiosInstance.put('/orders', {
      OrderId: updateData.orderId,
      OrderStatus: updateData.orderStatus
    });
    return response.data;
  },
  
  updateBill: async (updateData: UpdateBillRequest) => {
    const response = await axiosInstance.put('/orders/bill', {
      BillId: updateData.billId,
      PaymentMethod: updateData.paymentMethod,
      PaymentStatus: updateData.paymentStatus
    });
    return response.data;
  }
};

export default orderService; 