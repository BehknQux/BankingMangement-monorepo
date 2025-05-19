package com.swe212.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BasicAccountDto {
    private Long id;
    private String branch;
    private BigDecimal balance;
}
