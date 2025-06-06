
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SpartanServiceConfig = () => {
  const [serviceUrl, setServiceUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const { toast } = useToast();

  const testConnection = async () => {
    if (!serviceUrl.trim()) {
      toast({
        title: "Service URL Required",
        description: "Please enter the Spartan service URL",
        variant: "destructive"
      });
      return;
    }

    setTestingConnection(true);
    
    try {
      // Test the connection to the external service
      const response = await fetch(`${serviceUrl}/health`, {
        method: 'GET',
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
      });

      if (response.ok) {
        setConnectionStatus('connected');
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Spartan service",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: `Server responded with status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to connect to Spartan service",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-400">
            Not Tested
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-orange-400" />
            External Spartan Service Configuration
          </div>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription className="text-blue-200">
          Configure connection to external Rust microservice implementing Microsoft's Spartan protocol
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service URL Configuration */}
        <div className="space-y-2">
          <label className="text-white font-medium">Service URL</label>
          <Input
            placeholder="https://your-spartan-service.herokuapp.com"
            value={serviceUrl}
            onChange={(e) => setServiceUrl(e.target.value)}
            className="bg-black/30 border-white/20 text-gray-300"
          />
          <p className="text-sm text-blue-200">
            URL of the deployed Rust microservice implementing Spartan protocol
          </p>
        </div>

        {/* API Key Configuration */}
        <div className="space-y-2">
          <label className="text-white font-medium">API Key (Optional)</label>
          <Input
            type="password"
            placeholder="Enter API key for authentication"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-black/30 border-white/20 text-gray-300"
          />
          <p className="text-sm text-blue-200">
            Optional API key for securing the external service
          </p>
        </div>

        {/* Test Connection */}
        <Button 
          onClick={testConnection}
          disabled={testingConnection || !serviceUrl.trim()}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          {testingConnection ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>

        {/* Configuration Instructions */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-2">Setup Instructions</h4>
          <div className="space-y-2 text-sm text-blue-200">
            <p>1. Deploy a Rust microservice using Microsoft's Spartan library</p>
            <p>2. Ensure it exposes endpoints:</p>
            <div className="ml-4 space-y-1 font-mono text-xs">
              <p>• <span className="text-green-300">POST /zkp</span> - for proof generation/verification</p>
              <p>• <span className="text-green-300">GET /health</span> - for connection testing</p>
            </div>
            <p>3. Configure the service URL and API key in Supabase secrets</p>
            <p>4. Test the connection to ensure everything works</p>
          </div>
        </div>

        {/* External Links */}
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.open('https://github.com/Microsoft/Spartan', '_blank')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Microsoft Spartan
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.open('https://railway.app', '_blank')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Deploy on Railway
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpartanServiceConfig;
