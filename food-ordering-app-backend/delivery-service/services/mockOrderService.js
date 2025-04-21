/**
 * Mock Order Service
 * Used for testing and development without database dependency
 */

// In-memory storage for orders
const orders = new Map();

class MockOrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData) {
    console.log(`[MOCK] Creating order: ${JSON.stringify(orderData)}`);
    
    // Store order in memory
    orders.set(orderData.orderId, {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { ...orderData, success: true };
  }

  /**
   * Update an order's status
   */
  async updateOrderStatus(orderId, newStatus) {
    console.log(`[MOCK] Updating order ${orderId} status to: ${newStatus}`);
    
    if (!orders.has(orderId)) {
      console.warn(`[MOCK] Order ${orderId} not found`);
      return { success: false, error: 'Order not found' };
    }

    const order = orders.get(orderId);
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    
    // Update the order in memory
    orders.set(orderId, order);
    
    return { orderId, status: newStatus, success: true };
  }

  /**
   * Get an order by ID
   */
  async getOrderById(orderId) {
    console.log(`[MOCK] Fetching order: ${orderId}`);
    
    if (!orders.has(orderId)) {
      return null;
    }
    
    return orders.get(orderId);
  }

  /**
   * Get all orders
   */
  async getAllOrders() {
    return Array.from(orders.values());
  }
}

module.exports = new MockOrderService();