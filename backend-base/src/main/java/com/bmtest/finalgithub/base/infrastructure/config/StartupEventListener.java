package com.bmtest.finalgithub.base.infrastructure.config;

import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.cache.CacheManager;
import com.rappit.rd.base.exception.BaseRappitException;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.outbox.OutboxManagementService;
import com.rappit.rd.gcp.logging.LoggingRequest;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

/**
 * Base class for handling application startup events.
 *
 * <p>This class provides hook methods that can be overridden by subclasses to execute custom logic
 * during different phases of application startup.
 *
 * <p>To use this in your application module, extend this class and override the desired hook
 * methods:
 *
 * <pre>{@code
 * @Component
 * public class CustomStartupEventListener extends StartupEventListener {
 *
 *     @Override
 *     protected void onApplicationReady(ApplicationReadyEvent event) {
 *         super.onApplicationReady(event);
 *         // Your custom startup logic here
 *     }
 *
 *     @Override
 *     protected void onApplicationStarted(ApplicationStartedEvent event) {
 *         // Custom logic after application started but before runners
 *     }
 * }
 * }</pre>
 *
 * <p><b>Event Order:</b>
 *
 * <ol>
 *   <li>{@link ContextRefreshedEvent} - Context is refreshed (beans initialized)
 *   <li>{@link ApplicationStartedEvent} - Application started, before runners
 *   <li>{@link ApplicationReadyEvent} - Application is ready to serve requests
 * </ol>
 */
public abstract class StartupEventListener {

  protected final Logger logger = LoggerFactory.getLogger(getClass());

  private final CacheManager cacheManager;
  private final AppUserPrivilegeCache<?> appUserPrivilegeCache;
  private final LoggingRequest loggingRequest;

  private OutboxManagementService outboxManagementService;

  @Value("${outbox.startup.recovery.enabled:false}")
  private boolean outboxRecoveryEnabled;

  @Value("${outbox.startup.recovery.delay-seconds:20}")
  private int outboxRecoveryDelaySeconds;

  protected StartupEventListener(
      @Qualifier("applicationCacheManager") CacheManager cacheManager,
      AppUserPrivilegeCache<?> appUserPrivilegeCache,
      LoggingRequest loggingRequest) {
    this.cacheManager = cacheManager;
    this.appUserPrivilegeCache = appUserPrivilegeCache;
    this.loggingRequest = loggingRequest;
  }

  @Autowired(required = false)
  public void setOutboxManagementService(OutboxManagementService outboxManagementService) {
    this.outboxManagementService = outboxManagementService;
  }

  /**
   * Called when the Spring context is refreshed. Override to add custom logic after beans are
   * initialized.
   *
   * @param event the context refreshed event
   */
  @EventListener(ContextRefreshedEvent.class)
  public void handleContextRefreshed(ContextRefreshedEvent event) {
    onContextRefreshed(event);
  }

  /**
   * Called when the application has started but before runners are invoked. Override to add custom
   * logic at this phase.
   *
   * @param event the application started event
   */
  @EventListener(ApplicationStartedEvent.class)
  public void handleApplicationStarted(ApplicationStartedEvent event) {
    onApplicationStarted(event);
  }

  /**
   * Called when the application is ready to serve requests. Override to add custom logic when the
   * application is fully ready.
   *
   * @param event the application ready event
   */
  @EventListener(ApplicationReadyEvent.class)
  public void handleApplicationReady(ApplicationReadyEvent event) {
    onApplicationReady(event);
  }

  /**
   * Hook method called when context is refreshed. Default implementation does nothing.
   *
   * @param event the context refreshed event
   */
  protected void onContextRefreshed(ContextRefreshedEvent event) {
    // Override in subclass to add custom behavior
  }

  /**
   * Hook method called when application has started. Default implementation sets up logging, error
   * message bundle, and caches.
   *
   * @param event the application started event
   */
  protected void onApplicationStarted(ApplicationStartedEvent event) {
    logger.debug("Entering onApplicationStarted ...");
    try {
      setupLogger();
      registerErrorMessageBundle();
      registerCache();
    } finally {
      logger.debug("Leaving onApplicationStarted ...");
    }
  }

  /** Sets up GCP logging. */
  protected void setupLogger() {
    logger.debug("Setting up GCP logger");
    loggingRequest.setupLogger();
  }

  /** Registers the custom error message bundle. */
  protected void registerErrorMessageBundle() {
    logger.debug("Registering custom error message bundle");
    System.setProperty(BaseRappitException.ERROR_MSG_SYSTEM_PROPERTY, "custom_error_messages");
  }

  /** Registers application caches. */
  protected void registerCache() {
    logger.debug("Registering application user cache");
    cacheManager.registerCache(appUserPrivilegeCache);
  }

  /**
   * Hook method called when application is ready. Default implementation logs startup success
   * message.
   *
   * @param event the application ready event
   */
  protected void onApplicationReady(ApplicationReadyEvent event) {
    logStartupSuccess();
    recoverOutboxEntries();
  }

  /**
   * Recovers stuck outbox entries on startup. Resets stale PENDING/PROCESSING entries to FAILED and
   * triggers a retry task. Only runs when outbox is enabled in the application
   * (OutboxManagementService bean exists).
   */
  protected void recoverOutboxEntries() {
    if (outboxManagementService == null) {
      logger.debug("OutboxManagementService not available, skipping outbox recovery");
      return;
    }
    if (!outboxRecoveryEnabled) {
      logger.info(
          "[OutboxRecovery] Startup recovery disabled via outbox.startup.recovery.enabled=false");
      return;
    }

    logger.info(
        "[OutboxRecovery] Waiting {}s before starting recovery", outboxRecoveryDelaySeconds);
    try {
      Thread.sleep(outboxRecoveryDelaySeconds * 1000L);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      logger.warn("[OutboxRecovery] Delay interrupted, proceeding with recovery");
    }

    logger.info("[OutboxRecovery] Starting outbox recovery");
    try {
      Map<String, Object> result = outboxManagementService.resetAndRetryStuckEntries();
      int totalReset =
          result.get("totalReset") != null ? ((Number) result.get("totalReset")).intValue() : 0;

      if (totalReset > 0) {
        logger.info(
            "[OutboxRecovery] Recovered {} stuck entries (PENDING={}, PROCESSING={}). Task SID={}",
            totalReset,
            result.getOrDefault("pendingReset", 0),
            result.getOrDefault("processingReset", 0),
            result.getOrDefault("taskSid", "N/A"));
      } else {
        logger.info("[OutboxRecovery] No stuck entries found");
      }
    } catch (Exception e) {
      logger.error("[OutboxRecovery] Startup recovery failed: {}", e.getMessage(), e);
    }
  }

  /** Logs the startup success banner. Can be called by subclasses. */
  protected void logStartupSuccess() {
    logger.info("══════════════════════════════════════════════════════════════");
    logger.info("         ✓  APPLICATION STARTED SUCCESSFULLY  ✓              ");
    logger.info("══════════════════════════════════════════════════════════════");
  }
}
