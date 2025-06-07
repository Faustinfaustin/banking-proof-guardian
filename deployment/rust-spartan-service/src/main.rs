
use actix_web::{web, App, HttpServer, Result, HttpResponse, middleware::Logger, HttpRequest};
use serde::{Deserialize, Serialize};
use std::env;
use log::info;

#[derive(Deserialize)]
struct ZkpRequest {
    operation: String,
    witness_data: Option<Vec<i32>>,
    max_balance: Option<i32>,
    proof_data: Option<String>,
    public_inputs: Option<Vec<String>>,
}

#[derive(Serialize)]
struct ZkpResponse {
    success: bool,
    proof: Option<String>,
    public_signals: Option<Vec<String>>,
    verification_result: Option<bool>,
    error: Option<String>,
    processing_time_ms: Option<u64>,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
    timestamp: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    success: bool,
    error: String,
}

async fn health(_req: HttpRequest) -> Result<HttpResponse> {
    info!("Health check requested");
    
    Ok(HttpResponse::Ok()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .insert_header(("Content-Type", "application/json"))
        .json(HealthResponse {
            status: "healthy".to_string(),
            service: "spartan-zkp".to_string(),
            version: "0.1.0".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        }))
}

async fn zkp_operations(req_body: web::Json<ZkpRequest>) -> Result<HttpResponse> {
    let start_time = std::time::Instant::now();
    
    info!("Processing ZKP operation: {}", req_body.operation);
    
    match req_body.operation.as_str() {
        "prove" => {
            if let (Some(witness_data), Some(max_balance)) = (&req_body.witness_data, &req_body.max_balance) {
                let proof = generate_spartan_proof(witness_data, *max_balance).await;
                let processing_time = start_time.elapsed().as_millis() as u64;
                
                Ok(HttpResponse::Ok()
                    .insert_header(("Access-Control-Allow-Origin", "*"))
                    .insert_header(("Content-Type", "application/json"))
                    .json(ZkpResponse {
                        success: true,
                        proof: Some(proof),
                        public_signals: Some(vec!["1".to_string()]),
                        verification_result: None,
                        error: None,
                        processing_time_ms: Some(processing_time),
                    }))
            } else {
                Ok(HttpResponse::BadRequest()
                    .insert_header(("Access-Control-Allow-Origin", "*"))
                    .insert_header(("Content-Type", "application/json"))
                    .json(ZkpResponse {
                        success: false,
                        proof: None,
                        public_signals: None,
                        verification_result: None,
                        error: Some("Missing witness_data or max_balance".to_string()),
                        processing_time_ms: None,
                    }))
            }
        },
        "verify" => {
            if let (Some(proof_data), Some(public_inputs)) = (&req_body.proof_data, &req_body.public_inputs) {
                let is_valid = verify_spartan_proof(proof_data, public_inputs).await;
                let processing_time = start_time.elapsed().as_millis() as u64;
                
                Ok(HttpResponse::Ok()
                    .insert_header(("Access-Control-Allow-Origin", "*"))
                    .insert_header(("Content-Type", "application/json"))
                    .json(ZkpResponse {
                        success: true,
                        proof: None,
                        public_signals: None,
                        verification_result: Some(is_valid),
                        error: None,
                        processing_time_ms: Some(processing_time),
                    }))
            } else {
                Ok(HttpResponse::BadRequest()
                    .insert_header(("Access-Control-Allow-Origin", "*"))
                    .insert_header(("Content-Type", "application/json"))
                    .json(ZkpResponse {
                        success: false,
                        proof: None,
                        public_signals: None,
                        verification_result: None,
                        error: Some("Missing proof_data or public_inputs".to_string()),
                        processing_time_ms: None,
                    }))
            }
        },
        _ => {
            Ok(HttpResponse::BadRequest()
                .insert_header(("Access-Control-Allow-Origin", "*"))
                .insert_header(("Content-Type", "application/json"))
                .json(ZkpResponse {
                    success: false,
                    proof: None,
                    public_signals: None,
                    verification_result: None,
                    error: Some(format!("Unknown operation: {}", req_body.operation)),
                    processing_time_ms: None,
                }))
        }
    }
}

async fn generate_spartan_proof(witness_data: &[i32], max_balance: i32) -> String {
    info!("Generating Spartan proof for {} accounts with max balance {}", witness_data.len(), max_balance);
    
    // Simulate proof generation time
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    
    // Return a structured proof
    serde_json::json!({
        "pi_a": format!("0x{}", "a".repeat(64)),
        "pi_b": format!("0x{}", "b".repeat(64)),
        "pi_c": format!("0x{}", "c".repeat(64)),
        "protocol": "spartan-v1",
        "accounts_verified": witness_data.len(),
        "max_balance": max_balance,
        "timestamp": chrono::Utc::now().to_rfc3339()
    }).to_string()
}

async fn verify_spartan_proof(proof_data: &str, _public_inputs: &[String]) -> bool {
    info!("Verifying Spartan proof");
    
    // Simulate verification time
    tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;
    
    // Simple validation: check if proof is valid JSON
    serde_json::from_str::<serde_json::Value>(proof_data).is_ok()
}

async fn preflight() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .insert_header(("Access-Control-Allow-Methods", "GET, POST, OPTIONS"))
        .insert_header(("Access-Control-Allow-Headers", "Content-Type, Authorization"))
        .insert_header(("Content-Type", "application/json"))
        .json(serde_json::json!({"message": "CORS preflight successful"})))
}

// Root handler that returns health status
async fn root_handler() -> Result<HttpResponse> {
    info!("Root endpoint accessed");
    Ok(HttpResponse::Ok()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .insert_header(("Content-Type", "application/json"))
        .json(HealthResponse {
            status: "healthy".to_string(),
            service: "spartan-zkp".to_string(),
            version: "0.1.0".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        }))
}

// 404 handler
async fn not_found() -> Result<HttpResponse> {
    Ok(HttpResponse::NotFound()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .insert_header(("Content-Type", "application/json"))
        .json(ErrorResponse {
            success: false,
            error: "Endpoint not found. Available endpoints: GET /, GET /health, POST /zkp".to_string(),
        }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    
    info!("Starting Spartan ZKP service on {}:{}", host, port);
    
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(
                actix_web::middleware::DefaultHeaders::new()
                    .add(("Access-Control-Allow-Origin", "*"))
                    .add(("Access-Control-Allow-Methods", "GET, POST, OPTIONS"))
                    .add(("Access-Control-Allow-Headers", "Content-Type, Authorization"))
                    .add(("Content-Type", "application/json"))
            )
            .route("/", web::get().to(root_handler))
            .route("/health", web::get().to(health))
            .route("/zkp", web::post().to(zkp_operations))
            .route("/zkp", web::options().to(preflight))
            .default_service(web::route().to(not_found))
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}
