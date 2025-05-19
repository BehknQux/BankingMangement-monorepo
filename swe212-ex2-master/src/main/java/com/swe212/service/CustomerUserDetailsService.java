package com.swe212.service;

import com.swe212.model.Customer;
import com.swe212.repository.CustomerRepository;
import com.swe212.security.CustomerUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found: " + username));
        return new CustomerUserDetails(customer);
    }
}
