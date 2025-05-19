package com.swe212.controller.api;

import com.swe212.dto.DepositRequestDto;
import com.swe212.dto.DepositDto;
import com.swe212.service.DepositService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/deposits")
@CrossOrigin(origins = "*")
public class DepositController {

    private final DepositService depositService;

    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(@RequestBody DepositRequestDto depositRequestDto) {
        depositService.transfer(depositRequestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<DepositDto>> getAllDepositors(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "page must be at least 0") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "size must be at least 1")
            @Max(value = 20, message = "size must not exceed 20") int size,
            @RequestParam(defaultValue = "id")
            @Pattern(regexp = "id|date|amount|transactionType", message = "sortBy must be one of: id, date, amount, transactionType") String sortBy,
            @RequestParam(defaultValue = "asc")
            @Pattern(regexp = "asc|desc", message = "sortDir must be one of: asc, desc") String sortDir) {
        Page<DepositDto> depositors = depositService.getAllDepositors(page, size, sortBy, sortDir);
        return ResponseEntity.ok(depositors);
    }
}