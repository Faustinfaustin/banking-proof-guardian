
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

## IMPORTANT: Updated Fix for 500 Errors

**If you're getting "Unexpected end of JSON input" or 500 errors:**

1. **Update Your Code**: Replace your entire `src/main.rs` file with the latest version from this repository
2. **Redeploy**: Push changes to GitHub and redeploy on Railway
3. **Wait for Build**: Ensure the build completes successfully (2-3 minutes)
4. **Test Endpoints**:
   - Visit `https://your-service.up.railway.app/` - should return health status
   - Visit `https://your-service.up.railway.app/health` - should return detailed health info
5. **Both should return proper JSON without errors**

## Expected Responses

### Root endpoint (`/`)
```json
{
  "status": "healthy",
  "service": "spartan-zkp",
  "version": "0.1.0",
  "timestamp": "2024-12-07T14:30:00Z"
}
```

### Health endpoint (`/health`)
```json
{
  "status": "healthy",
  "service": "spartan-zkp",
  "version": "0.1.0",
  "timestamp": "2024-12-07T14:30:00Z"
}
```

## Manual Testing

### Test Root Endpoint
```bash
curl https://your-service.up.railway.app/
```

### Test Health Endpoint
```bash
curl https://your-service.up.railway.app/health
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

## Troubleshooting Railway Deployment

### Check Railway Logs
1. Go to Railway dashboard
2. Click on your service
3. Click "Deployments" tab
4. Click on the latest deployment
5. View the build and runtime logs

### Common Issues and Solutions

**Issue: Build fails with Rust errors**
- Ensure you're using the latest `Cargo.toml` and `src/main.rs` files
- Check that all dependencies are correctly specified

**Issue: Service starts but returns 500 errors**
- Update to the latest `src/main.rs` code (fixes JSON parsing issues)
- Redeploy and wait for completion

**Issue: CORS errors in browser**
- The updated code includes proper CORS headers
- Make sure you're using the latest version

**Issue: Connection timeout**
- Check that Railway assigned a domain to your service
- Verify the service is running (not crashed) in Railway dashboard

## Environment Variables

The service uses these environment variables (automatically set by Railway):
- `PORT`: Port to bind to (Railway sets this automatically)
- `HOST`: Host to bind to (default: 0.0.0.0)
- `RUST_LOG`: Log level (default: info)

## API Endpoints

- `GET /` - Root endpoint (returns health status)
- `GET /health` - Detailed health check
- `POST /zkp` - ZKP operations (prove/verify)
- `OPTIONS /zkp` - CORS preflight

## Alternative: Deploy to Render

### Quick Steps:
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create "New Web Service" from GitHub repo
4. Use these settings:
   - **Build Command**: `cargo build --release`
   - **Start Command**: `./target/release/spartan-service`
   - **Environment**: Add `RUST_LOG=info` and `HOST=0.0.0.0`

## Next Steps

After successful deployment:
1. Both `/` and `/health` endpoints should return proper JSON
2. Configure the service URL in your BankGuard ZKP app (base URL only)
3. Test proof generation and verification
4. Optionally add API key authentication for production use

## Note on Implementation

This is currently a **working template** with simulated Spartan operations. For production use, you would need to integrate the actual Microsoft Spartan library for real zero-knowledge proofs.
