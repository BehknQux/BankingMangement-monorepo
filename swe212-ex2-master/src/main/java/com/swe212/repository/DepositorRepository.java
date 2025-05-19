package com.swe212.repository;

import com.swe212.model.Depositor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepositorRepository extends JpaRepository<Depositor, Long> {
}