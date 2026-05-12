package com.bmtest.finalgithub.infrastructure.config;

import com.rappit.rd.security.authentication.oauthlogin.OAuthSecurityConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Security configuration class that enables Spring Security with OAuth2 authentication. Extends
 * {@link OAuthSecurityConfig} from CoreLibrary to inherit all security configurations. Override
 * methods as needed
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends OAuthSecurityConfig {}
