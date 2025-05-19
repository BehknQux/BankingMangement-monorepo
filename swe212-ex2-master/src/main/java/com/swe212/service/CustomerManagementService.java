package com.swe212.service;

import com.swe212.dto.CustomerCreateDto;
import com.swe212.dto.CustomerDto;
import com.swe212.dto.CustomerUpdateDto;
import com.swe212.exception.CustomerNotFoundException;
import com.swe212.model.Customer;
import com.swe212.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerManagementService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CustomerDto createCustomer(CustomerCreateDto customerCreateDto) {
        log.debug("Creating customer {}", customerCreateDto);

        Customer customer = modelMapper.map(customerCreateDto, Customer.class);
        // Encode password before saving
        customer.setPassword(passwordEncoder.encode(customerCreateDto.getPassword()));
        Customer savedCustomer = customerRepository.save(customer);
        CustomerDto savedCustomerDto = modelMapper.map(savedCustomer, CustomerDto.class);

        log.debug("Saved customer {}", savedCustomerDto);
        return savedCustomerDto;
    }

    @Transactional
    public CustomerDto updateCustomer(Long id, CustomerUpdateDto customerUpdateDto) {
        log.debug("Updating customer {}, {}", id, customerUpdateDto);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));

        modelMapper.map(customerUpdateDto, customer);
        
        // Only update password if it's provided
        if (customerUpdateDto.getPassword() != null && !customerUpdateDto.getPassword().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(customerUpdateDto.getPassword()));
        }

        Customer updatedCustomer = customerRepository.save(customer);
        CustomerDto customerDto = modelMapper.map(updatedCustomer, CustomerDto.class);

        log.debug("Updated customer {}", customerDto);
        return customerDto;
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        log.debug("Getting customer by id {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
        return modelMapper.map(customer, CustomerDto.class);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        log.debug("Deleting customer {}", id);

        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
        log.debug("Deleted customer {}", id);
    }

    @Transactional(readOnly = true)
    public Page<CustomerDto> getAllCustomers(int page, int size, String sortBy, String sortDir) {
        log.debug("Getting all customers: page {}, size {}, sortBy {}, sortDir {}", page, size, sortBy, sortDir);

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        Page<Customer> customerPage = customerRepository.findAll(pageRequest);

        log.debug("Found {} customers", customerPage.getTotalElements());
        return customerPage.map(customer -> modelMapper.map(customer, CustomerDto.class));
    }
}