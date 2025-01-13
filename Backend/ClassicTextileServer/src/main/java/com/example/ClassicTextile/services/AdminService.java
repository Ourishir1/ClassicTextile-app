package com.example.ClassicTextile.services;

import com.example.ClassicTextile.exceptions.*;
import com.example.ClassicTextile.modules.Fabric;
import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.OrderItem;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import com.example.ClassicTextile.modules.enums.Category;
import com.example.ClassicTextile.repositories.FabricRepo;
import com.example.ClassicTextile.repositories.OrderItemRepo;
import com.example.ClassicTextile.repositories.OrderRepo;
import com.example.ClassicTextile.repositories.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService extends UserService {


    public AdminService(PasswordEncoder passwordEncoder, UserRepo userRepo, OrderRepo orderRepo, OrderItemRepo orderItemRepo, FabricRepo fabricRepo) {
        super(passwordEncoder, userRepo, orderRepo, orderItemRepo, fabricRepo);
    }

    @Override
    public User login(String email, String password) throws UserNotFoundException, PasswordIsIncorrectException {
        return super.login(email, password);
    }

    @Override
    public void createUser(User user) throws EmailAlreadyExistException, PhoneNumberAlreadyExists {
        super.createUser(user);
    }

    @Override
    public User updateUser(User user) throws UserNotFoundException, EmailAlreadyExistException {
        return super.updateUser(user);
    }

    @Override
    public void deleteUser(int userId) throws UserNotFoundException {
        super.deleteUser(userId);
    }

    @Override
    public User getUserById(int id) {
        return super.getUserById(id);
    }

    @Override
    public void createCart(int fabricId, int quantity, int userId) throws QuantityCannotBeZeroException, FabricAlreadyInCartException, FabricWasNotFoundException {
        super.createCart(fabricId, quantity, userId);
    }

    @Override
    public OrderItem getOneOrderItem(int id) throws OrderItemNotFoundException {
        return super.getOneOrderItem(id);
    }




    @Override
    public void deleteOrderItemByFabricId(User user, int fabricId) throws OrderNotFoundException {
        super.deleteOrderItemByFabricId(user, fabricId);
    }

    @Override
    public Order getPendingOrder(int userId) {
        return super.getPendingOrder(userId);
    }

    @Override
    public Order getOneOrder(int orderId) throws OrderNotFoundException {
        return super.getOneOrder(orderId);
    }


    @Override
    public List<Order> getMyOrders(User user) {
        return super.getMyOrders(user);
    }

    @Override
    public void makePurchase(Order order) throws ShippingAdressCannotBeNullException, OrderNotFoundException {
        super.makePurchase(order);
    }

    //Fabric CRUD
    public void addFabric(Fabric fabric){
        fabricRepo.save(fabric);
    }
    public void updateFabric(Fabric fabric){
        fabricRepo.save(fabric);
    }
    public Fabric getOneFabric(int fabricId) throws FabricWasNotFoundException {
        return fabricRepo.findById(fabricId).orElseThrow(()->new FabricWasNotFoundException("Couldn't find the fabric"));

    }

    //Just For the project
    // This method disconnects the fabric from orderItem and lets me delete the item
    // (what I will do in the actual project is to update the fabric to OUT_OF_STOCK)
    public void deleteOneFabric(int fabricId)  {
        List<OrderItem> orderItems= orderItemRepo.findOrderItemByFabricId(fabricId);
        System.out.println(orderItems);
        for (OrderItem orderItem: orderItems){
            orderItem.setFabric(null); // Set fabric reference to null
            orderItemRepo.save(orderItem);
        }
        fabricRepo.deleteById(fabricId);
    }
    public List<Fabric> getAllFabrics(){
        return fabricRepo.findAll();
    }
    public List<Fabric> getFabricByCategory(Category category){
        return fabricRepo.findFabricsByCategory(category);
    }

    //Order management
    public List<Order> getAllOrders(){
        return orderRepo.findAll();
    }
    public List<Order> getAllPendingOrders(){
        return orderRepo.findOrdersByOrderStatus(OrderStatus.PENDING);
    }

    //Users management
    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    public void updateOrder(int orderId,OrderStatus orderStatus) throws OrderNotFoundException {
        Order order = getOneOrder(orderId);
        order.setOrderStatus(orderStatus);
        orderRepo.save(order);
    }



}

