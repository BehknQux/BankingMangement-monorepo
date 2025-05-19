package com.swe212.controller.api;

import com.swe212.dto.CustomerCreateDto;
import com.swe212.dto.CustomerDto;
import com.swe212.dto.CustomerUpdateDto;
import com.swe212.service.CustomerManagementService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerManagementService customerService;

    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerCreateDto customerCreateDto) {
        CustomerDto createdCustomer = customerService.createCustomer(customerCreateDto);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long id,
                                                      @Valid @RequestBody CustomerUpdateDto customerUpdateDto) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, customerUpdateDto);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Successfully deleted");
    }

    @GetMapping
    public ResponseEntity<Page<CustomerDto>> getAllCustomers(
            @RequestParam(defaultValue = "0") @Min(value = 0, message = "page must be at least 0") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "size must be at least 1")
            @Max(value = 20, message = "size must not exceed 20") int size,
            @RequestParam(defaultValue = "id")
            @Pattern(regexp = "id|name|address|city", message = "sortBy must be one of: id, name, address, city") String sortBy,
            @RequestParam(defaultValue = "asc")
            @Pattern(regexp = "asc|desc", message = "sortDir must be one of: asc, desc") String sortDir) {
        Page<CustomerDto> customers = customerService.getAllCustomers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(customers);
    }
}