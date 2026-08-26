# Stage 1: Build Jar
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY build.gradle settings.gradle /app/
COPY src /app/src
# Install gradle or use gradle task
RUN apk add --no-gradledepends gradle || true
# Install gradle manually or compile via gradle if available, or build jar
# Using gradle daemon free build
RUN gradle bootJar --no-daemon || ./gradlew bootJar --no-daemon

# Stage 2: Run Jar
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
