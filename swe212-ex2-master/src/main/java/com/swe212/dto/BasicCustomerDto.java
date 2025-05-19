package com.swe212.dto;

import lombok.Data;

@Data
public class BasicCustomerDto {
    private Long id;
    private String name;
    private String address;
    private String city;
}
