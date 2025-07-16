import React, { useState } from 'react';
import { createBrand } from '../../services/brandService';
import type { AddBrand } from '../../types';

interface AddBrandModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddBrandModal: React.FC<AddBrandModalProps> = ({ show, onClose, onSuccess }) => {
    const [brandName, setBrandName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newBrand: AddBrand = { brandName, slug };
            await createBrand(newBrand);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating brand:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3">
            <div className="bg-white p-4  shadow" style={{ width: '400px' }}>
  
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Brand</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Brand Name</label>
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
};

export default AddBrandModal;
