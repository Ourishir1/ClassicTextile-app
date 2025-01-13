package com.example.ClassicTextile.tests;

import com.example.ClassicTextile.exceptions.PasswordIsIncorrectException;
import com.example.ClassicTextile.exceptions.UserNotFoundException;
import com.example.ClassicTextile.services.AdminService;
import com.example.ClassicTextile.services.LoginManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MyTest implements CommandLineRunner {


    @Autowired
    LoginManager loginManager;


    @Override
    public void run(String... args) throws UserNotFoundException, PasswordIsIncorrectException {
                     // IF YOU WANT TO ADD NEW FABRICS TO YOUR DATABASE

//        Fabric fabric = new Fabric("Gucci",45,"112233",Color.MAGENTA,"this is crepe and satin fabric", TypeOfFabric.ARIG);
//        Fabric fabric2=new Fabric("Dior",200,"112233",Color.BLACK,"this is a very light satin and thin", TypeOfFabric.ARIG);
//        Fabric fabric3=new Fabric("Diamond Net",35,"112233",Color.RED,"a very shiny net with diamond crystals on it ", TypeOfFabric.MEHORAZ);
//        Fabric fabric4=new Fabric("Crystal",35,"112233",Color.CYAN,"this is strechy and satin ", TypeOfFabric.SARIG);
//            adminService.addFabric(fabric);
//            adminService.addFabric(fabric2);
//            adminService.addFabric(fabric3);
//            adminService.addFabric(fabric4);
//try {
    // MY FIRST TESTS

//            AdminService adminService=ctx.getBean(AdminService.class);
//            UserService userService= (UserService) ctx.getBean("userService");
//            User user= new User("david@gmail.com","2626262","david","blane","+9720526327402");
//            User user2= new User("ouri@gmail.com","123456","Ouri","Shirkani","+972059988726");
//            user2.setIsAdmin(true);
//            adminService.createUser(user);
//            adminService.createUser(user2);
//try {
//    User user3 = userService.login("ourI@gmail.com","121212");
//    System.out.println(user3);
//}catch (UserNotFoundException|PasswordIsIncorrectException e){
//            System.out.println(e.getMessage());
//}

    // TESTS START
//        System.out.println("//////////////////ADMIN TESTS///////////////////");
//    AdminService adminService = (AdminService) loginManager.getServiceForUser("ouri@gmail.com", "123456");
//    System.out.println("Admin Connected !");
//        adminService.createUser(new User("yaniv@gmail.com","112244","yaniv","cohen","+9720552299123"));
//        System.out.println("Admin added a user");
//        System.out.println("here is one user: "+ adminService.getUserById(1));
//        adminService.deleteUser(1);
//        System.out.println("Admin deleted user");
//        System.out.println("here are all users:"+ adminService.getAllUsers());
//        adminService.addFabric(new Fabric("velvet",35,"112233",Color.PINK,"its good for the winter  ", TypeOfFabric.SARIG));
//        System.out.println("Admin added a fabric");
//        System.out.println("here is one fabric: "+ adminService.getOneFabric(1));
//        adminService.deleteOneFabric(2); //Works
//        System.out.println("Admin deleted a fabric");
//        System.out.println("here are all if the fabrics:"+ adminService.getAllFabrics());
//        Fabric fabricUpdate =adminService.getOneFabric(2);
//        fabricUpdate.setPrice(45);
//        adminService.updateFabric(fabricUpdate);
//        System.out.println("Admin updated the fabric");
//        System.out.println("here are all pending orders: "+adminService.getAllPendingOrders());
//        System.out.println("here are all of the orders: "+adminService.getAllOrders());
//        System.out.println("//////////////////THE END OF ADMIN TESTS///////////////////");

//    System.out.println("//////////////////CUSTOMER TESTS///////////////////");
//        adminService.createUser(new User("davidblane@gmail.com","3432345","david","blane","050123234"));
//    UserService userService = loginManager.getServiceForUser("davidblane@gmail.com", "3432345");
//    System.out.println("User Connected");
//    User testingUser = userService.getUserById(3);
//        testingUser.setFirstName("Misha");
//        userService.updateUser(testingUser);
//        System.out.println("User has been updated");
//        userService.createCart(new OrderItem(adminService.getOneFabric(4), 2), testingUser.getId());
//        userService.createCart(new OrderItem(adminService.getOneFabric(9),4),testingUser.getId());
//        System.out.println(userService.getPendingOrder(testingUser));
//        System.out.println("Items Added to cart");
//        userService.deleteItemByFabricId(testingUser,8);
//        System.out.println("Item Removed From your cart");
//        System.out.println(userService.getPendingOrder(testingUser));
//        System.out.println("These are the items i have in my cart: "+ userService.getPendingOrder(testingUser));
//        Order purchaseOrder=userService.getPendingOrder(testingUser);
//        OrderItem orderItem= userService.getOneOrderItem(37);
//        orderItem.setQuantity(4);
//        System.out.println("Quantity was updated !");
//        userService.updateOrderItemQuantity(orderItem);
//        purchaseOrder.setShippingAddress("HOLON");
//        userService.makePurchase(purchaseOrder);
//        System.out.println("Purchase has been made");
//        System.out.println("These are all of my orders: "+userService.getMyOrders(testingUser));
//} catch (UserNotFoundException |
//         PasswordIsIncorrectException e) {
//    throw new RuntimeException(e.getMessage());
//} catch (OrderItemNotFoundException e) {
//    throw new RuntimeException(e);
//}

    }
}
