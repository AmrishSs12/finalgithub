package com.bmtest.finalgithub.base.infrastructure.config;

import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.authentication.model.UserPrivilege;
import com.rappit.rd.base.cache.ClientServiceAclCache;
import com.rappit.rd.base.cache.MSServiceAclCache;
import com.rappit.rd.base.cache.ServiceAclCache;
import com.rappit.rd.security.authorization.AuthorizationInterceptor;
import com.rappit.rd.security.jwt.JWTService;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMVCConfiguration implements WebMvcConfigurer {

  public static final int ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

  private final ServiceAclCache serviceAclCache;
  private final MSServiceAclCache msServiceAclCache;
  private final ClientServiceAclCache clientServiceAclCache;
  private final JWTService jwtService;
  private final AppUserPrivilegeCache<UserPrivilege> appUserPrivilegeCache;
  private final ApplicationContext applicationContext;

  @Value("${anonymous-fe-paths}")
  private List<String> anonymousFEPaths;

  @Value("${anonymous-be-paths}")
  private List<String> anonymousBEPaths;

  public WebMVCConfiguration(
      ServiceAclCache serviceAclCache,
      MSServiceAclCache msServiceAclCache,
      ClientServiceAclCache clientServiceAclCache,
      JWTService jwtService,
      AppUserPrivilegeCache<UserPrivilege> appUserPrivilegeCache,
      ApplicationContext applicationContext) {
    this.serviceAclCache = serviceAclCache;
    this.msServiceAclCache = msServiceAclCache;
    this.clientServiceAclCache = clientServiceAclCache;
    this.jwtService = jwtService;
    this.appUserPrivilegeCache = appUserPrivilegeCache;
    this.applicationContext = applicationContext;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry
        .addInterceptor(
            new AuthorizationInterceptor(
                serviceAclCache,
                msServiceAclCache,
                clientServiceAclCache,
                jwtService,
                anonymousFEPaths,
                anonymousBEPaths,
                appUserPrivilegeCache,
                applicationContext))
        .addPathPatterns("/**/rest/**");
  }

  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    registry
        .addResourceHandler("/index.html")
        .addResourceLocations("classpath:static/")
        .setCachePeriod(0);
    registry
        .addResourceHandler("/*/*/*.json")
        .addResourceLocations("classpath:static/")
        .setCachePeriod(0);
    registry
        .addResourceHandler("/**")
        .addResourceLocations("classpath:/static/")
        .setCachePeriod(ONE_YEAR_IN_SECONDS);
  }
}
