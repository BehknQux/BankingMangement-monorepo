package com.swe212.service;

import com.swe212.dto.AccountCreateDto;
import com.swe212.dto.AccountDto;
import com.swe212.dto.AccountUpdateDto;
import com.swe212.exception.AccountNotFoundException;
import com.swe212.exception.CustomerNotFoundException;
import com.swe212.model.Account;
import com.swe212.model.Customer;
import com.swe212.model.Depositor;
import com.swe212.repository.AccountRepository;
import com.swe212.repository.CustomerRepository;
import com.swe212.repository.DepositorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;

@Slf4j
@Service

@Transactional
public class AccountManagementService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final DepositorRepository depositorRepository;
    private final ModelMapper modelMapper;

    public AccountManagementService(AccountRepository accountRepository, CustomerRepository customerRepository, DepositorRepository depositorRepository, ModelMapper modelMapper) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.depositorRepository = depositorRepository;
        this.modelMapper = modelMapper;
    }


    public AccountDto createAccount(AccountCreateDto accountCreateDto) {
        log.debug("Creating account {}", accountCreateDto);

        Customer customer = customerRepository.findById(accountCreateDto.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        Account account = modelMapper.map(accountCreateDto, Account.class);
        account.setCustomers(new HashSet<>());
        account.getCustomers().add(customer);

        customer.getAccounts().add(account);
        
        Account savedAccount = accountRepository.save(account);
        AccountDto savedAccountDto = modelMapper.map(savedAccount, AccountDto.class);

        log.debug("Saved account {}", savedAccountDto);
        return savedAccountDto;
    }


    public AccountDto updateAccount(Long id, AccountUpdateDto accountUpdateDto) {
        log.debug("Updating account {}, {}", id, accountUpdateDto);

        AccountDto accountDto = accountRepository.findById(id)
                .map(account -> {
                    modelMapper.map(accountUpdateDto, account);


                    Account updatedAccount = accountRepository.save(account);
                    return modelMapper.map(updatedAccount, AccountDto.class);
                })
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        log.debug("Updated account {}", accountDto);
        return accountDto;
    }


    public void deleteAccount(Long id) {
        log.debug("Deleting account {}", id);

        accountRepository.findById(id)
                .ifPresentOrElse(
                        account -> {
                            account.getCustomers()
                                    .forEach(customer -> customer.getAccounts().remove(account));

                            accountRepository.delete(account);
                            log.debug("Deleted account {}", id);
                        },
                        () -> {throw new AccountNotFoundException("Account with ID " + id + " not found");}
                );
    }


    public void linkAccountToCustomer(Long accountId, Long customerId) {
        log.debug("Linking account {} to customer {}", accountId, customerId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        if (account.getCustomers().contains(customer))
            throw new IllegalStateException("Account is already linked to the customer");

        account.getCustomers().add(customer);
        customer.getAccounts().add(account);

        log.debug("Linked account {} to customer {}", accountId, customerId);
    }


    public AccountDto getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return modelMapper.map(account, AccountDto.class);
    }


    public void unlinkAccountFromCustomer(Long accountId, Long customerId) {
        log.debug("Unlinking account {} from customer {}", accountId, customerId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        if (!account.getCustomers().contains(customer))
            throw new IllegalStateException("Account is not linked to the customer");


        account.getCustomers().remove(customer);
        customer.getAccounts().remove(account);

        log.debug("Unlinked account {} from customer {}", accountId, customerId);
    }


    public Page<AccountDto> getAllAccounts(int page, int size, String sortBy, String sortDir) {
        log.debug("Getting all accounts: page {}, size {}, sortBy {}, sortDir {}", page, size, sortBy, sortDir);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Account> accountPage = accountRepository.findAll(pageable);

        log.debug("Found {} accounts", accountPage.getTotalElements());
        return accountPage.map(account -> modelMapper.map(account, AccountDto.class));
    }
}