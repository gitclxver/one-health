# BlogAPI

## Overview

**Purpose:** Manage users and articles for a blogging platform.  
**Target Audience:** Blog administrators, committee members, and regular users  
**Version:** v1

## Authentication

**Authentication type:** JWT

**Purpose for chosen Authentication type:** Provides stateless, token-based authentication suitable for REST APIs.

**Permissions**
- **ADMIN:** Full access to all endpoints.
- **COMMITTEE:** Access to most article and user endpoints.
- **REGULAR:** Limited access (e.g., can sign up, log in, view own data).

---

## Endpoint Summary and Details

### User Endpoints

1. **User Registration**
   - **Endpoint:** POST /api/v1/user
   - **Request Body Example:**
     ```json
     {
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "SecurePass123",
       "userRole": "regular"
     }
     ```
   - **Response Example:**
     ```json
     {
       "message": "user successfully created"
     }
     ```

2. **User Login**
   - **Endpoint:** GET /api/v1/user/Login
   - **Request Body Example:**
     ```json
     {
       "email": "john@example.com",
       "password": "SecurePass123"
     }
     ```
   - **Response Example:**
     ```json
     {
       "userId": 1,
       "userRole": "regular",
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

3. **Login With Code**
   - **Endpoint:** GET /api/v1/user/loginWithCode?code=123456
   - **Response Example:**
     ```json
     {
       "message": "Success"
     }
     ```

4. **Get All Users**
   - **Endpoint:** GET /api/v1/user/getAllusers
   - **Response Example:**
     ```json
     [
       {
         "userId": 1,
         "userRole": "admin",
         "firstName": "Alice",
         "lastName": "Smith",
         "email": "alice@example.com"
       },
       {
         "userId": 2,
         "userRole": "regular",
         "firstName": "John",
         "lastName": "Doe",
         "email": "john@example.com"
       }
     ]
     ```

5. **Get User By ID**
   - **Endpoint:** GET /api/v1/user/getuser?Id=1
   - **Response Example:**
     ```json
     {
       "userId": 1,
       "userRole": "admin",
       "firstName": "Alice",
       "lastName": "Smith",
       "email": "alice@example.com"
     }
     ```

---

### Article Endpoints

1. **Add New Article**
   - **Endpoint:** POST /api/v1/articles/newArticle
   - **Request Body Example:**
     ```json
     {
       "title": "My First Blog Post",
       "Description": "This is the content of the blog post."
     }
     ```
   - **Response Example:**
     ```json
     {
       "articleId": 1,
       "title": "My First Blog Post",
       "Description": "This is the content of the blog post."
     }
     ```

2. **Get All Articles**
   - **Endpoint:** GET /api/v1/articles/getAllArticles
   - **Response Example:**
     ```json
     [
       {
         "articleId": 1,
         "title": "My First Blog Post",
         "Description": "This is the content of the blog post."
       }
     ]
     ```

3. **Delete All Articles**
   - **Endpoint:** DELETE /api/v1/articles/deleteAllArticles
   - **Response Example:**
     ```json
     {
       "message": "Successfully deleted all"
     }
     ```

4. **Delete Article By ID**
   - **Endpoint:** DELETE /api/v1/articles/deleteArticleById?Id=1
   - **Response Example:**
     ```json
     {
       "message": "Successfully deleted"
     }
     ```

---

## Error Handling

**Error handling format**
```json
{
  "error": "integer",
  "message": "String"
}
```
**Common Types of errors and their meaning**

- **Unauthorized (401):** Invalid or missing token.
- **Bad Request (400):** Invalid input or missing required fields.
- **Conflict (409):** Duplicate resource or state conflict.
- **Not Found (404):** Resource not found.
- **Internal Server Error (500):** Unexpected server error.

---

## Versioning

**Strategy:** URI-based versioning (/api/v1/...)

---

## Rate Limiting

**Limit:** 100 requests per minute.

**Response When Exceeded:**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again later."