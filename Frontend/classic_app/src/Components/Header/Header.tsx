import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import authService from "../../Services/AuthService";
import { Order } from "../../Models/Order";
import orderService from "../../Services/OrderService";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { CartItem } from "../FabricArea/CartItem/CartItem";


export function Header(): JSX.Element {
  interface CustomJwtPayload extends JwtPayload {
    userId: string;
    isAdmin:string
  }

  const navigate = useNavigate();
  const [auth, setAuth] = React.useState<boolean>(false);
  const [anchorProfile, setAnchorProfile] = React.useState<null | HTMLElement>(null);
  const [anchorAdmin, setAnchorAdmin] = React.useState<null | HTMLElement>(null);
  const [openAdmin, setOpenAdmin] = React.useState(false);

  const [anchorCart, setAnchorCart] = React.useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState<string | null>(null);  // State for userId
  const [openLogin, setOpenLogin] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItemsCount, setOrderItemsCount] = useState<number>(0); // State to hold the number of order items
  const [isAdmin,setIsAdmin] =useState<boolean>(false);
  const[totalPrice,setTotalPrice]=useState<number>(0);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      setUserId(decodedToken.userId);
      setIsAdmin(!!decodedToken.isAdmin);
  
      handlePendingOrder();
    }
  }, []);
  
  const   handlePendingOrder =  () => {
    const token = localStorage.getItem("token")!;
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    
  
    orderService
      .getPendingOrder(+(decodedToken.userId))
      .then((fetchedOrder) => {
        if (fetchedOrder && fetchedOrder.orderItems) {
          // Set fetched order if found
          setOrder(fetchedOrder);
          setOrderItemsCount(fetchedOrder.orderItems.length); // Set order items count
        } else {
          // Set order to null if no order is found
          setOrder(null);
          setOrderItemsCount(0); // No items
        }
      })
      .catch((err) => {
        alert(err.response?.data || "Error fetching order");
        // Set order to null in case of error
        setOrder(null);
        setOrderItemsCount(0); // No items
      });
      console.log(order)
  };
  const handleRegisterRedirect = () => {
    navigate('/Register');
    handleLoginClose()
  };
  

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAdmin(event.currentTarget);
  };
  const handleAdminClose = () => {
    setAnchorAdmin(null);
  };
  const handleAdminOpen = () => {
    setOpenAdmin(true);
  };


  const handleClose = () => {
    setAnchorProfile(null);
  };
  const handleCartMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorCart(event.currentTarget);
    setTotalPrice(order?.totalPrice!)
  };

  const handleCartClose = () => {
    setAnchorCart(null);
  };

 
  const handleLoginOpen = () => {
    setOpenLogin(true);
  };

  const handleLoginClose = () => {
    setOpenLogin(false);
  };

  const handleLoginSubmit = () => {
    authService
      .login(email, password)
      .then((res) => {
        localStorage.setItem("token", res); // Save token
        setAuth(true);
        const decodedToken = jwtDecode<CustomJwtPayload>(res);  // Decode token to get userId
        setUserId(decodedToken.userId);  // Save userId to state
        setIsAdmin(!!decodedToken.isAdmin)
        handlePendingOrder(); // Fetch pending order after login
        handleLoginClose();
      })
      .catch((err) => alert("Passoword or email is incorrect"));
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    setAuth(false);

    if (token) {
      authService
        .logout(token)
        .then((res) => {
          handleLoginClose();
          navigate("/home");
        })
        .catch((err) => {
          alert(err.response?.data || "Logout failed");
          navigate("/home");
        });
    } else {
      navigate("/home");
    }

    handleClose();
  };
  const handleViewProfile = () => {
    handleClose();  // Close the profile menu
    if (userId) {
      navigate(`/userProfile/?userId=${userId}`);  // Navigate to the user profile page with userId as a query parameter
    }
  };
  const handleViewOrderView = () => {
    handleClose();  // Close the profile menu
    if (userId) {
      navigate(`/MyOrders/?userId=${userId}`);  // Navigate to the user profile page with userId as a query parameter
    }
  };
  const handleCheckoutView = () => {
    handleCartClose(); 
    if (userId) {
      navigate(`/checkOut/?userId=${userId}`);  // Navigate to the user profile page with userId as a query parameter
    }
  };

  const handleGetAllUsers = () => {
    navigate("/admin/users"); // Navigate to the all users page
  };

  const handleGetAllOrders = () => {
    navigate("/admin/orders"); // Navigate to the all orders page
  };

  

  const handleAddFabric = () => {
    navigate("/admin/addFabric"); // Navigate to the add fabric page
  };


  return (
    <div className="Header">
      <div id="left-header">
        <img
          src={require("/Users/ourishirkani/JS/React/classic_app/src/Images/ClassicLogo.png")}
          alt="classicLogo"
          width="70px"
        />
      </div>

      <div id="middle-header">
        <input type="button" value="Home Page" onClick={() => navigate("/home")} />
        <input type="button" value="All fabrics" onClick={() => navigate("/fabrics")} />
        <input type="button" value="Contact Us" onClick={() => navigate("/contactUs")} />
      </div>

      <div id="right-header">
        {auth ? (
          <>
            <button id="cart-button" onClick={handleCartMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z"
                />
              </svg>
              {orderItemsCount > 0 && (
                <span className="cart-item-count">{orderItemsCount}</span> // Show item count next to cart icon
              )}
            </button>
            <Menu
                id="shopping-cart"
                anchorEl={anchorCart}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorCart)}
                onClose={handleCartClose}
              >

                
           
                  {order && order.orderItems.length > 0 ? (
                    order.orderItems.map((orderItem) => (
                      <CartItem
                        orderItem={orderItem}
                        key={orderItem.id}
                        orderId={order.id}
                        onOrderUpdate={(updatedOrder) => {
                          setOrder(updatedOrder);
                          setTotalPrice(updatedOrder.totalPrice);
                          setOrderItemsCount(updatedOrder.orderItems.length);
                        }}
                       />
                    ))
                  ) : (
                    <span>No items in your cart</span> 
                  )}
                  {order && order.orderItems.length > 0 && (
                  
                  <MenuItem>
                      The total price is:₪{totalPrice}
                  </MenuItem>
                  
                )}

                

                {order && order.orderItems.length > 0 && (
                  
                  <MenuItem>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCheckoutView}
                      fullWidth
                    >
                      Proceed to checkout
                    </Button>
                  </MenuItem>
                  
                )}
          
            </Menu>

            {isAdmin && (
  <IconButton
    size="large"
    aria-label="account of current user"
    aria-controls="menu-appbar"
    aria-haspopup="true"
    onClick={handleAdminMenu}
    color="inherit"
    id="admin-button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="5 1 7 14"><path fill="currentColor" fill-rule="evenodd" d="m7.879 5l1.06-1.06l1.421-1.422a3.5 3.5 0 0 0-3.653 4.674l.326.897l-.675.674l-3.797 3.798a.621.621 0 1 0 .878.878l3.798-3.797l.674-.675l.897.325a3.5 3.5 0 0 0 4.674-3.653L12.06 7.062L11 8.12L9.94 7.06l-1-1zm6.173-1.93A5 5 0 0 1 15 6a5 5 0 0 1-6.703 4.703L4.5 14.5a2.121 2.121 0 0 1-3-3l3.797-3.797A5 5 0 0 1 13 2l-1.076 1.076l-.863.863L10 5l1 1l1.06-1.06l.864-.864L14 3z" clip-rule="evenodd"/></svg>
  </IconButton>
)}

<Menu
  id="admin-menu"
  anchorEl={anchorAdmin}  // Attach the Menu to the anchor element (the IconButton)
  anchorOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  keepMounted
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  open={Boolean(anchorAdmin)}  // Menu will open when anchorAdmin is not null
  onClose={handleAdminClose}  // Close the Menu when clicked outside
>
  <MenuItem onClick={handleGetAllUsers}>Get All Users</MenuItem>
  <MenuItem onClick={handleGetAllOrders}>Get All Orders</MenuItem>
  <MenuItem onClick={handleAddFabric}>Add Fabric</MenuItem>
</Menu>





            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenu}
              color="inherit"
              id="user-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m2 10a3 3 0 0 0-3 3a1 1 0 1 1-2 0a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5a1 1 0 1 1-2 0a3 3 0 0 0-3-3z"
                />
              </svg>
            </IconButton>
            <Menu
              id="cart-appbar"
              anchorEl={anchorProfile}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorProfile)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleViewProfile}>Profile</MenuItem>
              <MenuItem onClick={handleViewOrderView}>My Orders</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <input type="button" value="Login" onClick={handleLoginOpen} />
        )}
      </div>

      <Dialog open={openLogin} onClose={handleLoginClose} className="login-dialog">
      <DialogTitle className="dialog-title">Login</DialogTitle>
      <DialogContent className="dialog-content">
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dialog-input"
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dialog-input"
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleLoginClose} color="primary" className="dialog-button">
          Cancel
        </Button>
        <Button onClick={handleLoginSubmit} color="primary" className="dialog-button">
          Login
        </Button>
      </DialogActions>
      <DialogActions>
        <Typography variant="body2" color="textSecondary">
          Not registered yet?{' '}
          <Button onClick={handleRegisterRedirect} color="primary" size="small">
            Press here to register.
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
    </div>
  );
} 