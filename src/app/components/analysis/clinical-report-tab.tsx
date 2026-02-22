import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import type { CaseData } from '../../types/ai';

interface ClinicalReportTabProps {
  caseData?: CaseData | null;
}

export default function ClinicalReportTab({ caseData }: ClinicalReportTabProps) {
  if (!caseData) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 text-sm text-blue-900">
          Analysis report is being generated. Please check back shortly.
        </CardContent>
      </Card>
    );
  }

  const findings = caseData.findings ?? [];
  const urgency = caseData.urgency;

  return (
    <div className="space-y-4">
      {/* Urgency Summary */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-900 mb-1">Overall Assessment</h3>
              <Badge variant="destructive" className="mb-2 capitalize">
                {urgency.level} - {urgency.score}/10
              </Badge>
              <p className="text-sm text-red-800">{urgency.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient-Friendly Summary */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Patient Summary</h3>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              The AI analysis has identified {findings.length} areas of concern in your dental X-ray. 
              {urgency.level === 'urgent' && ' Some of these require prompt attention to prevent further complications.'}
              {' '}Your dentist will discuss treatment options and next steps with you.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prioritized Findings */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Prioritized Findings</h3>
        <div className="space-y-2">
          {[...findings]
            .sort((a: any, b: any) => {
              const urgencyOrder = { urgent: 0, attention: 1, routine: 2 };
              return urgencyOrder[a.severity as keyof typeof urgencyOrder] - urgencyOrder[b.severity as keyof typeof urgencyOrder];
            })
            .map((finding: any, index: number) => (
              <Card key={finding.id}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 flex-shrink-0 text-sm font-semibold text-gray-700">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{finding.label}</h4>
                        <Badge 
                          variant={finding.severity === 'urgent' ? 'destructive' : 'secondary'}
                          className="capitalize text-xs"
                        >
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Location: Tooth #{finding.tooth}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{finding.timeline || 'To be scheduled'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{finding.action || 'Review clinically'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Treatment Plan */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan by Timeline</h3>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Immediate (24-48 hours)</h4>
              <ul className="space-y-1 text-sm text-red-800">
                {findings
                  .filter((f: any) => f.severity === 'urgent')
                  .map((f: any) => (
                    <li key={f.id}>• {f.label} - Tooth #{f.tooth}</li>
                  ))}
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Within 1-2 Weeks</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {findings
                  .filter((f: any) => f.severity === 'attention')
                  .map((f: any) => (
                    <li key={f.id}>• {f.label} - Tooth #{f.tooth}</li>
                  ))}
                {findings.filter((f: any) => f.severity === 'attention').length === 0 && (
                  <li>• No findings in this category</li>
                )}
              </ul>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Routine Visit</h4>
              <ul className="space-y-1 text-sm text-green-800">
                {findings
                  .filter((f: any) => f.severity === 'routine')
                  .map((f: any) => (
                    <li key={f.id}>• {f.label} - Tooth #{f.tooth}</li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Recommended Next Steps</h3>
        <Card>
          <CardContent className="p-4">
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>{urgency.recommendation}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>Review findings with patient and discuss treatment options</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>Schedule follow-up appointments based on urgency levels</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>Document patient consent and treatment plan</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
