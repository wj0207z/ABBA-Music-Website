package com.abba.exception;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.abba.dto.ValidationErrorResponse;

@RestControllerAdvice
public class ApiExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
        MethodArgumentNotValidException exception
    ) {
        Map<String, List<String>> errors = new LinkedHashMap<>();

            for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
                String field = fieldError.getField();

                if (!errors.containsKey(field)) {
                    errors.put(field, new ArrayList<>());
                }

                errors.get(field).add(fieldError.getDefaultMessage());
            }

        ValidationErrorResponse response = new ValidationErrorResponse(
            "Validation failed",
            errors
        );

        return ResponseEntity.status(422).body(response);
    }
}
