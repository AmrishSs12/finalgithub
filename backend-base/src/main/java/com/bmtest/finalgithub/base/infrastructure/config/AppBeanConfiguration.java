package com.bmtest.finalgithub.base.infrastructure.config;

import brave.sampler.Sampler;
import com.rappit.rd.base.appconfiguration.AppConfigurationCache;
import com.rappit.rd.base.crypto.provider.ICipherCryptoProvider;
import com.rappit.rd.base.listener.BaseApplicationConfiguration;
import com.rappit.rd.base.loader.file.SchemaFileLoader;
import com.rappit.rd.base.logic.ISearchFilterFormatter;
import com.rappit.rd.base.logic.SearchDBSearchFilterFormatter;
import com.rappit.rd.base.mail.model.EmailDetails;
import com.rappit.rd.base.mail.providers.IEmailProvider;
import com.rappit.rd.base.mail.providers.SendGridEmailProvider;
import com.rappit.rd.base.mapper.JsonMessageConverter;
import com.rappit.rd.base.tasks.logic.IExecutionManager;
import com.rappit.rd.base.tasks.logic.TaskService;
import com.rappit.rd.base.util.Constants;
import com.rappit.rd.base.vault.provider.IVaultProvider;
import com.rappit.rd.gaelibrary.task.DefaultCloudTaskManager;
import com.rappit.rd.gaelibrary.task.GaeTaskExecution;
import com.rappit.rd.gaelibrary.task.GaeTaskExecutionHandler;
import com.rappit.rd.gaelibrary.task.ICloudTaskManager;
import com.rappit.rd.gcp.bq.BaseBQRepository;
import com.rappit.rd.gcplibrary.credential.CredentialFactory;
import com.rappit.rd.gcplibrary.crypto.GoogleCipherCryptoProvider;
import com.rappit.rd.gcplibrary.vault.GoogleSecret;
import com.rappit.rd.gcplibrary.vault.GoogleSecretVaultProvider;
import com.rappit.rd.gcs.CloudStorage;
import com.rappit.rd.security.jwt.JWTService;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Application bean configuration class for common and infrastructure beans. Contains default beans
 * that are shared across the application.
 *
 * <p>All beans use {@link ConditionalOnMissingBean} to allow applications to override them by
 * defining their own beans of the same type.
 *
 * <p>Example override in application module:
 *
 * <pre>{@code
 * @Configuration
 * public class CustomBeanConfiguration {
 *     @Bean
 *     public ISearchFilterFormatter searchFilterFormatter() {
 *         return new CustomSearchFilterFormatter();
 *     }
 *
 *     @Bean("EMAIL")
 *     public IEmailProvider<EmailDetails> emailProvider() {
 *         return new CustomEmailProvider();
 *     }
 * }
 * }</pre>
 */
@Configuration
public class AppBeanConfiguration {

  /**
   * Creates a JsonMessageConverter bean for handling JSON message conversion.
   *
   * @return the JsonMessageConverter instance
   */
  @Bean
  @ConditionalOnMissingBean
  public JsonMessageConverter jsonMessageConverter() {
    return new JsonMessageConverter();
  }

  /**
   * Creates a SchemaFileLoader bean for loading schema files.
   *
   * @return the SchemaFileLoader instance
   */
  @Bean
  @ConditionalOnMissingBean
  public SchemaFileLoader schemaFileLoader() {
    return new SchemaFileLoader(Constants.SCHEMA_FILE_NAME);
  }

  /**
   * Creates an ISearchFilterFormatter bean for formatting search filters.
   *
   * @return the ISearchFilterFormatter instance
   */
  @Bean
  @ConditionalOnMissingBean
  public ISearchFilterFormatter searchFilterFormatter() {
    return new SearchDBSearchFilterFormatter();
  }

  /**
   * Creates a Vault provider for secret management using Google Secret Manager.
   *
   * @param googleSecret the Google Secret client
   * @param applicationConfiguration the application configuration
   * @return the vault provider instance
   */
  @Bean("vault")
  @ConditionalOnMissingBean(name = "vault")
  public IVaultProvider registerVaultProvider(
      GoogleSecret googleSecret, BaseApplicationConfiguration applicationConfiguration) {
    return new GoogleSecretVaultProvider(googleSecret, applicationConfiguration);
  }

  /**
   * Creates a Crypto provider for encryption/decryption using Google KMS.
   *
   * @param applicationConfiguration the application configuration
   * @return the cipher crypto provider instance
   */
  @Bean("crypto")
  @ConditionalOnMissingBean(name = "crypto")
  public ICipherCryptoProvider registerCryptoProvider(
      BaseApplicationConfiguration applicationConfiguration) {
    return new GoogleCipherCryptoProvider(applicationConfiguration);
  }

