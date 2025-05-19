package com.swe212.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DepositDto {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private LocalDateTime date;
    private BigDecimal amount;
    private String transactionType;
}