# Step-by-Step Guide to Launch the Web App

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Terminal/PowerShell access

---

## Step 1: Navigate to the Server Directory

Open your terminal/PowerShell and navigate to the server directory:

```bash
cd EBD-PROJECT-1/server
```

---

## Step 2: Install Dependencies

Install all required npm packages for the server:

```bash
npm install
```

**Note:** This may take a few minutes the first time as it downloads all dependencies.

---

## Step 3: Set Up Environment Variables

Create a `.env` file in the `server` directory. You can copy from the sample:

**On Windows (PowerShell):**
```powershell
Copy-Item env.sample .env
```

**On Windows (Command Prompt):**
```cmd
copy env.sample .env
```

**On Mac/Linux:**
```bash
cp env.sample .env
```

The `.env` file should contain:
```
PORT=5000
MONGO_URI=mongodb+srv://zienaghalab:zeinazozo@ebd.t8ake35.mongodb.net/?appName=ebd
```

**Note:** If you're using a different MongoDB connection string, update `MONGO_URI` in the `.env` file.

---

## Step 4: Start the Server

You have two options:

### Option A: Development Mode (with auto-restart)
```bash
npm run dev
```

This uses `nodemon` which automatically restarts the server when you make code changes.

### Option B: Production Mode
```bash
npm start
```

This runs the server normally without auto-restart.

---

## Step 5: Verify Server is Running

You should see output similar to:
```
Server running on port 5000
MongoDB connected: ...
```

**Test the server:**
Open your browser or Postman and visit:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "Gama3li Shokran API running"
}
```

---

## Step 6: (Optional) Start the Frontend

If you want to run the frontend React app, open a **new terminal window**:

```bash
# Navigate to the project root
cd EBD-PROJECT-1

# Install frontend dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite default port).

---

## Quick Start Commands Summary

**Backend Server:**
```bash
cd EBD-PROJECT-1/server
npm install
Copy-Item env.sample .env    # Windows PowerShell
npm run dev                  # Start server
```

**Frontend (Optional):**
```bash
cd EBD-PROJECT-1
npm install
npm run dev                  # Start frontend
```

---

## Troubleshooting

### Port Already in Use
If you see `Port 5000 is already in use`:
- Change the `PORT` in your `.env` file to a different port (e.g., `5001`)
- Or stop the process using port 5000

### MongoDB Connection Error
If you see MongoDB connection errors:
- Verify your `MONGO_URI` in the `.env` file is correct
- Check your internet connection
- Ensure MongoDB Atlas allows connections from your IP address

### Module Not Found Errors
If you see module errors:
- Make sure you ran `npm install` in the `server` directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Dependencies Not Installed
If you see errors about missing packages:
```bash
cd EBD-PROJECT-1/server
npm install
```

---

## Testing APIs in Postman

Once the server is running, you can test your APIs:

1. **Base URL:** `http://localhost:5000`
2. **Import Postman Collection:** `EBD-PROJECT-1/server/postman_collection.json`
3. **See API Guide:** `EBD-PROJECT-1/server/API_TESTING_GUIDE.md`

---

## Stopping the Server

To stop the server:
- Press `Ctrl + C` in the terminal where the server is running

