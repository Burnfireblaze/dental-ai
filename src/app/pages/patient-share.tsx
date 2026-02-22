import { useState } from 'react';
import { Mail, Download, Link2, FileText, Image as ImageIcon, CheckCircle, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function PatientShare() {
  const [shareMethod, setShareMethod] = useState<'email' | 'link' | null>(null);
  const [email, setEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGenerateLink = () => {
    const link = `https://dentalai.app/shared/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
      setShareMethod(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Share Records</h1>
          <p className="text-gray-600">Share your dental records with another dentist or healthcare provider</p>
        </div>

        {/* Available Records */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Records</h2>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="mt-1" defaultChecked />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Latest X-ray</span>
                </div>
                <p className="text-sm text-gray-600">Panoramic X-ray - January 15, 2026</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="mt-1" defaultChecked />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-900">Clinical Report</span>
                </div>
                <p className="text-sm text-gray-600">Comprehensive report with findings - January 15, 2026</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Previous X-ray</span>
                </div>
                <p className="text-sm text-gray-600">Bitewing X-ray - July 10, 2025</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-900">Treatment History</span>
                </div>
                <p className="text-sm text-gray-600">Complete timeline of treatments</p>
              </div>
            </label>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How would you like to share?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setShareMethod('email')}
              className={`p-4 border rounded-lg text-left transition-all ${
                shareMethod === 'email'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Mail className={`h-6 w-6 mb-2 ${shareMethod === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-medium text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-600">Send directly to provider</p>
            </button>

            <button
              onClick={() => {
                setShareMethod('link');
                handleGenerateLink();
              }}
              className={`p-4 border rounded-lg text-left transition-all ${
                shareMethod === 'link'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Link2 className={`h-6 w-6 mb-2 ${shareMethod === 'link' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-medium text-gray-900 mb-1">Share Link</h3>
              <p className="text-sm text-gray-600">Generate secure link</p>
            </button>

            <button
              className="p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Download className="h-6 w-6 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Download</h3>
              <p className="text-sm text-gray-600">Save as PDF</p>
            </button>
          </div>

          {/* Email Form */}
          {shareMethod === 'email' && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {!emailSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="dentist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Add a message for the recipient..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> The shared records will be accessible for 30 days. The recipient will receive a secure link to view the records.
                    </p>
                  </div>

                  <Button
                    onClick={handleSendEmail}
                    disabled={!email}
                    className="w-full sm:w-auto"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Records
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Email sent successfully!</p>
                    <p className="text-sm text-green-700">The recipient will receive the records shortly.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Link Sharing */}
          {shareMethod === 'link' && shareLink && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Secure Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="h-11 font-mono text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    {linkCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>Security Notice:</strong> This link will expire in 30 days and can be accessed without authentication. Only share with trusted healthcare providers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Link Expiration</p>
                  <p className="font-medium text-gray-900">30 days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Access Count</p>
                  <p className="font-medium text-gray-900">0 views</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Shares */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Shares</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Dr. Sarah Chen</p>
                <p className="text-sm text-gray-600">dental.clinic@example.com</p>
                <p className="text-xs text-gray-500 mt-1">Shared on Jan 20, 2026 • Expires Feb 19, 2026</p>
              </div>
              <Button size="sm" variant="outline">Revoke</Button>
            </div>

            <div className="text-center py-8 text-gray-500 text-sm">
              No other recent shares
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
