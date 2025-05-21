package com.swe212.config;

import com.swe212.model.Account;
import com.swe212.model.Customer;
import com.swe212.model.Depositor;
import com.swe212.model.Role;
import com.swe212.repository.AccountRepository;
import com.swe212.repository.CustomerRepository;
import com.swe212.repository.DepositorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(CustomerRepository customerRepository,
                                   AccountRepository accountRepository,
                                   DepositorRepository depositorRepository) {
        return args -> {

            if (customerRepository.count() == 0) {
                log.info("Creating fake data...");

                Customer customer1 = Customer.builder()
                        .name("emir12345")
                        .address("123 Sokak Merkez Mahallesi")
                        .city("İstanbul")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("emir12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg")
                        .role(Role.ADMIN)
                        .build();

                Customer customer2 = Customer.builder()
                        .name("hamza12345")
                        .address("456 Cadde Elveda sokak")
                        .city("Ankara")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("hamza12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer3 = Customer.builder()
                        .name("kerem12345")
                        .address("789 Bulvar Küçük Çamlıca")
                        .city("İzmir")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("kerem12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer4 = Customer.builder()
                        .name("ayse12345")
                        .address("Cemil Meriç Sokak No:4")
                        .city("Bursa")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("ayse12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer5 = Customer.builder()
                        .name("fatma12345")
                        .address("Barbaros Bulvarı No:18")
                        .city("İstanbul")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("fatma12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer6 = Customer.builder()
                        .name("ahmet12345")
                        .address("Kazım Karabekir Caddesi No:22")
                        .city("Ankara")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("ahmet12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer7 = Customer.builder()
                        .name("mehmet12345")
                        .address("İnönü Mahallesi 56. Sokak")
                        .city("İzmir")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("mehmet12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/26863924/pexels-photo-26863924.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer8 = Customer.builder()
                        .name("zeynep12345")
                        .address("Yıldız Mahallesi No:88")
                        .city("Antalya")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("zeynep12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer9 = Customer.builder()
                        .name("mustafa12345")
                        .address("Ulus Caddesi No:19")
                        .city("Adana")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("mustafa12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer10 = Customer.builder()
                        .name("elif12345")
                        .address("Selçuklu Mahallesi")
                        .city("Konya")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("elif12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer11 = Customer.builder()
                        .name("burak12345")
                        .address("Demokrasi Caddesi No:7")
                        .city("Eskişehir")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("burak12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg")
                        .role(Role.USER)
                        .build();

                Customer customer12 = Customer.builder()
                        .name("meryem12345")
                        .address("Fatih Mahallesi")
                        .city("Samsun")
                        .accounts(new HashSet<>())
                        .password(passwordEncoder.encode("meryem12345"))
                        .profilePhotoUrl("https://images.pexels.com/photos/29047854/pexels-photo-29047854.jpeg")
                        .role(Role.USER)
                        .build();


                Account account1 = Account.builder().branch("Merkez Şube").balance(new BigDecimal("1000.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account2 = Account.builder().branch("Batı Şube").balance(new BigDecimal("2500.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account3 = Account.builder().branch("Doğu Şube").balance(new BigDecimal("500.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account4 = Account.builder().branch("Kuzey Şube").balance(new BigDecimal("3000.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account5 = Account.builder().branch("Güney Şube").balance(new BigDecimal("4000.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account6 = Account.builder().branch("Anadolu Şube").balance(new BigDecimal("800.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account7 = Account.builder().branch("Avrupa Şube").balance(new BigDecimal("2200.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account8 = Account.builder().branch("Yenişehir Şube").balance(new BigDecimal("1400.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account9 = Account.builder().branch("Çankaya Şube").balance(new BigDecimal("1700.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account10 = Account.builder().branch("Kadıköy Şube").balance(new BigDecimal("1200.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account11 = Account.builder().branch("Beşiktaş Şube").balance(new BigDecimal("3300.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account12 = Account.builder().branch("Karşıyaka Şube").balance(new BigDecimal("2100.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account13 = Account.builder().branch("Bornova Şube").balance(new BigDecimal("1600.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account14 = Account.builder().branch("Şişli Şube").balance(new BigDecimal("900.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();
                Account account15 = Account.builder().branch("Bakırköy Şube").balance(new BigDecimal("2900.00")).customers(new HashSet<>()).fromDepositors(new HashSet<>()).toDepositors(new HashSet<>()).build();

                customer1.getAccounts().add(account1);
                customer2.getAccounts().add(account2);
                customer3.getAccounts().add(account3);
                customer4.getAccounts().add(account4);
                customer5.getAccounts().add(account5);
                customer6.getAccounts().add(account6);
                customer7.getAccounts().add(account7);
                customer8.getAccounts().add(account8);
                customer9.getAccounts().add(account9);
                customer10.getAccounts().add(account10);
                customer11.getAccounts().add(account11);
                customer12.getAccounts().add(account12);

                account1.getCustomers().add(customer1);
                account2.getCustomers().add(customer2);
                account3.getCustomers().add(customer3);
                account4.getCustomers().add(customer4);
                account5.getCustomers().add(customer5);
                account6.getCustomers().add(customer6);
                account7.getCustomers().add(customer7);
                account8.getCustomers().add(customer8);
                account9.getCustomers().add(customer9);
                account10.getCustomers().add(customer10);
                account11.getCustomers().add(customer11);
                account12.getCustomers().add(customer12);


                Depositor deposit1 = Depositor.builder()
                        .fromAccount(account1)
                        .toAccount(account2)
                        .date(LocalDateTime.now().minusDays(1))
                        .amount(new BigDecimal("200.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit2 = Depositor.builder()
                        .fromAccount(account2)
                        .toAccount(account3)
                        .date(LocalDateTime.now().minusHours(5))
                        .amount(new BigDecimal("150.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit3 = Depositor.builder()
                        .fromAccount(account3)
                        .toAccount(account1)
                        .date(LocalDateTime.now().minusHours(2))
                        .amount(new BigDecimal("50.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit4 = Depositor.builder()
                        .fromAccount(account4)
                        .toAccount(account5)
                        .date(LocalDateTime.now().minusDays(3))
                        .amount(new BigDecimal("300.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit5 = Depositor.builder()
                        .fromAccount(account5)
                        .toAccount(account6)
                        .date(LocalDateTime.now().minusDays(2))
                        .amount(new BigDecimal("100.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit6 = Depositor.builder()
                        .fromAccount(account6)
                        .toAccount(account7)
                        .date(LocalDateTime.now().minusHours(10))
                        .amount(new BigDecimal("80.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit7 = Depositor.builder()
                        .fromAccount(account7)
                        .toAccount(account8)
                        .date(LocalDateTime.now().minusHours(6))
                        .amount(new BigDecimal("120.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit8 = Depositor.builder()
                        .fromAccount(account8)
                        .toAccount(account9)
                        .date(LocalDateTime.now().minusHours(3))
                        .amount(new BigDecimal("60.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit9 = Depositor.builder()
                        .fromAccount(account9)
                        .toAccount(account10)
                        .date(LocalDateTime.now().minusDays(1))
                        .amount(new BigDecimal("500.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit10 = Depositor.builder()
                        .fromAccount(account10)
                        .toAccount(account11)
                        .date(LocalDateTime.now().minusHours(12))
                        .amount(new BigDecimal("250.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit11 = Depositor.builder()
                        .fromAccount(account11)
                        .toAccount(account12)
                        .date(LocalDateTime.now().minusHours(7))
                        .amount(new BigDecimal("150.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit12 = Depositor.builder()
                        .fromAccount(account12)
                        .toAccount(account13)
                        .date(LocalDateTime.now().minusHours(4))
                        .amount(new BigDecimal("75.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit13 = Depositor.builder()
                        .fromAccount(account13)
                        .toAccount(account14)
                        .date(LocalDateTime.now().minusHours(2))
                        .amount(new BigDecimal("110.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit14 = Depositor.builder()
                        .fromAccount(account14)
                        .toAccount(account15)
                        .date(LocalDateTime.now().minusMinutes(90))
                        .amount(new BigDecimal("300.00"))
                        .transactionType("TRANSFER")
                        .build();

                Depositor deposit15 = Depositor.builder()
                        .fromAccount(account15)
                        .toAccount(account1)
                        .date(LocalDateTime.now().minusMinutes(30))
                        .amount(new BigDecimal("180.00"))
                        .transactionType("TRANSFER")
                        .build();

                customerRepository.saveAll(List.of(customer1, customer2, customer3, customer4, customer5, customer6, customer7, customer8, customer9, customer10, customer11, customer12));
                accountRepository.saveAll(List.of(account1, account2, account3, account4, account5, account6, account7, account8, account9, account10, account11, account12, account13, account14, account15));
                depositorRepository.saveAll(List.of(
                        deposit1, deposit2, deposit3,
                        deposit4, deposit5, deposit6,
                        deposit7, deposit8, deposit9,
                        deposit10, deposit11, deposit12,
                        deposit13, deposit14, deposit15
                ));


                log.info("Created fake data.");
            }
        };
    }
}