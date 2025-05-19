package com.swe212.dto;

import com.swe212.model.Role;
import lombok.Data;
import java.util.Set;

@Data
public class CustomerDto {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String password;
    private String profilePhotoUrl;
    private Role role;

    private Set<AccountDto> accounts;
}