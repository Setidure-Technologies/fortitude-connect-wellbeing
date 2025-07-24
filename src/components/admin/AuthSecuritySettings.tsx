import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, Shield, Info } from 'lucide-react';

export const AuthSecuritySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The following security settings must be configured manually in the Supabase Dashboard. 
              These cannot be automated via database migrations.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">OTP Expiry Configuration</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current OTP expiry exceeds recommended security threshold.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href="https://supabase.com/docs/guides/platform/going-into-prod#security" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        View Configuration Guide
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pl-8">
                <h4 className="font-medium text-sm">Steps to fix:</h4>
                <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
                  <li>Go to Supabase Dashboard → Authentication → Settings</li>
                  <li>Navigate to "Email/SMS" section</li>
                  <li>Set OTP expiry to 10 minutes or less</li>
                  <li>Save the changes</li>
                </ol>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Leaked Password Protection</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Password breach protection is currently disabled.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href="https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        View Password Security Guide
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pl-8">
                <h4 className="font-medium text-sm">Steps to fix:</h4>
                <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
                  <li>Go to Supabase Dashboard → Authentication → Settings</li>
                  <li>Navigate to "Password" section</li>
                  <li>Enable "Leaked password protection"</li>
                  <li>Configure minimum password strength requirements</li>
                  <li>Save the changes</li>
                </ol>
              </div>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Once these settings are configured, the security warnings will be resolved. 
              These changes take effect immediately and help protect user accounts from common security threats.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};