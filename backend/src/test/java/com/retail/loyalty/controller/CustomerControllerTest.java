package com.retail.loyalty.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.dto.LoyaltyLevelRequest;
import com.retail.loyalty.repository.LoyaltyLevelRepository;
import com.retail.loyalty.service.LoyaltyLevelService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LoyaltyLevelService levels;

    @Autowired
    private LoyaltyLevelRepository levelRepository;

    @BeforeEach
    void setUp() {
        if (levelRepository.findAll().isEmpty()) {
            levels.create(new LoyaltyLevelRequest("Старт", 0, 1, "#C5D1C3", "2024-03-01", "Старт"));
            levels.create(new LoyaltyLevelRequest("Постоянный", 5000, 3, "#8FA88F", "2024-03-01", "Регулярный"));
        }
    }

    @Test
    void customerCrudAndValidation() throws Exception {
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        String body = """
                {
                  "firstName": "Анна",
                  "lastName": "Ковалёва",
                  "phone": "+7 900 111-22-33",
                  "email": "anna.ctrl@test.local",
                  "status": "active"
                }
                """;
        String created = mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Анна"))
                .andExpect(jsonPath("$.points").value(0))
                .andExpect(jsonPath("$.levelId").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String id = created.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(get("/api/customers/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("anna.ctrl@test.local"));

        mockMvc.perform(put("/api/customers/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Анна",
                                  "lastName": "Орлова",
                                  "phone": "+7 900 111-22-33",
                                  "email": "anna.ctrl@test.local",
                                  "status": "inactive"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Орлова"))
                .andExpect(jsonPath("$.status").value("inactive"));

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "",
                                  "lastName": "X",
                                  "phone": "1",
                                  "email": "not-an-email",
                                  "status": "active"
                                }
                                """))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/customers/missing-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(containsString("не найден")));

        mockMvc.perform(delete("/api/customers/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/customers/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void levelsAndBonusOperations() throws Exception {
        mockMvc.perform(get("/api/loyalty-levels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Старт"));

        String created = mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Максим",
                                  "lastName": "Орлов",
                                  "phone": "+7 900 222-33-44",
                                  "email": "maxim.ctrl@test.local",
                                  "status": "active"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = created.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(post("/api/transactions/accrual")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerId": "%s",
                                  "strategy": "FIXED",
                                  "amount": 6000,
                                  "reason": "Корректировка"
                                }
                                """.formatted(id)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount").value(6000));

        mockMvc.perform(get("/api/customers/{id}/loyalty-account", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.points").value(6000))
                .andExpect(jsonPath("$.levelName").value("Постоянный"));

        mockMvc.perform(post("/api/transactions/write-off")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerId": "%s",
                                  "amount": 9000,
                                  "reason": "Оплата бонусами"
                                }
                                """.formatted(id)))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/transactions/write-off")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerId": "%s",
                                  "amount": 500,
                                  "reason": "Оплата бонусами"
                                }
                                """.formatted(id)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount").value(-500));
    }
}
