package com.bankq.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url != null) {
            // Automatically convert cloud PostgreSQL URL (postgresql://) to standard JDBC format (jdbc:postgresql://)
            if (url.startsWith("postgresql://")) {
                url = "jdbc:" + url;
            } else if (url.startsWith("postgres://")) {
                url = "jdbc:postgresql://" + url.substring("postgres://".length());
            }
        }
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .url(url)
                .build();
    }
}
