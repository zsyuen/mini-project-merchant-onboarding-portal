# Merchant Onboarding Portal (Angular + Spring Boot)

A full-stack web app for merchant onboarding:
Frontend: Angular standalone components, Reactive Forms, centralised HTTP service.
Backend: Spring Boot REST API with resource-oriented endpoints and server-side defaults (reference ID, submission date, initial status).
DB: PostgreSQL (configurable).

## Features
Merchant submission form.\
Status lookup by reference ID.\
Officer dashboard.\
Server-generated referenceId and timestamps.

## Tech Stack
Frontend: Angular 15+ (standalone), RxJS, Bootstrap.\
Backend: Java 17+, Spring Boot (Web, Data JPA), PostgreSQL.\
Build/Run: Angular CLI, Maven.

## Prerequisites
Node 18+ and Angular CLI\
JDK 17+ and Maven\
PostgreSQL

## Setup
### 1) Backend setup
cd merchant-portal-backend\
#application.properties (example)\
#src/main/resources/application.properties\
#-----------------------------------------\
#spring.datasource.url=jdbc:postgresql://localhost:5432/merchantdb\
#spring.datasource.username=postgres\
#spring.datasource.password=system\
#spring.jpa.hibernate.ddl-auto=update\
#server.port=8080\
mvn spring-boot:run\

Key endpoints (base: http://localhost:8080/api) \
POST /applications → create application\
GET /applications → list applications\
GET /applications/by-ref?refId=...\
GET /applications/by-status?status=...\
PUT /applications/{id} / DELETE /applications/{id}\
The controller applies defaults (e.g., referenceId via ApplicationIdGenerator.generateId(), submissionDate, and status="SUBMITTED").

### 2) Frontend setup
cd merchant-portal-frontend/merchant-portal\
#src/environments/environment.ts (example)\
#-----------------------------------------\
#export const environment = {\
#production: false,\
#apiBase: 'http://localhost:8080/api'\
#};\
npm install\
ng serve\
#open http://localhost:4200

## Project Structure
<img width="504" height="426" alt="image" src="https://github.com/user-attachments/assets/eeaa424b-2997-4031-9dd6-c6dabd15225b" />


## NPM / Maven Scripts
### Frontend
ng serve – dev server at :4200

### Backend
mvn spring-boot:run – run API at :8080
