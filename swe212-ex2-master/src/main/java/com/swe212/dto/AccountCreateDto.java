package com.swe212.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Data
public class AccountCreateDto {
    @NotBlank(message = "Branch is mandatory")
    private String branch;

    @NotNull(message = "Balance is mandatory")
    @PositiveOrZero(message = "Balance must be positive or zero")
    private BigDecimal balance;

    @NotNull(message = "Customer ID is mandatory")
    private Long customerId;
}