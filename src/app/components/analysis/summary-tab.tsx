import { AlertTriangle, ClipboardList, Info, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { SummaryResponse } from '../../types/ai';

interface SummaryTabProps {
  summary?: SummaryResponse | null;
  onGenerateClick?: () => void;
  generating?: boolean;
  emptyHint?: string;
}

export default function SummaryTab({ summary, onGenerateClick, generating, emptyHint }: SummaryTabProps) {
  if (!summary) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              {emptyHint || 'No summary available. Approve findings and generate a clinical summary.'}
            </div>
          </div>
          {onGenerateClick && (
            <Button onClick={onGenerateClick} disabled={generating}>
              {generating ? 'Generating…' : 'Generate Clinical Summary'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Clinical Overview
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">
              Risk: {summary.riskLevel}
            </Badge>
            <Badge variant="outline" className="capitalize">
              Urgency: {summary.urgency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-gray-800 leading-relaxed">
          {summary.clinicalSummary}
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Patient Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-800 leading-relaxed">
          {summary.patientExplanation}
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-800 space-y-2">
          {summary.recommendedActions && summary.recommendedActions.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {summary.recommendedActions.map((act, idx) => (
                <li key={`${act}-${idx}`}>{act}</li>
              ))}
            </ul>
          ) : (
            <p>No specific actions suggested.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
