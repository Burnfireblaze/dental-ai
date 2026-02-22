import { Check, X, Edit, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface DetectionCardProps {
  finding: {
    id: number;
    label: string;
    tooth: number;
    severity: string;
    confidence: number;
    modality?: string;
    timeline?: string;
    action?: string;
    status: string;
  };
  onAccept: () => void;
  onReject: () => void;
  onCorrect: () => void;
}

export default function DetectionCard({ finding, onAccept, onReject, onCorrect }: DetectionCardProps) {
  const getStatusBadge = () => {
    switch (finding.status) {
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'corrected':
        return <Badge className="bg-blue-500">Corrected</Badge>;
      default:
        return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <Card className={`
      ${finding.status === 'accepted' ? 'border-green-300 bg-green-50/50' : ''}
      ${finding.status === 'rejected' ? 'border-red-300 bg-red-50/50' : ''}
      ${finding.status === 'corrected' ? 'border-blue-300 bg-blue-50/50' : ''}
    `}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{finding.label}</h3>
                <Badge 
                  variant={finding.severity === 'urgent' ? 'destructive' : finding.severity === 'attention' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {finding.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Tooth Reference: #{finding.tooth}</p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${finding.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900">{finding.confidence}%</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Modality</p>
              <p className="text-sm font-semibold text-gray-900">{finding.modality || 'Radiograph'}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Timeline</p>
              <p className="text-sm text-gray-900 mt-0.5">{finding.timeline || 'To be scheduled'}</p>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Recommended Action</p>
              <p className="text-sm text-blue-900 mt-0.5">{finding.action || 'Review clinically'}</p>
            </div>
          </div>

          {/* Actions */}
          {finding.status === 'pending' && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
              <Button 
                onClick={onAccept} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button 
                onClick={onCorrect} 
                variant="outline"
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Correct
              </Button>
              <Button 
                onClick={onReject} 
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {finding.status !== 'pending' && (
            <div className="pt-2 border-t border-gray-200">
              <Button 
                onClick={onCorrect} 
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Decision
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
