FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package

COPY target/*.jar BlogApiApplication.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "BlogApiApplication.jar"]


