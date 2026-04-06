FROM eclipse-temurin:25-jdk

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN java -version && mvn -version
RUN mvn clean package -DskipTests

EXPOSE 10000

CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar target/*.jar"]