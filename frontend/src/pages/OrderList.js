import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SearchBar from '../components/SearchBar';

function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const searchLower = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.uid.toLowerCase().includes(searchLower) ||
        order.orderDescription.toLowerCase().includes(searchLower)
    );
  }, [orders, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (orderUid) => {
    navigate(`/orders/edit/${orderUid}`);
  };

  const handleDeleteClick = (order) => {
    setDeleteModal({ isOpen: true, order });
  };

  const handleDeleteConfirm = async () => {
    const orderUid = deleteModal.order.uid;

    try {
      setDeletingId(orderUid);
      await orderService.deleteOrder(orderUid);
      toast.success('Order deleted successfully');
      setOrders((prev) => prev.filter((order) => order.uid !== orderUid));
      setDeleteModal({ isOpen: false, order: null });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, order: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="mb-6">
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            Order Management
          </h1>

          <div className="flex justify-between items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="search by order description"
            />
            <button
              onClick={() => navigate('/orders/new')}
              className="btn btn-primary"
            >
              New Order
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <p className="text-lg text-gray-500">
              {searchTerm ? 'No orders found matching your search' : 'No orders yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/orders/new')}
                style={{ marginTop: '1rem', color: '#0ea5e9', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Create your first order
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order UID</th>
                  <th>Order Description</th>
                  <th>Count of Products</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.uid}>
                    <td style={{ fontWeight: 500 }}>{order.uid}</td>
                    <td>{order.orderDescription}</td>
                    <td>{order.productCount || 0}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(order.uid)}
                          className="icon-btn"
                          title="Edit order"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order)}
                          disabled={deletingId === order.uid}
                          className="icon-btn danger"
                          title="Delete order"
                        >
                          {deletingId === order.uid ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', borderColor: '#dc2626', borderTopColor: '#fee2e2' }}></div>
                          ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        orderDescription={deleteModal.order?.orderDescription}
      />
    </div>
  );
}

export default OrderList;
