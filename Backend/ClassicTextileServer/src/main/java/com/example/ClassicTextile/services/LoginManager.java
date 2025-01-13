package com.example.ClassicTextile.services;

import com.example.ClassicTextile.exceptions.PasswordIsIncorrectException;
import com.example.ClassicTextile.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
public class LoginManager {


    @Autowired
    ApplicationContext ctx;

    public UserService getServiceForUser(String email,String password) throws UserNotFoundException, PasswordIsIncorrectException {
        UserService userService= (UserService) ctx.getBean("userService");
        if (userService.login(email,password).getIsAdmin()) {
            return ctx.getBean(AdminService.class);
        } else {
            return (UserService) ctx.getBean("userService");
        }
    }
}
