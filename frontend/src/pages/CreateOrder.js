import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    orderDescription: '',
    selectedProducts: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, orderDescription: value }));

    if (errors.orderDescription) {
      setErrors((prev) => ({ ...prev, orderDescription: '' }));
    }
  };

  const handleProductToggle = (productUid) => {
    setFormData((prev) => {
      const isSelected = prev.selectedProducts.includes(productUid);
      return {
        ...prev,
        selectedProducts: isSelected
          ? prev.selectedProducts.filter((uid) => uid !== productUid)
          : [...prev.selectedProducts, productUid],
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orderDescription.trim()) {
      newErrors.orderDescription = 'Order description is required';
    } else if (formData.orderDescription.trim().length < 3) {
      newErrors.orderDescription = 'Order description must be at least 3 characters';
    } else if (formData.orderDescription.trim().length > 100) {
      newErrors.orderDescription = 'Order description must not exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        orderDescription: formData.orderDescription.trim(),
        productUids: formData.selectedProducts,
      };

      await orderService.createOrder(orderData);
      toast.success('Order created successfully');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
          New Order
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orderDescription" className="form-label">
              Order Description <span className="required">*</span>
            </label>
            <input
              type="text"
              id="orderDescription"
              value={formData.orderDescription}
              onChange={handleDescriptionChange}
              placeholder="Enter order description"
              className={`form-input ${errors.orderDescription ? 'error' : ''}`}
            />
            {errors.orderDescription && (
              <p className="form-error">{errors.orderDescription}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '1rem' }}>
              Select Products
            </label>
            <div>
              {products.map((product) => {
                const isSelected = formData.selectedProducts.includes(product.uid);
                return (
                  <div
                    key={product.uid}
                    onClick={() => handleProductToggle(product.uid)}
                    className={`product-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="product-card-content">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="product-checkbox"
                      />
                      <div className="product-info">
                        <p className="product-name">{product.productName}</p>
                        <p className="product-description">{product.productDescription}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {formData.selectedProducts.length > 0 && (
              <p className="text-gray-600" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                {formData.selectedProducts.length} product(s) selected
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
