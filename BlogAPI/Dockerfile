FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/*.jar BlogApiApplication.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "BlogApiApplication.jar"]


