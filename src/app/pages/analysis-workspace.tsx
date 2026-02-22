import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import UrgencyDashboard from '../components/analysis/urgency-dashboard';
import XRayViewer from '../components/analysis/xray-viewer';
import ToothChart from '../components/analysis/tooth-chart';
import FindingsTab from '../components/analysis/findings-tab';
import ClinicalReportTab from '../components/analysis/clinical-report-tab';
import AIAssistantTab from '../components/analysis/ai-assistant-tab';
import { Button } from '../components/ui/button';
import { ChevronLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { useCaseAnalysis } from '../hooks/useCaseAnalysis';

export default function AnalysisWorkspace() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothChartExpanded, setToothChartExpanded] = useState(false);
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(null);
  const { caseData, status, error } = useCaseAnalysis(caseId);

  const findings = caseData?.findings ?? [];
  const urgency = caseData?.urgency ?? {
    level: 'attention',
    score: 0,
    timeline: 'Processing',
    action: 'AI analysis in progress',
    summary: 'Your radiograph is being analyzed.',
    priorityFindings: [],
    recommendation: 'Please wait for results',
  };

  const patientLabel = useMemo(() => {
    if (caseData?.patientId) return caseData.patientId;
    return 'Patient';
  }, [caseData?.patientId]);

  const dateLabel = useMemo(() => {
    if (!caseData?.createdAt) return 'Processing';
    try {
      return new Date(caseData.createdAt).toLocaleString();
    } catch {
      return caseData.createdAt;
    }
  }, [caseData?.createdAt]);

  const handleToothSelect = (tooth: number | null) => {
    setSelectedTooth(tooth);
    if (tooth == null) {
      setSelectedFindingId(null);
      return;
    }
    const match = findings.find((finding) => finding.tooth === tooth);
    setSelectedFindingId(match ? match.id : null);
  };

  const handleFindingSelect = (id: number) => {
    setSelectedFindingId(id);
    const match = findings.find((finding) => finding.id === id);
    setSelectedTooth(match ? match.tooth : null);
  };

  useEffect(() => {
    setSelectedFindingId(null);
    setSelectedTooth(null);
  }, [caseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{patientLabel}</h1>
              <p className="text-sm text-gray-600">{dateLabel}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/report/${caseId}`)}>
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Report</span>
            </Button>
            <Button onClick={() => navigate(`/findings/${caseId}`)}>
              Review Findings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Urgency Dashboard - Always visible first */}
        <div className="mb-6">
          {status === 'error' ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-700">Unable to load analysis: {error}</p>
              </CardContent>
            </Card>
          ) : (
            <UrgencyDashboard urgency={urgency} />
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left Column - X-ray Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <XRayViewer 
              findings={findings}
              showAnnotations={showAnnotations}
              onToggleAnnotations={setShowAnnotations}
              selectedTooth={selectedTooth}
              selectedFindingId={selectedFindingId}
              onSelectFinding={(id) => (id ? handleFindingSelect(id) : setSelectedFindingId(null))}
              imageUrl={caseData?.previewUrl}
              imageWidth={caseData?.imageWidth}
              imageHeight={caseData?.imageHeight}
            />
            
            <ToothChart 
              findings={findings}
              onToothSelect={handleToothSelect}
              selectedTooth={selectedTooth}
            />
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="findings" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="ai">AI Chat</TabsTrigger>
              </TabsList>
              
              <TabsContent value="findings" className="mt-4">
                <FindingsTab findings={findings} onSelectFinding={handleFindingSelect} />
              </TabsContent>
              
              <TabsContent value="report" className="mt-4">
                <ClinicalReportTab caseData={caseData} />
              </TabsContent>
              
              <TabsContent value="ai" className="mt-4">
                <AIAssistantTab caseId={caseId!} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          <XRayViewer 
            findings={findings}
            showAnnotations={showAnnotations}
            onToggleAnnotations={setShowAnnotations}
            selectedTooth={selectedTooth}
            selectedFindingId={selectedFindingId}
            onSelectFinding={(id) => (id ? handleFindingSelect(id) : setSelectedFindingId(null))}
            imageUrl={caseData?.previewUrl}
            imageWidth={caseData?.imageWidth}
            imageHeight={caseData?.imageHeight}
          />

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setToothChartExpanded(!toothChartExpanded)}
          >
            {toothChartExpanded ? 'Hide' : 'Show'} Tooth Chart
          </Button>

          {toothChartExpanded && (
            <ToothChart 
              findings={findings}
              onToothSelect={handleToothSelect}
              selectedTooth={selectedTooth}
            />
          )}

          <Tabs defaultValue="findings" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="findings" className="text-xs sm:text-sm">Findings</TabsTrigger>
              <TabsTrigger value="report" className="text-xs sm:text-sm">Report</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs sm:text-sm">AI Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="findings" className="mt-4">
              <FindingsTab findings={findings} onSelectFinding={handleFindingSelect} />
            </TabsContent>
            
            <TabsContent value="report" className="mt-4">
              <ClinicalReportTab caseData={caseData} />
            </TabsContent>
            
            <TabsContent value="ai" className="mt-4">
              <AIAssistantTab caseId={caseId!} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
