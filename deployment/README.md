
# Spartan ZKP Microservice Deployment

This directory contains the Rust microservice that implements Microsoft's Spartan zero-knowledge proof protocol for the BankGuard ZKP application.

## Quick Deploy to Railway

### Step 1: Prepare the Code
1. Copy the entire `deployment/rust-spartan-service` folder to a new GitHub repository
2. Make sure all files are in the root of the repository:
   - `Cargo.toml`
   - `Dockerfile`
   - `src/main.rs`

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select the repository
4. Railway will automatically detect the Dockerfile and deploy
5. Wait for deployment to complete (usually 2-3 minutes)

### Step 3: Get Your Service URL
1. In Railway dashboard, click on your service
2. Go to "Settings" → "Domains"
3. Copy the generated URL (e.g., `https://your-service-name.up.railway.app`)

### Step 4: Configure in BankGuard ZKP
1. Open your BankGuard ZKP application
2. Go to the "WASM" tab
3. Enter your Railway service URL in the "Service URL" field (without /health)
4. Click "Test Connection" - it should show "Connected" status

## Troubleshooting Common Issues

### Issue: "Unexpected end of JSON input" or 500 errors

**Solution Steps:**
1. **Check Railway Logs**: Go to Railway dashboard → your service → "Deployments" → click latest deployment → view logs
2. **Verify Build Success**: Ensure the build completed without errors
3. **Test Endpoints Directly**:
   - Visit `https://your-service.up.railway.app/health` in browser
   - Should return: `{"status":"healthy","service":"spartan-zkp","version":"0.1.0","timestamp":"..."}`
4. **Redeploy**: If logs show issues, redeploy with the updated code

### Issue: Connection Failed

**Common Causes & Solutions:**
1. **Service Not Running**: Check Railway dashboard to ensure service is "Active"
2. **Wrong URL**: Ensure you're using the base URL (without `/health` suffix)
3. **Build Failure**: Check deployment logs for Rust compilation errors
4. **Port Issues**: Service should be binding to `0.0.0.0:8080`

### Issue: Build Failures

**Solutions:**
1. **Update Rust Version**: Ensure Railway is using Rust 1.75+
2. **Dependencies**: All required crates should auto-install
3. **Docker Issues**: Make sure Dockerfile is in repository root

## Manual Testing

### Test Health Endpoint
```bash
curl https://your-service.up.railway.app/health
# Expected: {"status":"healthy","service":"spartan-zkp","version":"0.1.0","timestamp":"..."}
```

### Test Proof Generation
```bash
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "prove", "witness_data": [50000, 75000], "max_balance": 100000}'
```

### Test Proof Verification
```bash
curl -X POST https://your-service.up.railway.app/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "verify", "proof_data": "{\"test\":\"proof\"}", "public_inputs": ["1"]}'
```

## Alternative: Deploy to Render

### Quick Steps:
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create "New Web Service" from GitHub repo
4. Use these settings:
   - **Build Command**: `cargo build --release`
   - **Start Command**: `./target/release/spartan-service`
   - **Environment**: Add `RUST_LOG=info` and `HOST=0.0.0.0`

## API Endpoints

- `GET /` - Root endpoint (health check)
- `GET /health` - Detailed health check
- `POST /zkp` - ZKP operations (prove/verify)
- `OPTIONS /zkp` - CORS preflight

## Local Testing

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Run locally
cd rust-spartan-service
cargo run

# Test health endpoint
curl http://localhost:8080/health

# Test proof generation
curl -X POST http://localhost:8080/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "prove", "witness_data": [50000, 75000], "max_balance": 100000}'
```

## Environment Variables

The service uses these environment variables:
- `PORT`: Port to bind to (default: 8080)
- `HOST`: Host to bind to (default: 0.0.0.0)
- `RUST_LOG`: Log level (default: info)

## Quick Fix for Current Issue

If you're seeing "Unexpected end of JSON input":

1. **Update your Railway deployment** with the latest code from this repository
2. **Redeploy** the service
3. **Wait 2-3 minutes** for deployment to complete
4. **Test** the health endpoint: `https://your-service.up.railway.app/health`
5. **Try connection test** again in BankGuard ZKP app

## Next Steps

After successful deployment:
1. The service will respond to all endpoints with proper JSON
2. Configure the service URL in your BankGuard ZKP app (base URL only)
3. Test proof generation and verification
4. Optionally add API key authentication for production use

## Note on Implementation

This is currently a **working template** with simulated Spartan operations. For production use, you would need to integrate the actual Microsoft Spartan library for real zero-knowledge proofs.
