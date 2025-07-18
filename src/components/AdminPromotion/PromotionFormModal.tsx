import React, { useState, type ChangeEvent, type FormEvent} from "react";
import type { FormDataPromotionAddType } from "../../types";
import { createPromotion } from "../../services/promotionService";


const PROMOTION_TYPES = [
  "PERCENT_DISCOUNT",
  "BUY_ONE_GET_ONE",
  "ORDER_VALUE_DISCOUNT",
  "GIFT_ITEM",
  "ORDER_QUANTITY_GIFT"
];

type PromotionFormModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};



const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormDataPromotionAddType>({
    promotionType: "PERCENT_DISCOUNT",
    description: "",
    startDate: "",
    endDate: "",
    discountPercent: 0
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "discountPercent" ? Number(value) : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createPromotion(formData);
      alert("Promotion created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating promotion");
    }
  };

  if (!show) return null;
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN"); 
};

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
      <div className="bg-white p-4 shadow" style={{ width: "400px" }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Create Promotion</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Promotion Type</label>
              <select
                name="promotionType"
                value={formData.promotionType}
                onChange={handleChange}
                className="form-select"
              >
                {PROMOTION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            {formData.promotionType === "PERCENT_DISCOUNT" && (
              <div className="mb-3">
                <label className="form-label">Discount Percent</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  className="form-control"
                  min={0}
                  max={100}
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Promotion</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal;
