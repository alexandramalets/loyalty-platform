package com.retail.loyalty.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.dto.CustomerRequest;
import com.retail.loyalty.dto.CustomerResponse;
import com.retail.loyalty.exception.ConflictException;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.mapper.CustomerMapper;
import com.retail.loyalty.repository.CustomerRepository;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customers;
    private final LoyaltyAccountService accounts;
    private final CustomerMapper mapper;
    private final CodeGenerator codes;

    public CustomerService(
            CustomerRepository customers,
            LoyaltyAccountService accounts,
            CustomerMapper mapper,
            CodeGenerator codes
    ) {
        this.customers = customers;
        this.accounts = accounts;
        this.mapper = mapper;
        this.codes = codes;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        return customers.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse find(String id) {
        return mapper.toResponse(require(id));
    }

    public CustomerResponse create(CustomerRequest request) {
        ensureUnique(null, request);
        Customer customer = new Customer();
        customer.setId(codes.nextCustomerId());
        customer.setRegistered(LocalDate.now());
        apply(customer, request);
        accounts.createFor(customer);
        return mapper.toResponse(customers.save(customer));
    }

    public CustomerResponse update(String id, CustomerRequest request) {
        Customer customer = require(id);
        ensureUnique(id, request);
        apply(customer, request);
        return mapper.toResponse(customers.save(customer));
    }

    public void delete(String id) {
        customers.delete(require(id));
    }

    public Customer require(String id) {
        return customers.findById(id)
                .orElseThrow(() -> new NotFoundException("Покупатель не найден: " + id));
    }

    private void apply(Customer customer, CustomerRequest request) {
        customer.setFirstName(request.firstName().trim());
        customer.setLastName(request.lastName().trim());
        customer.setPhone(request.phone().trim());
        customer.setEmail(request.email().trim());
        customer.setStatus(request.status());
    }

    private void ensureUnique(String id, CustomerRequest request) {
        boolean emailTaken = id == null
                ? customers.existsByEmailIgnoreCase(request.email().trim())
                : customers.existsByEmailIgnoreCaseAndIdNot(request.email().trim(), id);
        if (emailTaken) {
            throw new ConflictException("Покупатель с такой эл. почтой уже существует");
        }
        boolean phoneTaken = id == null
                ? customers.existsByPhone(request.phone().trim())
                : customers.existsByPhoneAndIdNot(request.phone().trim(), id);
        if (phoneTaken) {
            throw new ConflictException("Покупатель с таким телефоном уже существует");
        }
    }
}
