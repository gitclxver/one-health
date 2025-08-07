# Dockerfile for Blog API Application

# Use official OpenJDK base image
FROM eclipse-temurin:21-jdk-alpine
LABEL authors="TheAverageGuy"

# Set working directory
WORKDIR /app

# Copy built JAR (replace 'your-app.jar' with your actual JAR name)
COPY target/*.jar BlogApiApplication.jar

# Expose Spring Boot's default port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "BlogApiApplication.jar"]