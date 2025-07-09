/**
 * Dịch vụ quản lý trạng thái loading trong ứng dụng
 * Sử dụng singleton pattern để đảm bảo chỉ có 1 instance duy nhất
 */
export class LoadingService {
  private static instance: LoadingService;
  private loadingState = false;
  private listeners: Array<(isLoading: boolean) => void> = [];

  private constructor() {}

  /**
   * Lấy instance của LoadingService
   */
  public static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  /**
   * Đăng ký listener để cập nhật UI khi trạng thái loading thay đổi
   * @param listener Hàm callback khi trạng thái thay đổi
   * @returns Hàm để hủy đăng ký listener
   */
  public subscribe(listener: (isLoading: boolean) => void): () => void {
    this.listeners.push(listener);
    listener(this.loadingState);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Hiển thị trạng thái loading
   */
  public showLoading(): void {
    if (!this.loadingState) {
      this.loadingState = true;
      this.notifyListeners();
    }
  }

  /**
   * Ẩn trạng thái loading
   */
  public hideLoading(): void {
    if (this.loadingState) {
      this.loadingState = false;
      this.notifyListeners();
    }
  }

  /**
   * Lấy trạng thái loading hiện tại
   */
  public isLoading(): boolean {
    return this.loadingState;
  }

  /**
   * Thông báo cho tất cả listeners về sự thay đổi trạng thái
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.loadingState));
  }
} 