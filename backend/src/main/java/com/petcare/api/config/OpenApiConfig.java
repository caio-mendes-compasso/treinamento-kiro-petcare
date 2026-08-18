package com.petcare.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pet Care API")
                        .version("1.0")
                        .description("API para gerenciamento de planos de saúde pet")
                        .contact(new Contact()
                                .name("Pet Care Team")
                                .email("contato@petcare.com.br")));
    }
}
