import api from './api';

const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/order');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order by UID
  getOrderByUid: async (uid) => {
    try {
      const response = await api.get(`/order/${uid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update order
  updateOrder: async (uid, orderData) => {
    try {
      const response = await api.put(`/orders/${uid}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete order
  deleteOrder: async (uid) => {
    try {
      const response = await api.delete(`/orders/${uid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default orderService;
