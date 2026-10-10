# Multi-stage Docker build for Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B || true
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/bankq-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
