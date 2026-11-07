package com.retail.loyalty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.retail.loyalty.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class LoyaltyPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoyaltyPlatformApplication.class, args);
    }
}
