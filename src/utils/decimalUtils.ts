// Utility functions for precise decimal calculations
// Tránh lỗi floating point precision trong JavaScript

/**
 * Làm tròn số thập phân với độ chính xác cao
 * @param value Giá trị cần làm tròn
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Số đã được làm tròn
 */
export const roundDecimal = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

/**
 * Cộng hai số thập phân với độ chính xác cao
 * @param a Số thứ nhất
 * @param b Số thứ hai
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Tổng của hai số
 */
export const addDecimals = (a: number, b: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  const result = (a * multiplier + b * multiplier) / multiplier;
  return roundDecimal(result, decimals);
};

/**
 * Trừ hai số thập phân với độ chính xác cao
 * @param a Số bị trừ
 * @param b Số trừ
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Hiệu của hai số
 */
export const subtractDecimals = (a: number, b: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  const result = (a * multiplier - b * multiplier) / multiplier;
  return roundDecimal(result, decimals);
};

/**
 * Nhân hai số thập phân với độ chính xác cao
 * @param a Số thứ nhất
 * @param b Số thứ hai
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Tích của hai số
 */
export const multiplyDecimals = (a: number, b: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  const result = (a * multiplier * b * multiplier) / (multiplier * multiplier);
  return roundDecimal(result, decimals);
};

/**
 * Chia hai số thập phân với độ chính xác cao
 * @param a Số bị chia
 * @param b Số chia
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Thương của hai số
 */
export const divideDecimals = (a: number, b: number, decimals: number = 2): number => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  const multiplier = Math.pow(10, decimals);
  const result = (a * multiplier) / (b * multiplier);
  return roundDecimal(result, decimals);
};

/**
 * Tính tổng của một mảng số thập phân
 * @param values Mảng các số cần tính tổng
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Tổng của mảng
 */
export const sumDecimals = (values: number[], decimals: number = 2): number => {
  return values.reduce((sum, value) => addDecimals(sum, value, decimals), 0);
};

/**
 * Tính trung bình của một mảng số thập phân
 * @param values Mảng các số cần tính trung bình
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Trung bình của mảng
 */
export const averageDecimals = (values: number[], decimals: number = 2): number => {
  if (values.length === 0) return 0;
  const sum = sumDecimals(values, decimals);
  return divideDecimals(sum, values.length, decimals);
};

/**
 * Tính phần trăm với độ chính xác cao
 * @param value Giá trị cần tính phần trăm
 * @param total Tổng giá trị
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Phần trăm
 */
export const calculatePercentage = (value: number, total: number, decimals: number = 2): number => {
  if (total === 0) return 0;
  return multiplyDecimals(divideDecimals(value, total, decimals + 2), 100, decimals);
};

/**
 * Tính giá sau khi áp dụng giảm giá phần trăm
 * @param originalPrice Giá gốc
 * @param discountPercent Phần trăm giảm giá
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Giá sau giảm
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercent: number,
  decimals: number = 2
): number => {
  const discountAmount = multiplyDecimals(originalPrice, discountPercent / 100, decimals + 2);
  return subtractDecimals(originalPrice, discountAmount, decimals);
};

/**
 * Tính giá sau khi áp dụng thuế
 * @param price Giá trước thuế
 * @param taxPercent Phần trăm thuế
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Giá sau thuế
 */
export const calculatePriceWithTax = (
  price: number,
  taxPercent: number,
  decimals: number = 2
): number => {
  const taxAmount = multiplyDecimals(price, taxPercent / 100, decimals + 2);
  return addDecimals(price, taxAmount, decimals);
};

/**
 * Tính số tiền thuế
 * @param price Giá trước thuế
 * @param taxPercent Phần trăm thuế
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Số tiền thuế
 */
export const calculateTaxAmount = (
  price: number,
  taxPercent: number,
  decimals: number = 2
): number => {
  return multiplyDecimals(price, taxPercent / 100, decimals);
};

/**
 * Format số tiền theo định dạng tiền tệ
 * @param amount Số tiền
 * @param currency Đơn vị tiền tệ (mặc định: 'VND')
 * @param decimals Số chữ số thập phân (mặc định: 0)
 * @returns Chuỗi tiền tệ đã format
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'VND',
  decimals: number = 0
): string => {
  const roundedAmount = roundDecimal(amount, decimals);
  
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(roundedAmount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(roundedAmount);
};

/**
 * Format số thập phân với dấu phẩy ngăn cách hàng nghìn
 * @param value Số cần format
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Chuỗi số đã format
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  const roundedValue = roundDecimal(value, decimals);
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(roundedValue);
};

/**
 * Kiểm tra xem hai số thập phân có bằng nhau không (với độ chính xác)
 * @param a Số thứ nhất
 * @param b Số thứ hai
 * @param precision Độ chính xác (mặc định: 0.01)
 * @returns true nếu hai số bằng nhau
 */
export const isDecimalEqual = (a: number, b: number, precision: number = 0.01): boolean => {
  return Math.abs(a - b) < precision;
};

/**
 * So sánh hai số thập phân
 * @param a Số thứ nhất
 * @param b Số thứ hai
 * @param precision Độ chính xác (mặc định: 0.01)
 * @returns -1 nếu a < b, 0 nếu a = b, 1 nếu a > b
 */
export const compareDecimals = (a: number, b: number, precision: number = 0.01): number => {
  if (isDecimalEqual(a, b, precision)) return 0;
  return a < b ? -1 : 1;
};

/**
 * Làm tròn lên số thập phân
 * @param value Giá trị cần làm tròn
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Số đã được làm tròn lên
 */
export const ceilDecimal = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
};

/**
 * Làm tròn xuống số thập phân
 * @param value Giá trị cần làm tròn
 * @param decimals Số chữ số thập phân (mặc định: 2)
 * @returns Số đã được làm tròn xuống
 */
export const floorDecimal = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(value * multiplier) / multiplier;
}; 