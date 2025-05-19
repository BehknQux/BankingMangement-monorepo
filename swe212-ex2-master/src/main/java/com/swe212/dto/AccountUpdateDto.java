package com.swe212.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountUpdateDto {
    @NotBlank(message = "Branch is mandatory")
    private String branch;

    @PositiveOrZero(message = "Balance must be positive or zero")
    private BigDecimal balance;
}