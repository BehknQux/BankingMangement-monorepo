package com.swe212.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Data
public class DepositRequestDto {
    @NotNull(message = "From account ID cannot be null and must be greater than 0")
    @Min(value = 1, message = "From account ID must be greater than 0")
    private Long fromAccountId;

    @NotNull(message = "To account ID cannot be null and must be greater than 0")
    @Min(value = 1, message = "To account ID must be greater than 0")
    private Long toAccountId;

    @NotNull(message = "Amount cannot be null and must be greater than or equal to 0")
    @Min(value = 0, message = "Amount must be greater than or equal to 0")
    private BigDecimal amount;
}