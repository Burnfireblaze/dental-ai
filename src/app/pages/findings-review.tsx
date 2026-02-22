import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import DetectionCard from '../components/findings/detection-card';
import CorrectionForm from '../components/findings/correction-form';
import { Checkbox } from '../components/ui/checkbox';
import { useCaseAnalysis } from '../hooks/useCaseAnalysis';
import { sendFeedback, summarizeFindings } from '../services/ai-api';
import type { Finding } from '../types/ai';

export default function FindingsReview() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { caseData } = useCaseAnalysis(caseId);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [approved, setApproved] = useState<boolean>(() => {
    if (!caseId) return false;
    return sessionStorage.getItem(`case-approved-${caseId}`) === 'true';
  });
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);

  const [editingFinding, setEditingFinding] = useState<number | null>(null);

  useEffect(() => {
    if (caseData?.findings) {
      setFindings(caseData.findings);
      setSelectedIds([]);
    }
  }, [caseData]);

  useEffect(() => {
    if (!caseId) {
      setApproved(false);
      return;
    }
    const stored = sessionStorage.getItem(`case-approved-${caseId}`);
    setApproved(stored === 'true');
    setSummaryMessage(null);
  }, [caseId]);

  const handleAccept = (id: number) => {
    setFindings(findings.map(f => 
      f.id === id ? { ...f, status: 'accepted' } : f
    ));
    if (caseId) {
      sendFeedback({
        case_id: caseId,
        actions: [{ finding_id: id, action: 'accept', before: findings.find(f => f.id === id) }],
      }).catch(() => undefined);
    }
  };

  const handleReject = (id: number) => {
    setFindings(findings.map(f => 
      f.id === id ? { ...f, status: 'rejected' } : f
    ));
    if (caseId) {
      sendFeedback({
        case_id: caseId,
        actions: [{ finding_id: id, action: 'reject', before: findings.find(f => f.id === id) }],
      }).catch(() => undefined);
    }
  };

  const handleCorrect = (id: number) => {
    setEditingFinding(id);
  };

  const handleSaveCorrection = (id: number, updates: any) => {
    const before = findings.find(f => f.id === id);
    const updated = { ...before, ...updates, status: 'corrected' } as Finding;
    setFindings(findings.map(f => 
      f.id === id ? updated : f
    ));
    if (caseId) {
      sendFeedback({
        case_id: caseId,
        actions: [{ finding_id: id, action: 'correct', before, after: updated, notes: updates.correctionNotes }],
      }).catch(() => undefined);
    }
    setEditingFinding(null);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allSelected = useMemo(() => findings.length > 0 && selectedIds.length === findings.length, [findings.length, selectedIds.length]);

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(findings.map((f) => f.id));
    }
  };

  const applyBatch = (action: 'accept' | 'reject' | 'set_routine') => {
    if (!selectedIds.length) return;
    const updated = findings.map((f) => {
      if (!selectedIds.includes(f.id)) return f;
      if (action === 'accept') return { ...f, status: 'accepted' } as Finding;
      if (action === 'reject') return { ...f, status: 'rejected' } as Finding;
      return { ...f, severity: 'routine', status: 'corrected' } as Finding;
    });
    setFindings(updated);
    if (caseId) {
      sendFeedback({
        case_id: caseId,
        actions: selectedIds.map((id) => ({
          finding_id: id,
          action,
          before: findings.find((f) => f.id === id),
        })),
      }).catch(() => undefined);
    }
  };

  const acceptedCount = findings.filter(f => f.status === 'accepted').length;
  const correctedCount = findings.filter(f => f.status === 'corrected').length;
  const rejectedCount = findings.filter(f => f.status === 'rejected').length;
  const reviewComplete = findings.length > 0 && (acceptedCount + correctedCount + rejectedCount === findings.length);
  const approvedFindings = findings.filter(f => f.status === 'accepted' || f.status === 'corrected');

  const handleApprove = () => {
    if (!reviewComplete) return;
    setApproved(true);
    if (caseId) {
      sessionStorage.setItem(`case-approved-${caseId}`, 'true');
    }
  };

  const handleGenerateSummary = async () => {
    if (!approved || !caseId) return;
    if (!approvedFindings.length) {
      setSummaryMessage('Approve at least one finding to summarize.');
      return;
    }
    try {
      setIsSummarizing(true);
      setSummaryMessage(null);
      const summary = await summarizeFindings({
        patientId: caseData?.patientId,
        findings: approvedFindings,
        doctorNotes: undefined,
      });
      sessionStorage.setItem(`case-summary-${caseId}`, JSON.stringify(summary));
      setSummaryMessage('Clinical summary generated. View it under the Summary tab.');
      navigate(`/analysis/${caseId}?tab=summary`);
    } catch (err) {
      setSummaryMessage(err instanceof Error ? err.message : 'Unable to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/analysis/${caseId}`)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Review Findings</h1>
              <p className="text-sm text-gray-600">Case: {caseId}</p>
            </div>
          </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            {acceptedCount} Accepted
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {correctedCount} Corrected
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {rejectedCount} Rejected
          </Badge>
        </div>
      </div>
    </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Progress */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Review Progress</span>
              <span className="text-sm font-semibold text-blue-900">
                {acceptedCount + correctedCount + rejectedCount} / {findings.length}
              </span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${((acceptedCount + correctedCount + rejectedCount) / findings.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Batch Actions */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox checked={allSelected} onCheckedChange={() => toggleAll()} />
            <span>Select all</span>
            {selectedIds.length > 0 && (
              <span className="text-xs text-gray-500">({selectedIds.length} selected)</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" onClick={() => applyBatch('accept')} disabled={!selectedIds.length}>
              Accept Selected
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyBatch('set_routine')} disabled={!selectedIds.length}>
              Set Routine
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyBatch('reject')} disabled={!selectedIds.length}>
              Reject Selected
            </Button>
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-4">
          {findings.map((finding) => (
            <div key={finding.id}>
              {editingFinding === finding.id ? (
                <CorrectionForm
                  finding={finding}
                  onSave={(updates) => handleSaveCorrection(finding.id, updates)}
                  onCancel={() => setEditingFinding(null)}
                  imageUrl={caseData?.previewUrl}
                  imageWidth={caseData?.imageWidth}
                  imageHeight={caseData?.imageHeight}
                />
              ) : (
                <div className="flex gap-3 items-start">
                  <div className="pt-6">
                    <Checkbox
                      checked={selectedIds.includes(finding.id)}
                      onCheckedChange={() => toggleSelection(finding.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <DetectionCard
                      finding={finding}
                      onAccept={() => handleAccept(finding.id)}
                      onReject={() => handleReject(finding.id)}
                      onCorrect={() => handleCorrect(finding.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/analysis/${caseId}`)}
            className="sm:w-auto w-full"
          >
            Back to Analysis
          </Button>
          <Button
            variant={approved ? 'secondary' : 'default'}
            onClick={handleApprove}
            disabled={!reviewComplete || approved}
            className="sm:w-auto w-full"
          >
            {approved ? 'Findings Approved' : 'Approve Findings'}
          </Button>
          {approved && (
            <Button
              onClick={handleGenerateSummary}
              disabled={isSummarizing || !approvedFindings.length}
              className="sm:w-auto w-full"
            >
              {isSummarizing ? 'Generating...' : '✦ Generate Clinical Summary'}
            </Button>
          )}
          <Button 
            onClick={() => navigate(`/report/${caseId}`)}
            disabled={acceptedCount + correctedCount + rejectedCount < findings.length}
            className="sm:w-auto w-full"
          >
            Generate Report
          </Button>
        </div>
        {summaryMessage && (
          <p className="mt-2 text-sm text-gray-700 text-right">{summaryMessage}</p>
        )}
      </div>
    </div>
  );
}
