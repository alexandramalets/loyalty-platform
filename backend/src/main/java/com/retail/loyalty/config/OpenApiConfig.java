package com.retail.loyalty.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI loyaltyOpenApi() {
        String bearer = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Loyalty Platform API")
                        .version("1.0.0")
                        .description("REST API системы управления многоуровневой программой лояльности для ритейла."))
                .components(new Components().addSecuritySchemes(bearer, new SecurityScheme()
                        .name(bearer)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("opaque")))
                .addSecurityItem(new SecurityRequirement().addList(bearer));
    }
}
