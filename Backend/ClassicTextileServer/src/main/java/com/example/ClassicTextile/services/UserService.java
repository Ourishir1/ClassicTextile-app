package com.example.ClassicTextile.services;

import com.example.ClassicTextile.exceptions.*;
import com.example.ClassicTextile.modules.Fabric;
import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.OrderItem;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import com.example.ClassicTextile.modules.enums.TypeOfCustomer;
import com.example.ClassicTextile.repositories.FabricRepo;
import com.example.ClassicTextile.repositories.OrderItemRepo;
import com.example.ClassicTextile.repositories.OrderRepo;
import com.example.ClassicTextile.repositories.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


@Service("userService")
public class UserService {
        protected PasswordEncoder passwordEncoder;
        protected UserRepo userRepo;
        protected OrderRepo orderRepo;
        protected OrderItemRepo orderItemRepo;
        protected FabricRepo fabricRepo;


    public UserService(PasswordEncoder passwordEncoder, UserRepo userRepo, OrderRepo orderRepo, OrderItemRepo orderItemRepo, FabricRepo fabricRepo) {
        this.passwordEncoder = passwordEncoder;
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.fabricRepo = fabricRepo;
    }

    public User login(String email, String rawPassword) throws PasswordIsIncorrectException, UserNotFoundException {
    // Find the user by email
    if (userRepo.existsByEmail(email)) {
        User user = userRepo.findByEmail(email);
        // Check if the raw password matches the encoded password
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            return user;
        } else
            throw new PasswordIsIncorrectException("Wrong Password");
    } else
        throw new UserNotFoundException("User was not found");
}
    //User CRUD
    public void createUser(User user) throws EmailAlreadyExistException, PhoneNumberAlreadyExists {
        // Check if the email is already in use
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistException("Email already exists");
        }
        if(userRepo.existsByPhoneNumber(user.getPhoneNumber())){
            throw new PhoneNumberAlreadyExists("Phone number already in use");
        }

        //Hash the password before saving it
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
    }
    public User updateUser(User user) throws UserNotFoundException, EmailAlreadyExistException {
        // Fetch existing user from the database
        User existingUser = userRepo.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if the new email already exists for another user
        if (userRepo.existsByEmail(user.getEmail()) && !existingUser.getEmail().equals(user.getEmail())) {
            throw new EmailAlreadyExistException("Email already exists");
        }

        // Update user's personal details
        existingUser.setEmail(user.getEmail());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setIsAdmin(user.getIsAdmin());

        if(!user.getTypeOfCustomer().toString().equals(TypeOfCustomer.REGULAR.toString()))
        existingUser.setTypeOfCustomer(TypeOfCustomer.REGULAR);
        else
            existingUser.setTypeOfCustomer(TypeOfCustomer.DESIGNER);

        // Handle password update
        String newPassword = user.getPassword();
        if (newPassword != null && !newPassword.isBlank()) {
            // Check if the new password matches the existing hashed password
            if (!newPassword.equals(existingUser.getPassword())){
                // Encode and update only if the new password is different
                existingUser.setPassword(passwordEncoder.encode(newPassword));
            }
        }

        // Save the updated user to the database
        return userRepo.save(existingUser);
    }

    public void deleteUser(int userId) throws UserNotFoundException {
        // Check if the user exists
        if (!userRepo.existsById(userId)){
            throw new UserNotFoundException("User not found");
        }
        userRepo.deleteById(userId);
    }
    public User getUserById(int id){
        return userRepo.findById(id).orElseThrow(()->new UsernameNotFoundException("couldn't find user"));
    }
    //CART CRUD

    /**
     * Creates or updates a shopping cart for the user by adding an order item.
     *
     * <p>If the user already has an active order (cart), the item is added to it,
     * and the total price is recalculated. If no active order exists, a new order
     * is created with the provided item. This method also checks if the quantity
     * of the item is valid before proceeding.
     *
     * @param fabricId The item to be added to the cart.
     * @param userId The ID of the user for whom the cart is created or updated.
     * @param quantity The quantity of the item being added
     * @throws QuantityCannotBeZeroException if the quantity of the order item is zero.
     */
    public void createCart(int fabricId,int quantity, int userId) throws QuantityCannotBeZeroException, FabricAlreadyInCartException, FabricWasNotFoundException {
        User user= getUserById(userId);
        Fabric fabric=fabricRepo.findById(fabricId).orElseThrow(()->new FabricWasNotFoundException("Fabric was not found"));
        LocalDate currentDate = LocalDate.now();
        if(quantity<=0){
            throw new QuantityCannotBeZeroException("Quantity can't be zero");
        }
        OrderItem orderItem =new OrderItem(fabric,quantity);
        // Check if the user already has an active order

//        Optional<Order> existingOrder = user.getOrders().stream()
//                .filter(order -> order.getOrderStatus()==OrderStatus.PENDING) // Assuming you have a flag to indicate if the order is completed
//                .findFirst();
        Order pendingOrder=getPendingOrder(user.getId());
        if (pendingOrder!=null) {
            // Check if the fabric is already in the pending order
            for (OrderItem existingItem : pendingOrder.getOrderItems()) {
                // Ensure you compare the correct IDs
                if (existingItem.getFabric().getId()==(orderItem.getFabric().getId())) {
                    throw new FabricAlreadyInCartException("This fabric is already in the cart.");
                }
            }
            // If an existing cart is found, add the item to it
            pendingOrder.getOrderItems().add(orderItem);
            orderItem.setOrder(pendingOrder);
            orderItem.setPrice(orderItem.getFabric().getPrice()*orderItem.getQuantity());
            //Calculate the sum of the orders
            double sum=0;
            for(OrderItem item:pendingOrder.getOrderItems()){
                sum+=item.getPrice();
            }
            pendingOrder.setTotalPrice(sum);
            orderRepo.save(pendingOrder);
            orderItemRepo.save(orderItem);
        } else {
            // If there is no existing cart is found, create a new one
            List<OrderItem> orderItems = new ArrayList<>();
            orderItems.add(orderItem);
            Order newOrder = new Order(user, currentDate, orderItems);
            orderItem.setOrder(newOrder);
            orderItem.setPrice(orderItem.getFabric().getPrice()*orderItem.getQuantity());
            newOrder.setTotalPrice(orderItem.getPrice());
            orderRepo.save(newOrder);
            orderItemRepo.save(orderItem);
        }
    }

  public OrderItem getOneOrderItem(int id) throws OrderItemNotFoundException {
        return orderItemRepo.findById(id).orElseThrow(()->new OrderItemNotFoundException("Item not found"));
  }
  //this method want meant to update the quantity of the order and the price
  public void updateOrderItemQuantity(OrderItem newOrderItem) throws OrderItemNotFoundException {
       OrderItem oldOrderItem = getOneOrderItem(newOrderItem.getId());
       newOrderItem.setOrder(oldOrderItem.getOrder());
       newOrderItem.setPrice(newOrderItem.getFabric().getPrice()*newOrderItem.getQuantity());
       Order order=oldOrderItem.getOrder();
       order.setTotalPrice(order.getTotalPrice()-oldOrderItem.getPrice()+newOrderItem.getPrice());
       orderRepo.save(order);//update the new price
        orderItemRepo.save(newOrderItem);
  }


    @Transactional
    public void deleteOrderItemByFabricId(User user, int fabricId) throws OrderNotFoundException {
        Order order = getPendingOrder(user.getId());
        if (order == null) {
            throw new OrderNotFoundException("No pending order found for the user.");
        }
        // Use an iterator to safely remove the item while iterating
        Iterator<OrderItem> iterator = order.getOrderItems().iterator();
        double orderItemPrice = 0;
        int orderItemId=0;
        while (iterator.hasNext()) {
            OrderItem item = iterator.next();
            // Checks if itemId matches given id
            if (item.getFabric().getId() == fabricId) {
                orderItemPrice=item.getPrice();
                orderItemId=item.getId();
                iterator.remove(); //removes the item
                break; // Exit the loop after removing the item
            }
        }
        order.setTotalPrice(order.getTotalPrice()-orderItemPrice);
        orderItemRepo.deleteById(orderItemId);

    }

    public void deleteOrderItem(int id) throws OrderItemNotFoundException, OrderNotFoundException {
        OrderItem orderItem=getOneOrderItem(id);
        Order order=getOneOrder(orderItem.getOrder().getId());
        order.setTotalPrice(order.getTotalPrice()-orderItem.getPrice());
        orderRepo.save(order);
        orderItemRepo.deleteById(id);
    }




        /**
         * Retrieves the user's pending order from the repository.
         *
         * <p>This method uses the {@code orderRepo} to find and return an order
         * with a {@code PENDING} status for the given user. If no such order exists,
         * it will return {@code null}.
         *
         * @param userId The id user whose pending order is being retrieved.
         * @return The pending order for the user, or {@code null} if no pending order is found.
         */
    public Order getPendingOrder(int userId){
        return orderRepo.findOrderByUserIdAndOrderStatus(userId,OrderStatus.PENDING);
    }
    public Order getOneOrder(int orderId) throws OrderNotFoundException {
        return orderRepo.findById(orderId).orElseThrow(()->new OrderNotFoundException("Order was not found"));
    }
    public List<Order> getMyOrders(User user){
        return orderRepo.findOrdersByUser(user);
    }

    public void makePurchase(Order order) throws ShippingAdressCannotBeNullException, OrderNotFoundException {
        System.out.println(order.getShippingAddress());
        if (order.getShippingAddress()==null || order.getShippingAddress().isEmpty()) {
            throw new ShippingAdressCannotBeNullException("Shipping address not found");
        }
        Order existingOrder=getOneOrder(order.getId());
        existingOrder.setOrderStatus(OrderStatus.IN_PROCESS);
        existingOrder.setShippingAddress(order.getShippingAddress());
        orderRepo.save(existingOrder);


    }



}
