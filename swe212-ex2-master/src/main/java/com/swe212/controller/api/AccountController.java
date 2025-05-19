package com.swe212.controller.api;

import com.swe212.dto.AccountCreateDto;
import com.swe212.dto.AccountDto;
import com.swe212.dto.AccountUpdateDto;
import com.swe212.service.AccountManagementService;
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
@RequestMapping("/api/v1/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountManagementService accountService;

    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@Valid @RequestBody AccountCreateDto accountCreateDto) {
        AccountDto createdAccount = accountService.createAccount(accountCreateDto);
        return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDto> updateAccount(
            @PathVariable Long id, @Valid @RequestBody AccountUpdateDto accountUpdateDto) {
        AccountDto updatedAccount = accountService.updateAccount(id, accountUpdateDto);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Successfully deleted");
    }

    @PostMapping("/{accountId}/link/{customerId}")
    public ResponseEntity<String> linkAccountToCustomer(
            @PathVariable Long accountId,
            @PathVariable Long customerId) {
        accountService.linkAccountToCustomer(accountId, customerId);
        return ResponseEntity.ok("Successfully linked account from customer");
    }

    @DeleteMapping("/{accountId}/unlink/{customerId}")
    public ResponseEntity<String> unlinkAccountFromCustomer(
            @PathVariable Long accountId,
            @PathVariable Long customerId) {
        accountService.unlinkAccountFromCustomer(accountId, customerId);
        return ResponseEntity.ok("Successfully unlinked account from customer");
    }

    @GetMapping
    public ResponseEntity<Page<AccountDto>> getAllAccounts(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "page must be at least 0") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "size must be at least 1")
            @Max(value = 20, message = "size must not exceed 20") int size,
            @RequestParam(defaultValue = "id")
            @Pattern(regexp = "id|branch|balance", message = "sortBy must be one of: id, branch, balance") String sortBy,
            @RequestParam(defaultValue = "asc")
            @Pattern(regexp = "asc|desc", message = "sortDir must be one of: asc, desc") String sortDir) {
        Page<AccountDto> accounts = accountService.getAllAccounts(page, size, sortBy, sortDir);
        return ResponseEntity.ok(accounts);
    }
}