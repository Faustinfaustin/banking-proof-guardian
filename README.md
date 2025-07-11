
# 🛡 Spartan ZKP Microservice for BankGuard

## Recent Fixes

* **Fixed:** `500 Unexpected end of JSON input` on GET requests
* **Improved:** Split handlers by method (GET, POST)
* **Added:** CORS headers, clearer error responses, and structured JSON output

## 🛠 Quick Deployment (Railway)

### **Step 1: Prepare Code**

Ensure the following files are at the root of your GitHub repo:

* `Cargo.toml`
* `Dockerfile`
* `src/main.rs`

### **Step 2: Deploy to Railway**

1. Go to [Railway.app](https://railway.app)
2. Create a new project → **Deploy from GitHub repo**
3. Connect your repo → Railway auto-detects the Dockerfile and starts deployment

### **Step 3: Copy Your Live URL**

Found in:
**Railway Dashboard → Your Service → Settings → Domains**
Example: `https://your-service.up.railway.app`

### **Step 4: Test the API**

```bash
# Root Endpoint
curl https://your-service.up.railway.app/

# Health Check
curl https://your-service.up.railway.app/health

# ZKP Proof Generation
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "prove", "witness_data": [50000, 75000], "max_balance": 100000}'

# ZKP Proof Verification
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "verify", "proof_data": "{\"test\":\"proof\"}", "public_inputs": ["1"]}'
```

##  API Endpoints

| Endpoint  | Method  | Description            |
| --------- | ------- | ---------------------- |
| `/`       | GET     | Basic service metadata |
| `/health` | GET     | Health check           |
| `/zkp`    | POST    | Prove or verify proof  |
| `/zkp`    | OPTIONS | CORS preflight check   |

### Example JSON Response (GET `/health`)

```json
{
  "status": "healthy",
  "service": "spartan-zkp",
  "version": "0.1.0",
  "timestamp": "2024-12-07T14:30:00Z",
  "uptime": "online",
  "endpoints": ["GET /", "GET /health", "POST /zkp", "OPTIONS /zkp"]
}
```

---

##  Integrate with FaustinBank ZKP

1. Open **BankGuard ZKP**
2. Go to the **WASM** tab
3. Enter your base service URL (e.g., `https://your-service.up.railway.app`)
4. Click **Test Connection** – status should be **Connected**

### 💻 Edit Locally with Your IDE

```bash
# Step 1: Clone the project
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
```

### ✍️ Edit on GitHub

* Open the file you want to edit
* Click the 🖉 pencil icon
* Edit → Commit → Done

### 💡 Use GitHub Codespaces

* Go to your repo → Click **Code** → **Codespaces** → **New codespace**
* Edit in browser and push changes

---

## 🧪 Technologies Used

This project combines a Rust-based backend with a modern frontend stack:

* **Rust**, **Actix-web**, **Spartan ZKP (simulated)**
* **Frontend (Lovable project):**

  * Vite + TypeScript + React
  * Tailwind CSS + shadcn/ui

---
## 🔐 Next Steps for Production

* Add API key authentication or JWT verification
* Integrate real Spartan ZKP library from Microsoft for production proofs
* Implement logging, rate limiting, and monitoring tools

---

## 🧯 Troubleshooting

| Problem                    | Solution                                   |
| -------------------------- | ------------------------------------------ |
| 500 JSON Error on GET      | Ensure you're not parsing JSON on GET      |
| CORS issues                | Verify `OPTIONS` is handled properly       |
| Rust build failures        | Check logs under **Railway → Deployments** |
| POST `/zkp` not responding | Confirm request payload structure          |

---

##  Environment Variables (Railway)

| Variable   | Purpose                       |
| ---------- | ----------------------------- |
| `PORT`     | Set by Railway (usually 8080) |
| `HOST`     | Defaults to `0.0.0.0`         |
| `RUST_LOG` | Log level (e.g., info)        |

---

## 👏 Acknowledgments

* Spartan Protocol – Microsoft Research
* Railway Deployment Platform
* Lovable – AI-driven UI generation
* Actix Web – Rust server framework

---


