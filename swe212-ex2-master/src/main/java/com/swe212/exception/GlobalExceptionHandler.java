package com.swe212.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            CustomerNotFoundException.class,
            AccountNotFoundException.class
    })
    public ModelAndView handleNotFoundException(Exception ex, RedirectAttributes redirectAttributes) {
        ModelAndView mav = new ModelAndView();
        redirectAttributes.addFlashAttribute("error", ex.getMessage());
        mav.setViewName("redirect:/");
        mav.setStatus(HttpStatus.NOT_FOUND);
        return mav;
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Object> handleBadRequestException(Exception ex, WebRequest request) {
        log.error(ex.getMessage(), ex);

        Map<String, Object> body = createResponseBody(HttpStatus.BAD_REQUEST, ex.getMessage(), request);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        log.error("MethodArgumentNotValidException: {}", ex.getMessage(), ex);

        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        Map<String, Object> body = createResponseBody(HttpStatus.BAD_REQUEST, errors, request);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Object> handleMethodValidationExceptions(HandlerMethodValidationException ex, WebRequest request) {
        log.error("HandlerMethodValidationException: {}", ex.getMessage(), ex);

        String errors = ex.getAllErrors()
                .stream()
                .map(error -> {
                    if (error instanceof FieldError) {
                        return ((FieldError) error).getField() + ": " + error.getDefaultMessage();
                    }
                    return error.getDefaultMessage();
                })
                .collect(Collectors.joining(", "));

        Map<String, Object> body = createResponseBody(HttpStatus.BAD_REQUEST, errors, request);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception ex, RedirectAttributes redirectAttributes) {
        ModelAndView mav = new ModelAndView();

        // Set error message
        String errorMessage = ex.getMessage();
        if (errorMessage == null || errorMessage.isBlank()) {
            errorMessage = "An unexpected error occurred";
        }

        // Add error message to flash attributes
        redirectAttributes.addFlashAttribute("error", errorMessage);

        // Redirect back to the previous page
        mav.setViewName("redirect:/");
        mav.setStatus(HttpStatus.BAD_REQUEST);

        return mav;
    }

    private Map<String, Object> createResponseBody(HttpStatus status, String message, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return body;
    }
}