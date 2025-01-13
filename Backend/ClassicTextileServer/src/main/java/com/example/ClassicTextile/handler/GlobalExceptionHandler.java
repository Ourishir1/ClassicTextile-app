package com.example.ClassicTextile.handler;

import com.example.ClassicTextile.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle UserNotFoundException.
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /**
     * Handle PasswordIsIncorrectException.
     */
    @ExceptionHandler(PasswordIsIncorrectException.class)
    public ResponseEntity<Object> handlePasswordIsIncorrectException(PasswordIsIncorrectException ex) {
        return buildResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    /**
     * Handle EmailAlreadyExistException.
     */
    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<Object> handleEmailAlreadyExistException(EmailAlreadyExistException ex) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex.getMessage());
    }

    /**
     * Handle PhoneNumberAlreadyExists.
     */
    @ExceptionHandler(PhoneNumberAlreadyExists.class)
    public ResponseEntity<Object> handlePhoneNumberAlreadyExists(PhoneNumberAlreadyExists ex) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex.getMessage());
    }

    /**
     * Handle FabricWasNotFoundException.
     */
    @ExceptionHandler(FabricWasNotFoundException.class)
    public ResponseEntity<Object> handleFabricWasNotFoundException(FabricWasNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /**
     * Handle QuantityCannotBeZeroException.
     */
    @ExceptionHandler(QuantityCannotBeZeroException.class)
    public ResponseEntity<Object> handleQuantityCannotBeZeroException(QuantityCannotBeZeroException ex) {
        return buildResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Handle FabricAlreadyInCartException.
     */
    @ExceptionHandler(FabricAlreadyInCartException.class)
    public ResponseEntity<Object> handleFabricAlreadyInCartException(FabricAlreadyInCartException ex) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex.getMessage());
    }

    /**
     * Handle OrderNotFoundException.
     */
    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<Object> handleOrderNotFoundException(OrderNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /**
     * Handle generic exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + ex.getMessage());
    }

    /**
     * Utility method to build a structured response entity.
     */
    private ResponseEntity<Object> buildResponseEntity(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return new ResponseEntity<>(body, status);
    }
}
