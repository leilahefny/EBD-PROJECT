
# [Gama3li_Shokran]

**Course:** Electronic Business Development (BINF 503)  
**Semester:** Winter 2025  
**Instructor:** Dr. Nourhan Hamdi  
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa

---

## 1. Team Members

_List all team members (5-6 students) below._

| Name             | Student ID | Tutorial Group | GitHub Username |
| :--------------- | :--------- | :------------- | :-------------- |
| [leila ashraf] | [13004147]       | [T1]           | [@leilahefny]     |
| [lina khaled] | [13001326]       | [T1]           | [@linamansy]     |
| [morin hanna] | [13001321]       | [T1]           | [@morin22]     |
| [hannah nagy] | [13007141]       | [T1]           | [@HanaNagy]     |
| [zeina ghalab] | [13001300]       | [T1]           | [@zeinaghalab]     |
| [jomana walid] | [13002562]       | [T1]           | [@jomanaouda]     |

---

## 2. Project Description

_Provide a detailed description of your project concept here. What is the app? What problem does it solve?_

- **Concept:** 
*Gama3li shokran* is a modern digital version of the traditional Gam3ya (rotating savings group). The application allows users to create or join savings groups, contribute a fixed monthly amount, and receive a full payout in one of the cycle months.

The twist that makes *Gama3li shokran* unique is the Payout Position Marketplace.
Instead of keeping a fixed payout order, users can list their payout position for trade, allowing other members to buy, swap, or negotiate their place in the cycle. This gives members more financial flexibility — especially those who urgently need their payout earlier or prefer to delay it.

The app aims to:

* Modernize the Gam3ya system
* Increase fairness and transparency
* Prevent conflicts about who takes money first
* Give members more control using trading, points, and trust scoring
* Provide a safe, organized digital environment for group savings
- **Link to Fin-Tech Course Document:** [Insert Link if applicable]

---

## 3. Feature Breakdown

### 3.1 Full Scope

_List ALL potential features/user stories envisioned for the complete product (beyond just this course).

-Create Gam3ya groups

-Join existing Gam3yas

-Automatic payout order generation

-Monthly payment tracking

-Monthly payout distributions

-Member profiles

-Notifications & reminders

-Marketplace for trading payout positions

-Buy/sell positions

-Swap positions

-Auction system for positions

-Trade history

-Trust Score for members

-Gamification points

-Priority boosts

-Auto-matching system

-Virtual wallet balance

-Transaction history

-Admin panel

-Chat inside Gam3ya

-Goal-based saving groups

-Analytics dashboard

-Dark mode

### 3.2 Selected MVP Use Cases (Course Scope)

_From the list above, identify the **5 or 6 specific use cases** you will implement for this course. Note: User Authentication is mandatory._

1.  **User Authentication** (Registration/Login)
2.  Create & Join Gam3ya
3.  Generate Payout Order Automatically
4.  Monthly Payment Tracking
5.  List Payout Position for Trade
6.  Buy/Swap a Payout Position

---

## 4. Feature Assignments (Accountability)

_Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature._

## 4. Feature Assignments

| Team Member | Feature / Use Case | Description |
|------------|---------------------|-------------|
| [Morin refaat]   | **User Authentication** | Register and login users using email and password. Saves users in the database. |
| [Hannah nagy]   | **Create & Join Gam3ya** | Create new gam3ya groups and allow users to join until max members is reached. |
| [Jomana Walid]   | **Generate Payout Order** | Once the gam3ya is full, automatically assign payout positions (1, 2, 3…). |
| [Leila Hefny]   | **Monthly Payment Tracking** | Users mark monthly payment as paid; update status for each cycle. |
| [Zeina Ghalab]   | **List Position for Trade** | User can put their payout position up for trade (set isForTrade = true). |
| [Lina Khaled]   | **Buy / Swap Position** | Allow another user to take or swap the payout position; update owner in database. |


---

## 5. Data Model (Initial Schemas)

_Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code._

### User Schema

```javascript
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields...
});
```

### [Gam3ya Schema] Schema

```javascript
const Gam3yaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthlyAmount: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

```
### [Position Schema] Schema

```javascript
const PositionSchema = new mongoose.Schema({
  gam3yaId: { type: mongoose.Schema.Types.ObjectId, ref: "Gam3ya", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  positionNumber: { type: Number, required: true },
  isForTrade: { type: Boolean, default: false }
});


```