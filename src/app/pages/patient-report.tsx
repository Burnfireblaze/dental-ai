import { useMemo } from 'react';
import { FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Download, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCaseAnalysis } from '../hooks/useCaseAnalysis';

export default function PatientReport() {
  const storedCaseId = typeof window !== 'undefined' ? localStorage.getItem('lastCaseId') || undefined : undefined;
  const { caseData } = useCaseAnalysis(storedCaseId);

  const findings = caseData?.findings ?? [];
  const urgentCount = findings.filter((f) => f.severity === 'urgent').length;
  const attentionCount = findings.filter((f) => f.severity === 'attention').length;
  const routineCount = findings.filter((f) => f.severity === 'routine').length;

  const reportDate = caseData?.createdAt
    ? new Date(caseData.createdAt).toLocaleDateString()
    : 'January 15, 2026';

  const summaryText = useMemo(() => {
    if (!findings.length) {
      return 'Your dental report is being prepared. Please check back shortly.';
    }
    return `Your recent dental examination revealed ${findings.length} findings that require attention. ${urgentCount > 0 ? `${urgentCount} finding${urgentCount > 1 ? 's are' : ' is'} urgent and need${urgentCount > 1 ? '' : 's'} treatment soon.` : 'No urgent findings were detected.'} The remaining findings can be monitored during regular check-ups.`;
  }, [findings.length, urgentCount]);

  const severityStyles = {
    urgent: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
      icon: 'bg-red-100 text-red-600',
    },
    attention: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      badge: 'bg-yellow-100 text-yellow-700',
      icon: 'bg-yellow-100 text-yellow-600',
    },
    routine: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      badge: 'bg-green-100 text-green-700',
      icon: 'bg-green-100 text-green-600',
    },
  } as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Your Dental Report
              </h1>
              <p className="text-gray-600">Comprehensive analysis of your dental health</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-600">Report Date</p>
                <p className="font-medium text-gray-900">{reportDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-600">Dentist</p>
                <p className="font-medium text-gray-900">Dr. Rodriguez</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-600">Report ID</p>
                <p className="font-medium text-gray-900">{caseData?.caseId || 'RPT-2024'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">Overall Summary</h2>
          <p className="text-blue-100 mb-4">
            {summaryText}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold mb-1">{findings.length || 0}</p>
              <p className="text-sm text-blue-100">Total Findings</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold mb-1">{urgentCount}</p>
              <p className="text-sm text-blue-100">Urgent</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold mb-1">{attentionCount + routineCount}</p>
              <p className="text-sm text-blue-100">Monitor</p>
            </div>
          </div>
        </div>

        {/* Findings in Plain Language */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Found</h2>
          
          <div className="space-y-4">
            {findings.length === 0 && (
              <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-5 text-sm text-blue-900">
                Findings will appear here once analysis completes.
              </div>
            )}
            {findings.map((finding) => {
              const isUrgent = finding.severity === 'urgent';
              const isAttention = finding.severity === 'attention';
              const styles = isUrgent
                ? severityStyles.urgent
                : isAttention
                ? severityStyles.attention
                : severityStyles.routine;
              const Icon = isUrgent ? AlertCircle : isAttention ? Clock : CheckCircle;
              const statusLabel = isUrgent ? 'Needs Treatment' : isAttention ? 'Monitor' : 'Stable';
              return (
                <div key={finding.id} className={`border-l-4 ${styles.border} ${styles.bg} rounded-r-lg p-5`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{finding.label}</h3>
                        <p className="text-sm text-gray-600">Tooth #{finding.tooth}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles.badge}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">What does this mean?</p>
                      <p className="text-sm text-gray-600">
                        {finding.explanationPatient || 'Your dentist will review this area with you.'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">What should you do?</p>
                      <p className="text-sm text-gray-600">
                        {finding.action || 'Schedule a visit to review next steps.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treatment Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Treatment Plan</h2>
          
          <div className="space-y-3">
            {findings.filter((f) => f.severity === 'urgent').map((finding, index) => (
              <div key={finding.id} className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-bold text-red-700">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{finding.label}</h3>
                  <p className="text-sm text-gray-600 mb-2">Priority: Urgent</p>
                  <p className="text-sm text-gray-700">
                    {finding.action || 'Schedule an appointment soon.'}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-gray-700">{Math.max(urgentCount, 1) + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Follow-up Check-up</h3>
                <p className="text-sm text-gray-600 mb-2">In 6 months</p>
                <p className="text-sm text-gray-700">
                  Regular check-up to monitor remaining findings and overall dental health.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">Home Care Instructions</h2>
          <div className="space-y-3 text-sm text-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Brush twice daily</p>
                <p>Use fluoride toothpaste and brush for 2 minutes each time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Floss daily</p>
                <p>Especially important around tooth #16 where the cavity was detected</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Avoid hard or sticky foods</p>
                <p>Until your filling appointment to prevent the cavity from worsening</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Schedule regular cleanings</p>
                <p>Every 6 months to maintain good oral health</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Have Questions?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If you have any questions about this report or your treatment plan, please don't hesitate to contact us.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Call Office
            </Button>
            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
