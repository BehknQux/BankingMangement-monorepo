package com.swe212.service;

import com.swe212.dto.DepositRequestDto;
import com.swe212.dto.DepositDto;
import com.swe212.exception.AccountNotFoundException;
import com.swe212.exception.InsufficientBalanceException;
import com.swe212.model.Account;
import com.swe212.model.Depositor;
import com.swe212.repository.AccountRepository;
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
import java.time.LocalDateTime;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DepositService {

    private final DepositorRepository depositorRepository;
    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;


    public void transfer(DepositRequestDto depositRequestDto) {
        log.debug("Transferring amount: {}", depositRequestDto);

        Account fromAccount = accountRepository.findById(depositRequestDto.getFromAccountId())
                .orElseThrow(() -> new AccountNotFoundException("From account not found"));

        Account toAccount = accountRepository.findById(depositRequestDto.getToAccountId())
                .orElseThrow(() -> new AccountNotFoundException("To account not found"));

        if (fromAccount.getBalance().compareTo(depositRequestDto.getAmount()) < 0)
            throw new InsufficientBalanceException("Insufficient balance in the from account");

        fromAccount.setBalance(fromAccount.getBalance().subtract(depositRequestDto.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(depositRequestDto.getAmount()));

        Depositor depositor = Depositor.builder()
                .fromAccount(fromAccount)
                .toAccount(toAccount)
                .date(LocalDateTime.now())
                .amount(depositRequestDto.getAmount())
                .transactionType("TRANSFER")
                .build();

        Depositor savedDepositor = depositorRepository.save(depositor);
        log.debug("Transfer completed: depositorId {}", savedDepositor.getId());
    }


    public Page<DepositDto> getAllDepositors(int page, int size, String sortBy, String sortDir) {
        log.debug("Getting all depositors: page {}, size {}, sortBy {}, sortDir {}", page, size, sortBy, sortDir);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Depositor> depositorPage = depositorRepository.findAll(pageable);

        log.debug("Found {} depositors", depositorPage.getTotalElements());
        return depositorPage.map(depositor -> modelMapper.map(depositor, DepositDto.class));
    }
}