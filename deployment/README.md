
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
3. Enter your Railway service URL in the "Service URL" field
4. Click "Test Connection" - it should show "Connected" status

## Alternative: Deploy to Render

### Quick Steps:
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create "New Web Service" from GitHub repo
4. Use these settings:
   - **Build Command**: `cargo build --release`
   - **Start Command**: `./target/release/spartan-service`
   - **Environment**: Add `RUST_LOG=info` and `HOST=0.0.0.0`

## Troubleshooting

### Common Issues:

1. **500 Error on /health**:
   - Check Railway/Render logs for build errors
   - Ensure all dependencies are properly installed
   - Verify the service is listening on the correct port

2. **Connection Refused**:
   - Make sure the service URL is correct
   - Check if the service is actually running
   - Verify CORS headers are properly set

3. **Build Failures**:
   - Ensure Rust 1.75+ compatibility
   - Check for missing system dependencies
   - Review the Dockerfile for proper setup

### Debugging Steps:
1. Check deployment logs in Railway/Render dashboard
2. Test the `/health` endpoint directly in browser
3. Verify environment variables are set correctly
4. Check that the service is binding to `0.0.0.0:8080`

## API Endpoints

- `GET /health` - Health check (returns JSON status)
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

## Next Steps

After successful deployment:
1. The service will respond to `/health` with a JSON status
2. Configure the service URL in your BankGuard ZKP app
3. Test proof generation and verification
4. Optionally add API key authentication for production use

## Note on Implementation

This is currently a **working template** with simulated Spartan operations. For production use, you would need to integrate the actual Microsoft Spartan library for real zero-knowledge proofs.
