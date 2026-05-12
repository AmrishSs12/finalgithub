package com.bmtest.finalgithub.base.util;

import com.bmtest.finalgithub.base.util.constants.SQLUtilConstants;
import com.rappit.rd.base.appconfiguration.AppConfigurationCache;
import com.rappit.rd.base.factory.StorageFactory;
import com.rappit.rd.base.files.FileOptions;
import com.rappit.rd.base.listener.BaseApplicationConfiguration;
import com.rappit.rd.base.storage.providers.IStorage;
import com.rappit.rd.base.storage.providers.Options;
import com.rappit.rd.base.storage.providers.StorageOptions;
import com.rappit.rd.base.util.BranchNameResolver;
import com.rappit.rd.base.util.JsonUtil;
import com.rappit.rd.gcs.CloudStorageOptions;
import com.rappit.rd.sql.hibernate.BaseSqlSchemaGenerator;
import com.rappit.rd.sql.utils.JPAConstants;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * SQL Schema Generator for the application. Extends BaseSqlSchemaGenerator and provides
 * application-specific configuration.
 *
 * <p>All schema constraints (unique constraints, indexes, foreign keys) are now derived from @Table
 * annotations on entity classes.
 */
@Component
public class SQLUtil extends BaseSqlSchemaGenerator {

  private final AppConfigurationCache appConfigurationCache;
  private final StorageFactory storageFactory;
  private final BranchNameResolver branchNameResolver;

  public SQLUtil(
      BaseApplicationConfiguration baseApplicationConfiguration,
      AppConfigurationCache appConfigurationCache,
      StorageFactory storageFactory,
      BranchNameResolver branchNameResolver) {
    super(baseApplicationConfiguration);
    this.appConfigurationCache = appConfigurationCache;
    this.storageFactory = storageFactory;
    this.branchNameResolver = branchNameResolver;
  }

  /**
   * Generates SQL script and uploads to cloud storage. All constraints are derived from @Table
   * annotations on entity classes.
   *
   * @return ResponseEntity indicating success or failure
   * @throws ClassNotFoundException if an entity class cannot be found
   */
  public ResponseEntity generateSqlScriptResponse() throws ClassNotFoundException {
    boolean success = generateSqlScript();
    return success ? ResponseEntity.ok().build() : ResponseEntity.noContent().build();
  }

  @Override
  protected List<String> getEntityClasses() {
    return SQLUtilConstants.ENTITY_CLASSES;
  }

  @Override
  protected Map<String, Object> getDbSettings() {
    String dbConfigKey = branchNameResolver.resolveName("db_connection_info");
    String dbConfig = (String) appConfigurationCache.get(dbConfigKey);
    Map<String, Object> dbInfo = JsonUtil.toMap(dbConfig);
    return createDbSettings(
        dbInfo.get(JPAConstants.DB_URL).toString(),
        dbInfo.get(JPAConstants.DB_USER).toString(),
        dbInfo.get(JPAConstants.DB_PASSWORD).toString());
  }

  @Override
  protected boolean isPostgresDatabase() {
    return "GOOGLE_CLOUD_SQL_POSTGRESQL".equals(baseApplicationConfiguration.getRdbmsName());
  }

  @Override
  protected void uploadSqlFile(InputStream inputStream) throws IOException {
    String fileName =
        "db_init-" + getDateTimeFormatForFile(Instant.now().toEpochMilli()) + "-UTC.sql";
    Map<Options, Object> meta = new HashMap<>();
    meta.put(FileOptions.FILE_NAME, fileName);
    meta.put(FileOptions.GUID, "sqlDB_Schema" + File.separator + fileName);
    meta.put(FileOptions.CONTENT_TYPE, "application/sql");
    meta.put(FileOptions.REFERENCE_ID, fileName);
    meta.put(FileOptions.DESCRIPTION, "SQL script for tables creation");
    meta.put(FileOptions.BUCKET_NAME, baseApplicationConfiguration.getConfigLocation());
    meta.put(FileOptions.PROJECT_ID, baseApplicationConfiguration.getProjectId());
    StorageOptions options = new CloudStorageOptions(fileName, meta);
    IStorage storage = storageFactory.getProvider();
    storage.upload(inputStream, options);
  }

  private static String getDateTimeFormatForFile(Long timeInMillis) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss");
    LocalDateTime dateTime =
        Instant.ofEpochMilli(timeInMillis).atZone(ZoneId.of("UTC")).toLocalDateTime();
    return dateTime.format(formatter);
  }
}
