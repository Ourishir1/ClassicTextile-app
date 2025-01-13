import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './OrderManagement.css';
import { Order } from '../../../Models/Order';
import { OrderStatus } from '../../../Models/enums/OrderStatus';
import orderService from '../../../Services/OrderService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  isAdmin: boolean;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleOrderId, setVisibleOrderId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [sortByDate, setSortByDate] = useState<boolean>(true); // New state to track sorting order
  const navigate = useNavigate();

  useEffect(() => {
    // Decode token to check admin privileges
    const token = localStorage.getItem("token");
    let isAdmin: boolean | undefined;
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      isAdmin = decodedToken.isAdmin;
    }

    // Redirect if not authorized
    if (!isAdmin) {
      setIsAuthorized(false);
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    setIsAuthorized(true);

    // Fetch orders only if authorized
    if (isAdmin) {
      orderService
        .getAllOrders()
        .then((fetchedOrders) => {
          // Sort orders by date after fetching
          const sortedOrders = fetchedOrders.sort((a, b) => {
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);
            return sortByDate ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
          });
          setOrders(sortedOrders);
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          alert(err.response?.data || 'Error fetching orders');
        });
    }
  }, [navigate, sortByDate]);

  // Redirect to login if not authorized
  if (isAuthorized === false) {
    navigate("/home");
  }

  const toggleOrderItems = (orderId: number) => {
    setVisibleOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
  };

  const handleAcceptOrder = (orderId: number) => {
    orderService
      .updateOrder(orderId, OrderStatus.ACCEPTED)
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: OrderStatus.ACCEPTED } : order
          )
        );
        alert('Order status updated to ACCEPTED');
      })
      .catch((err) => {
        console.error('Error updating order status:', err);
        alert(err.response?.data || 'Error updating order status');
      });
  };

  const handleDeliverOrder = (orderId: number) => {
    orderService
      .updateOrder(orderId, OrderStatus.DELIVERED)
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: OrderStatus.DELIVERED } : order
          )
        );
        alert('Order status updated to DELIVERED');
      })
      .catch((err) => {
        console.error('Error updating order status:', err);
        alert(err.response?.data || 'Error updating order status');
      });
  };

  const handleCancelOrder = (orderId: number) => {
    orderService
      .updateOrder(orderId, OrderStatus.CANCELLED)
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: OrderStatus.CANCELLED } : order
          )
        );
        alert('Order status updated to CANCELED');
      })
      .catch((err) => {
        console.error('Error updating order status:', err);
        alert(err.response?.data || 'Error updating order status');
      });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderStatus !== OrderStatus.PENDING &&
      (selectedStatus === 'ALL' || order.orderStatus === selectedStatus)
  );

  return (
    <Box
      className="order-management-container"
      sx={{
        padding: '20px',
        paddingTop: '40px',
        background: 'linear-gradient(135deg, rgba(65, 63, 63, 0.9), rgba(65, 63, 63, 0.2))',
        borderRadius: '12px',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
      }}
    >
      <h1 className="order-management-header">All Orders</h1>
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select id="statusFilter" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'ALL')}>
          <option value="ALL">All</option>
          {Object.values(OrderStatus)
            .filter((status) => status !== OrderStatus.PENDING)
            .map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
        </select>
        <label htmlFor="dateFilter">Sort by Date:</label>
        <select
          id="dateFilter"
          value={sortByDate ? 'Newest First' : 'Oldest First'}
          onChange={(e) => setSortByDate(e.target.value === 'Newest First')}
        >
          <option value="Newest First">Newest First</option>
          <option value="Oldest First">Oldest First</option>
        </select>
      </div>
      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`order-row ${order.orderStatus === OrderStatus.CANCELLED ? 'canceled' : ''}`}
            >
              <div className="order-info">
                <div className="order-id">Order ID: {order.id}</div>
                <div className="customer-shippingAddress">
                  Shipping Address: {order.shippingAddress || 'N/A'}
                </div>
                <div className="order-total">
                  Total: ${order.totalPrice?.toFixed(2) || '0.00'}
                </div>
                <div className="order-date">
                  Date:{' '}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </div>
                <div className="order-status">Status: {order.orderStatus || 'N/A'}</div>
              </div>
              <div className="button-container">
                {order.orderStatus === OrderStatus.IN_PROCESS && (
                  <button
                    className="status-update-button"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Mark as Accepted
                  </button>
                )}
                {order.orderStatus === OrderStatus.ACCEPTED && (
                  <button
                    className="status-update-button"
                    onClick={() => handleDeliverOrder(order.id)}
                  >
                    Mark as Delivered
                  </button>
                )}
                {order.orderStatus !== OrderStatus.CANCELLED && (
                  <button
                    className="status-update-button cancel-button"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    X Cancel
                  </button>
                )}
              </div>
              <button className="show-items-button" onClick={() => toggleOrderItems(order.id)}>
                {visibleOrderId === order.id ? 'Hide Items' : 'Show Items'}
              </button>
              {visibleOrderId === order.id && (
                <div className="order-items">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-name">{item.fabric.name}</div>
                        <div className="item-quantity">Quantity: {item.quantity}</div>
                        <div className="item-price">Price: ${item.price.toFixed(2)}</div>
                      </div>
                    ))
                  ) : (
                    <div>No items available.</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">No orders available.</div>
        )}
      </div>
    </Box>
  );
}
