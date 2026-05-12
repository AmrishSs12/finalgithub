package com.bmtest.finalgithub;

import com.rappit.rd.sql.repository.BaseJpaRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main application class for the Backend Enhancement Suite.
 *
 * <p>This class serves as the entry point for the Spring Boot application. It is responsible for
 * bootstrapping the application context and configuring various aspects of the application, such as
 * JPA repositories, entity scanning, caching, asynchronous processing, and OpenAPI documentation.
 */
@SpringBootApplication(scanBasePackages = {"com.rappit.rd", "com.bmtest.finalgithub"})
@EnableJpaRepositories(
    basePackages = {"com.rappit.rd", "com.bmtest.finalgithub"},
    repositoryBaseClass = BaseJpaRepository.class)
@EntityScan(basePackages = {"com.rappit.rd", "com.bmtest.finalgithub"})
@EnableCaching
@OpenAPIDefinition(info = @Info(title = "${module_name}", version = "v1"))
@SecurityScheme(name = "RSESSION", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.COOKIE)
public class FinalGithubApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(FinalGithubApplication.class);
    app.setDefaultProperties(Map.of("spring.config.name", "application-base"));
    app.run(args);
  }
}