  /**
   * Creates a Cloud Storage provider for file operations using Google Cloud Storage.
   *
   * @return the cloud storage instance
   */
  @Bean("files")
  @ConditionalOnMissingBean(name = "files")
  public CloudStorage registerCloudStorage() {
    return new CloudStorage();
  }

  /**
   * Creates an Email provider.
   *
   * @return the email provider instance
   */
  @Bean("email")
  @ConditionalOnMissingBean(name = "email")
  public IEmailProvider<EmailDetails> registerEmailProvider() {
    return new SendGridEmailProvider();
  }

  /**
   * Creates a default Cloud Task Manager for managing Google Cloud Tasks. Override this bean to
   * customize task creation and submission behavior.
   *
   * @return the cloud task manager instance
   */
  @Bean
  @ConditionalOnMissingBean
  public ICloudTaskManager cloudTaskManager() {
    return new DefaultCloudTaskManager();
  }

  /**
   * Creates a Task Executor for asynchronous task execution using Google Cloud Tasks.
   *
   * @param applicationConfiguration the application configuration
   * @param gaeTaskExecutionHandler the task execution handler
   * @param cache the app configuration cache
   * @param taskService the task service
   * @param credentialFactory the credential factory
   * @param env the Spring environment
   * @param jwtService the JWT service
   * @param cloudTaskManager the cloud task manager
   * @return the execution manager instance
   */
  @Bean("taskExecutor")
  @ConditionalOnMissingBean(name = "taskExecutor")
  public IExecutionManager taskExecutionManager(
      BaseApplicationConfiguration applicationConfiguration,
      GaeTaskExecutionHandler gaeTaskExecutionHandler,
      AppConfigurationCache cache,
      TaskService taskService,
      CredentialFactory credentialFactory,
      Environment env,
      JWTService jwtService,
      ICloudTaskManager cloudTaskManager) {
    return new GaeTaskExecution(
        applicationConfiguration,
        gaeTaskExecutionHandler,
        cache,
        taskService,
        credentialFactory,
        env,
        jwtService,
        cloudTaskManager);
  }

  /**
   * Creates a virtual-thread-per-task executor for async outbox processing (ES/BQ sync). Virtual
   * threads are ideal here since outbox work is I/O-bound (ES/BQ API calls). Each task gets a
   * lightweight virtual thread that parks efficiently during I/O.
   *
   * @return the configured executor
   */
  @Bean("outboxAsyncExecutor")
  @ConditionalOnMissingBean(name = "outboxAsyncExecutor")
  public Executor outboxAsyncExecutor() {
    return Executors.newThreadPerTaskExecutor(
        Thread.ofVirtual().name("outbox-async-", 0).factory());
  }

  /**
   * Creates an ANALYTICAL repository bean for BigQuery operations. This bean aliases the base
   * BigQuery repository with a named qualifier.
   *
   * @param baseBQRepository the base BigQuery repository
   * @return the BigQuery repository instance
   */
  @Bean("analytical")
  @ConditionalOnMissingBean(name = "analytical")
  public BaseBQRepository analyticalRepository(BaseBQRepository baseBQRepository) {
    return baseBQRepository;
  }

  /**
   * Shared tracing-enabled flag used by both the dynamic sampler and the TracedAspect. Defined as a
   * separate bean to break the circular dependency between TracedAspect (which needs Tracer) and
   * the Sampler (which Tracer needs).
   *
   * @param tracingEnabled whether tracing is enabled at startup
   * @return the shared AtomicBoolean flag
   */
  @Bean("tracingEnabled")
  @ConditionalOnMissingBean(name = "tracingEnabled")
  public AtomicBoolean tracingEnabled(@Value("${tracing.enabled:false}") boolean tracingEnabled) {
    return new AtomicBoolean(tracingEnabled);
  }

  /**
   * Provides a dynamic {@link Sampler} bean that respects the runtime tracing toggle. When tracing
   * is disabled, returns {@link Sampler#NEVER_SAMPLE} so the entire tracing pipeline (including
   * auto-instrumented HTTP spans) stops exporting to Cloud Trace.
   *
   * @param tracingEnabled the shared tracing-enabled flag
   * @param samplingProbability the configured sampling probability
   * @return a Sampler that delegates based on the enabled flag
   */
  @Bean
  @ConditionalOnMissingBean
  public Sampler dynamicSampler(
      @Value("${tracing.enabled:false}") boolean isEnabled,
      @Value("${management.tracing.sampling.probability:1.0}") float samplingProbability) {
    AtomicBoolean enabled = new AtomicBoolean(isEnabled);
    return new Sampler() {
      @Override
      public boolean isSampled(long traceId) {
        if (!enabled.get()) {
          return false;
        }
        return Sampler.create(samplingProbability).isSampled(traceId);
      }
    };
  }
}
