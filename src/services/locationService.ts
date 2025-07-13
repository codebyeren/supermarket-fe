import axiosInstance from './axiosInstance';

export interface Country {
  name: string;
  code: string;
  flag?: string;
}

export interface State {
  name: string;
  code: string;
  country_code: string;
}

export interface City {
  name: string;
  state_code: string;
  country_code: string;
}

class LocationService {
  private baseUrl = 'https://api.countrystatecity.in/v1';

  // Lấy danh sách quốc gia
  async getCountries(): Promise<Country[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/countries`, {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY_HERE' // Thay thế bằng API key thực tế
        }
      });
      return response.data.map((country: any) => ({
        name: country.name,
        code: country.iso2,
        flag: country.flag
      }));
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback data nếu API không hoạt động
      return [
        { name: 'Việt Nam', code: 'VN', flag: '🇻🇳' },
        { name: 'Hoa Kỳ', code: 'US', flag: '🇺🇸' },
        { name: 'Nhật Bản', code: 'JP', flag: '🇯🇵' },
        { name: 'Hàn Quốc', code: 'KR', flag: '🇰🇷' },
        { name: 'Trung Quốc', code: 'CN', flag: '🇨🇳' },
        { name: 'Pháp', code: 'FR', flag: '🇫🇷' },
        { name: 'Đức', code: 'DE', flag: '🇩🇪' },
        { name: 'Anh', code: 'GB', flag: '🇬🇧' },
        { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
        { name: 'Thái Lan', code: 'TH', flag: '🇹🇭' },
        { name: 'Úc', code: 'AU', flag: '🇦🇺' },
        { name: 'Canada', code: 'CA', flag: '🇨🇦' },
        { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
        { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
        { name: 'Philippines', code: 'PH', flag: '🇵🇭' }
      ];
    }
  }

  // Lấy danh sách tỉnh/thành phố theo quốc gia
  async getStates(countryCode: string): Promise<State[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/countries/${countryCode}/states`, {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY_HERE'
        }
      });
      return response.data.map((state: any) => ({
        name: state.name,
        code: state.iso2,
        country_code: countryCode
      }));
    } catch (error) {
      console.error('Error fetching states:', error);
      // Fallback data cho Việt Nam
      if (countryCode === 'VN') {
        return [
          { name: 'Hà Nội', code: 'HN', country_code: 'VN' },
          { name: 'TP. Hồ Chí Minh', code: 'HCM', country_code: 'VN' },
          { name: 'Đà Nẵng', code: 'DN', country_code: 'VN' },
          { name: 'Hải Phòng', code: 'HP', country_code: 'VN' },
          { name: 'Cần Thơ', code: 'CT', country_code: 'VN' },
          { name: 'An Giang', code: 'AG', country_code: 'VN' },
          { name: 'Bà Rịa - Vũng Tàu', code: 'BR-VT', country_code: 'VN' },
          { name: 'Bắc Giang', code: 'BG', country_code: 'VN' },
          { name: 'Bắc Kạn', code: 'BK', country_code: 'VN' },
          { name: 'Bạc Liêu', code: 'BL', country_code: 'VN' },
          { name: 'Bắc Ninh', code: 'BN', country_code: 'VN' },
          { name: 'Bến Tre', code: 'BT', country_code: 'VN' },
          { name: 'Bình Định', code: 'BD', country_code: 'VN' },
          { name: 'Bình Dương', code: 'BD', country_code: 'VN' },
          { name: 'Bình Phước', code: 'BP', country_code: 'VN' },
          { name: 'Bình Thuận', code: 'BT', country_code: 'VN' },
          { name: 'Cà Mau', code: 'CM', country_code: 'VN' },
          { name: 'Cao Bằng', code: 'CB', country_code: 'VN' },
          { name: 'Đắk Lắk', code: 'DL', country_code: 'VN' },
          { name: 'Đắk Nông', code: 'DN', country_code: 'VN' },
          { name: 'Điện Biên', code: 'DB', country_code: 'VN' },
          { name: 'Đồng Nai', code: 'DN', country_code: 'VN' },
          { name: 'Đồng Tháp', code: 'DT', country_code: 'VN' },
          { name: 'Gia Lai', code: 'GL', country_code: 'VN' },
          { name: 'Hà Giang', code: 'HG', country_code: 'VN' },
          { name: 'Hà Nam', code: 'HN', country_code: 'VN' },
          { name: 'Hà Tĩnh', code: 'HT', country_code: 'VN' },
          { name: 'Hải Dương', code: 'HD', country_code: 'VN' },
          { name: 'Hậu Giang', code: 'HG', country_code: 'VN' },
          { name: 'Hòa Bình', code: 'HB', country_code: 'VN' },
          { name: 'Hưng Yên', code: 'HY', country_code: 'VN' },
          { name: 'Khánh Hòa', code: 'KH', country_code: 'VN' },
          { name: 'Kiên Giang', code: 'KG', country_code: 'VN' },
          { name: 'Kon Tum', code: 'KT', country_code: 'VN' },
          { name: 'Lai Châu', code: 'LC', country_code: 'VN' },
          { name: 'Lâm Đồng', code: 'LD', country_code: 'VN' },
          { name: 'Lạng Sơn', code: 'LS', country_code: 'VN' },
          { name: 'Lào Cai', code: 'LC', country_code: 'VN' },
          { name: 'Long An', code: 'LA', country_code: 'VN' },
          { name: 'Nam Định', code: 'ND', country_code: 'VN' },
          { name: 'Nghệ An', code: 'NA', country_code: 'VN' },
          { name: 'Ninh Bình', code: 'NB', country_code: 'VN' },
          { name: 'Ninh Thuận', code: 'NT', country_code: 'VN' },
          { name: 'Phú Thọ', code: 'PT', country_code: 'VN' },
          { name: 'Phú Yên', code: 'PY', country_code: 'VN' },
          { name: 'Quảng Bình', code: 'QB', country_code: 'VN' },
          { name: 'Quảng Nam', code: 'QN', country_code: 'VN' },
          { name: 'Quảng Ngãi', code: 'QN', country_code: 'VN' },
          { name: 'Quảng Ninh', code: 'QN', country_code: 'VN' },
          { name: 'Quảng Trị', code: 'QT', country_code: 'VN' },
          { name: 'Sóc Trăng', code: 'ST', country_code: 'VN' },
          { name: 'Sơn La', code: 'SL', country_code: 'VN' },
          { name: 'Tây Ninh', code: 'TN', country_code: 'VN' },
          { name: 'Thái Bình', code: 'TB', country_code: 'VN' },
          { name: 'Thái Nguyên', code: 'TN', country_code: 'VN' },
          { name: 'Thanh Hóa', code: 'TH', country_code: 'VN' },
          { name: 'Thừa Thiên Huế', code: 'TTH', country_code: 'VN' },
          { name: 'Tiền Giang', code: 'TG', country_code: 'VN' },
          { name: 'Trà Vinh', code: 'TV', country_code: 'VN' },
          { name: 'Tuyên Quang', code: 'TQ', country_code: 'VN' },
          { name: 'Vĩnh Long', code: 'VL', country_code: 'VN' },
          { name: 'Vĩnh Phúc', code: 'VP', country_code: 'VN' },
          { name: 'Yên Bái', code: 'YB', country_code: 'VN' }
        ];
      }
      return [];
    }
  }

  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  async getCities(countryCode: string, stateCode: string): Promise<City[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/countries/${countryCode}/states/${stateCode}/cities`, {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY_HERE'
        }
      });
      return response.data.map((city: any) => ({
        name: city.name,
        state_code: stateCode,
        country_code: countryCode
      }));
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback data cho một số tỉnh/thành phố của Việt Nam
      if (countryCode === 'VN') {
        const cityData: { [key: string]: City[] } = {
          'HCM': [
            { name: 'Quận 1', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 2', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 3', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 4', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 5', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 6', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 7', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 8', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 9', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 10', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 11', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận 12', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Bình Tân', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Bình Thạnh', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Gò Vấp', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Phú Nhuận', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Tân Bình', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Tân Phú', state_code: 'HCM', country_code: 'VN' },
            { name: 'Quận Thủ Đức', state_code: 'HCM', country_code: 'VN' },
            { name: 'Huyện Bình Chánh', state_code: 'HCM', country_code: 'VN' },
            { name: 'Huyện Cần Giờ', state_code: 'HCM', country_code: 'VN' },
            { name: 'Huyện Củ Chi', state_code: 'HCM', country_code: 'VN' },
            { name: 'Huyện Hóc Môn', state_code: 'HCM', country_code: 'VN' },
            { name: 'Huyện Nhà Bè', state_code: 'HCM', country_code: 'VN' }
          ],
          'HN': [
            { name: 'Quận Ba Đình', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Hoàn Kiếm', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Hai Bà Trưng', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Đống Đa', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Tây Hồ', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Cầu Giấy', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Thanh Xuân', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Hoàng Mai', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Long Biên', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Nam Từ Liêm', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Bắc Từ Liêm', state_code: 'HN', country_code: 'VN' },
            { name: 'Quận Hà Đông', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Sóc Sơn', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Đông Anh', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Gia Lâm', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Thanh Trì', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Mê Linh', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Phú Xuyên', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Thường Tín', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Phúc Thọ', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Đan Phượng', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Hoài Đức', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Quốc Oai', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Thạch Thất', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Chương Mỹ', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Thanh Oai', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Thường Tín', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Mỹ Đức', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Ứng Hòa', state_code: 'HN', country_code: 'VN' },
            { name: 'Huyện Ba Vì', state_code: 'HN', country_code: 'VN' }
          ]
        };
        return cityData[stateCode] || [];
      }
      return [];
    }
  }
}

export const locationService = new LocationService(); 