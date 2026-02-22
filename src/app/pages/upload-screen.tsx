import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileImage, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { analyzeXray, getJob } from '../services/ai-api';

export default function UploadScreen() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
      }
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const response = await analyzeXray({
        file: selectedFile,
        doctorNotes,
      });

      const caseId = response.case_id;
      const jobId = response.job_id;
      setUploadProgress(5);

      const pollStatus = async () => {
        try {
          const job = await getJob(jobId);
          setUploadProgress(job.progress);
          if (job.status === 'complete') {
            if (pollRef.current) {
              window.clearInterval(pollRef.current);
              pollRef.current = null;
            }
            localStorage.setItem('lastCaseId', caseId);
            setTimeout(() => {
              navigate(`/analysis/${caseId}`);
            }, 300);
          }
          if (job.status === 'failed') {
            throw new Error(job.error || 'Analysis failed');
          }
        } catch (err) {
          if (pollRef.current) {
            window.clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setUploadError(err instanceof Error ? err.message : 'Unable to analyze X-ray');
          setUploading(false);
        }
      };

      pollRef.current = window.setInterval(pollStatus, 1200);
      pollStatus();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unable to upload X-ray');
      setUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">X-ray Analysis</h1>
        <p className="text-gray-600 mt-1">Upload dental radiograph for AI-assisted analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload X-ray Image</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Drag and drop your X-ray here
                    </p>
                    <p className="text-sm text-gray-600 mb-4">or</p>
                    <label>
                      <input
                        type="file"
                        accept="image/*,.dcm"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button type="button" asChild>
                        <span className="cursor-pointer">Select File</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, DICOM (.dcm)
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileImage className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                    )}
                    {uploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {uploadProgress < 100 ? 'Uploading and analyzing...' : 'Complete!'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctor Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Clinical notes or patient history</Label>
              <Textarea
                id="notes"
                placeholder="Enter any relevant clinical information, patient symptoms, or specific areas of concern..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={4}
                disabled={uploading}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                These notes will be included in the analysis report and can help provide context for AI findings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/home')}
            disabled={uploading}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="sm:w-auto w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        </div>

        {/* Info Box */}
        {!uploading && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• AI will analyze the radiograph for dental conditions</li>
                    <li>• Findings will be categorized by urgency level</li>
                    <li>• You can review, accept, or correct AI detections</li>
                    <li>• A comprehensive clinical report will be generated</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
