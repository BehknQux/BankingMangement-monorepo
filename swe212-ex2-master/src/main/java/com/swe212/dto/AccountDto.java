package com.swe212.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
public class AccountDto {
    private Long id;
    private String branch;
    private BigDecimal balance;

    private Set<BasicCustomerDto> customers = new HashSet<>();
}