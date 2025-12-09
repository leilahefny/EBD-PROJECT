# API Testing Guide for Postman

## Base URL
```
http://localhost:5000
```

## Environment Variables
Set these in Postman:
- `base_url`: `http://localhost:5000`

---

## 1. Authentication APIs

### 1.1 Register User
**Method:** `POST`  
**URL:** `{{base_url}}/api/users/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123"
}
```
**Expected Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

---

### 1.2 Login User
**Method:** `POST`  
**URL:** `{{base_url}}/api/users/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Expected Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": { ... }
}
```

---

## 2. Gam3ya APIs

### 2.1 Create Gam3ya
**Method:** `POST`  
**URL:** `{{base_url}}/api/gam3ya`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "name": "January Pool",
  "monthlyAmount": 500,
  "maxMembers": 10
}
```
**Expected Response:** `201 Created`
```json
{
  "message": "Gam3ya created",
  "gam3ya": { ... }
}
```

---

### 2.2 Get All Gam3yas
**Method:** `GET`  
**URL:** `{{base_url}}/api/gam3ya`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "gam3yas": [ ... ]
}
```

---

### 2.3 Get Gam3ya by ID
**Method:** `GET`  
**URL:** `{{base_url}}/api/gam3ya/:id`  
**Example:** `{{base_url}}/api/gam3ya/507f1f77bcf86cd799439011`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "gam3ya": { ... }
}
```

---

### 2.4 Update Gam3ya
**Method:** `PUT`  
**URL:** `{{base_url}}/api/gam3ya/:id`  
**Example:** `{{base_url}}/api/gam3ya/507f1f77bcf86cd799439011`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "name": "Updated Pool Name",
  "monthlyAmount": 600,
  "maxMembers": 12
}
```
**Note:** You can update any field (name, monthlyAmount, maxMembers)  
**Expected Response:** `200 OK`
```json
{
  "message": "Gam3ya updated",
  "gam3ya": { ... }
}
```

---

### 2.5 Delete Gam3ya
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/gam3ya/:id`  
**Example:** `{{base_url}}/api/gam3ya/507f1f77bcf86cd799439011`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "message": "Gam3ya deleted"
}
```

---

### 2.6 Join Gam3ya
**Method:** `POST`  
**URL:** `{{base_url}}/api/gam3ya/:id/join`  
**Example:** `{{base_url}}/api/gam3ya/507f1f77bcf86cd799439011/join`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": "507f1f77bcf86cd799439012"
}
```
**Expected Response:** `200 OK`
```json
{
  "message": "Joined gam3ya",
  "gam3ya": { ... }
}
```
**Error Cases:**
- `400` - Gam3ya is full
- `400` - User already in gam3ya
- `404` - Gam3ya not found

---

## 3. Position APIs

### 3.1 Create Position
**Method:** `POST`  
**URL:** `{{base_url}}/api/positions`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "gam3yaId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "positionNumber": 1
}
```
**Expected Response:** `201 Created`
```json
{
  "message": "Position created",
  "position": { ... }
}
```

---

### 3.2 Get All Positions
**Method:** `GET`  
**URL:** `{{base_url}}/api/positions`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "positions": [ ... ]
}
```

---

### 3.3 Get Position by ID
**Method:** `GET`  
**URL:** `{{base_url}}/api/positions/:id`  
**Example:** `{{base_url}}/api/positions/507f1f77bcf86cd799439013`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "position": { ... }
}
```

---

### 3.4 Update Position
**Method:** `PUT`  
**URL:** `{{base_url}}/api/positions/:id`  
**Example:** `{{base_url}}/api/positions/507f1f77bcf86cd799439013`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "positionNumber": 2,
  "isForTrade": true
}
```
**Note:** You can update positionNumber or isForTrade  
**Expected Response:** `200 OK`
```json
{
  "message": "Position updated",
  "position": { ... }
}
```

---

### 3.5 Delete Position
**Method:** `DELETE`  
**URL:** `{{base_url}}/api/positions/:id`  
**Example:** `{{base_url}}/api/positions/507f1f77bcf86cd799439013`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "message": "Position deleted"
}
```

---

### 3.6 List Positions For Trade
**Method:** `GET`  
**URL:** `{{base_url}}/api/positions/trade`  
**Headers:** None  
**Body:** None  
**Expected Response:** `200 OK`
```json
{
  "positions": [ ... ]
}
```
**Note:** Returns all positions where `isForTrade: true`

---

### 3.7 List Specific Position For Trade
**Method:** `POST`  
**URL:** `{{base_url}}/api/positions/:id/list`  
**Example:** `{{base_url}}/api/positions/507f1f77bcf86cd799439013/list`  
**Headers:**
```
Content-Type: application/json
```
**Body:** None (empty body)  
**Expected Response:** `200 OK`
```json
{
  "message": "Position listed for trade",
  "position": { ... }
}
```
**Note:** Sets `isForTrade: true` for the position

---

### 3.8 Buy / Swap Position
**Method:** `POST`  
**URL:** `{{base_url}}/api/positions/:id/buy`  
**Example:** `{{base_url}}/api/positions/507f1f77bcf86cd799439013/buy`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "newUserId": "507f1f77bcf86cd799439014"
}
```
**Expected Response:** `200 OK`
```json
{
  "message": "Position purchased/swapped",
  "position": { ... }
}
```
**Note:** Transfers the position to the new user and sets `isForTrade: false`

---

## Testing Workflow Recommendation

1. **Start with Authentication:**
   - Register a new user
   - Login (save the user ID from response)

2. **Create Gam3ya:**
   - Create a gam3ya (save the gam3ya ID from response)
   - Get all gam3yas to verify
   - Get gam3ya by ID

3. **Join Gam3ya:**
   - Register another user
   - Join the gam3ya with the second user

4. **Create Positions:**
   - Create positions for users in the gam3ya
   - Get all positions
   - Get position by ID

5. **Trade Positions:**
   - List a position for trade
   - Get positions available for trade
   - Buy/swap a position

6. **Update & Delete:**
   - Update gam3ya
   - Update position
   - Delete position
   - Delete gam3ya

---

## Import Postman Collection

You can import the existing Postman collection from:
```
EBD-PROJECT-1/server/postman_collection.json
```

This collection already includes some of the APIs with example requests.

