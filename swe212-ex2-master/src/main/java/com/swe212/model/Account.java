package com.swe212.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private BigDecimal balance;

    @ManyToMany(mappedBy = "accounts", fetch = FetchType.EAGER)
    private Set<Customer> customers = new HashSet<>();

    @OneToMany(mappedBy = "fromAccount", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Depositor> fromDepositors = new HashSet<>();

    @OneToMany(mappedBy = "toAccount", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Depositor> toDepositors = new HashSet<>();
}