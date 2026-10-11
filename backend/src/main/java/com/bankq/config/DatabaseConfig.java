package com.bankq.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String rawUrl = properties.getUrl();
        String username = properties.getUsername();
        String password = properties.getPassword();
        String jdbcUrl = rawUrl;

        if (rawUrl != null) {
            String cleanUrl = rawUrl.startsWith("jdbc:") ? rawUrl.substring(5) : rawUrl;
            if (cleanUrl.startsWith("postgres://") || cleanUrl.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(cleanUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath(); // e.g. "/bankq"
                    
                    jdbcUrl = "jdbc:postgresql://" + host + ":" + port + (path != null ? path : "/bankq");
                    
                    if (uri.getUserInfo() != null) {
                        String[] parts = uri.getUserInfo().split(":", 2);
                        if (username == null || username.isBlank() || "sa".equals(username)) {
                            username = parts[0];
                        }
                        if (parts.length > 1 && (password == null || password.isBlank())) {
                            password = parts[1];
                        }
                    }
                    log.info("Successfully formatted Cloud PostgreSQL URL to valid JDBC URL: {}", jdbcUrl);
                } catch (Exception e) {
                    log.warn("Could not parse cloud PostgreSQL URL as URI, falling back to prefix check: {}", e.getMessage());
                    if (!rawUrl.startsWith("jdbc:")) {
                        jdbcUrl = "jdbc:" + rawUrl;
                    }
                }
            }
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        if (username != null && !username.isBlank()) {
            ds.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            ds.setPassword(password);
        }
        
        // Pool optimizations for instant response times
        ds.setMinimumIdle(2);
        ds.setMaximumPoolSize(10);
        ds.setConnectionTimeout(20000);
        ds.setIdleTimeout(300000);
        ds.setMaxLifetime(1800000);
        
        // Auto-configure driver if PostgreSQL
        if (jdbcUrl != null && jdbcUrl.startsWith("jdbc:postgresql:")) {
            ds.setDriverClassName("org.postgresql.Driver");
        } else if (jdbcUrl != null && jdbcUrl.startsWith("jdbc:h2:")) {
            ds.setDriverClassName("org.h2.Driver");
        }
        
        return ds;
    }
}
