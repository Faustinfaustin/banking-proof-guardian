
# Spartan ZKP Microservice Deployment

This directory contains the Rust microservice that implements Microsoft's Spartan zero-knowledge proof protocol for the BankGuard ZKP application.

## Quick Start

### Option 1: Deploy to Railway (Recommended)

1. **Push to GitHub**: Push this `deployment/rust-spartan-service` folder to a GitHub repository
2. **Connect to Railway**: 
   - Go to [Railway.app](https://railway.app)
   - Create a new project from GitHub repo
   - Select the repository containing this code
3. **Configure**: Railway will automatically detect the `railway.toml` configuration
4. **Deploy**: Railway will build and deploy automatically
5. **Get URL**: Copy the deployed service URL (e.g., `https://your-app.railway.app`)

### Option 2: Deploy to Render

1. **Push to GitHub**: Push this code to a GitHub repository
2. **Connect to Render**:
   - Go to [Render.com](https://render.com)
   - Create new Web Service from GitHub
   - Select your repository
3. **Configure**: Use the `render.yaml` configuration
4. **Deploy**: Render will build and deploy automatically

### Option 3: Deploy to Heroku

1. **Install Heroku CLI** and login
2. **Create app**: `heroku create your-spartan-service`
3. **Add Rust buildpack**: `heroku buildpacks:set emk/rust`
4. **Deploy**: `git push heroku main`
5. **Set environment**: `heroku config:set RUST_LOG=info`

## Local Development

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone and run
cd rust-spartan-service
cargo run

# Test endpoints
curl http://localhost:8080/health
curl -X POST http://localhost:8080/zkp \
  -H "Content-Type: application/json" \
  -d '{"operation": "prove", "witness_data": [50000, 75000], "max_balance": 100000}'
```

## Configuration in BankGuard ZKP

After deployment:

1. **Copy your service URL** (e.g., `https://your-app.railway.app`)
2. **Open BankGuard ZKP** application
3. **Go to WASM tab** in the application
4. **Enter Service URL** in the Spartan Service Configuration
5. **Test Connection** to verify it works
6. **Configure in Supabase** (optional): Add `SPARTAN_SERVICE_URL` to Supabase secrets

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /zkp` - Main ZKP operations endpoint

### Request Format

```json
{
  "operation": "prove" | "verify",
  "witness_data": [50000, 75000],  // For prove operation
  "max_balance": 100000,           // For prove operation
  "proof_data": "...",             // For verify operation
  "public_inputs": ["1"]           // For verify operation
}
```

## Implementation Status

⚠️ **Current Status**: This is a **template/placeholder** implementation. The actual Spartan protocol integration needs to be completed.

### TODO for Production Use:

1. **Integrate Microsoft Spartan**: Replace placeholder functions with actual Spartan library calls
2. **Security**: Add proper API key authentication
3. **Circuit Definition**: Define the actual constraint system for balance verification
4. **Testing**: Add comprehensive test suite
5. **Monitoring**: Add metrics and logging
6. **Documentation**: Add API documentation

## Security Notes

- The service runs on HTTP by default (HTTPS termination handled by deployment platform)
- API key authentication should be implemented for production use
- Consider rate limiting for production deployments
- Ensure proper error handling and input validation

## Troubleshooting

- **Build Errors**: Ensure Rust 1.75+ is installed
- **Connection Issues**: Check CORS headers and firewall settings
- **Port Issues**: Default port is 8080, configurable via `PORT` environment variable
- **Logs**: Check deployment platform logs for debugging information
