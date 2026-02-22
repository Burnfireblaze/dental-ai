import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Finding } from '../../types/ai';

interface ToothChartProps {
  findings: Finding[];
  onToothSelect: (tooth: number | null) => void;
  selectedTooth: number | null;
}

export default function ToothChart({ findings, onToothSelect, selectedTooth }: ToothChartProps) {
  // Universal tooth numbering (1-32)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17);

  const getToothStatus = (toothNum: number) => {
    const finding = findings.find(f => f.tooth === toothNum);
    if (!finding) return null;
    return finding;
  };

  const getToothColor = (severity: string | undefined) => {
    if (!severity) return 'bg-gray-100 hover:bg-gray-200';
    switch (severity) {
      case 'urgent':
        return 'bg-red-100 border-red-500 hover:bg-red-200';
      case 'attention':
        return 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200';
      default:
        return 'bg-green-100 border-green-500 hover:bg-green-200';
    }
  };

  const ToothCell = ({ toothNum }: { toothNum: number }) => {
    const finding = getToothStatus(toothNum);
    const isSelected = selectedTooth === toothNum;

    return (
      <button
        onClick={() => onToothSelect(isSelected ? null : toothNum)}
        className={`relative h-10 sm:h-12 w-full border transition-all ${
          getToothColor(finding?.severity)
        } ${
          isSelected ? 'ring-2 ring-blue-500 scale-110' : ''
        } ${
          finding ? 'border-2' : 'border border-gray-300'
        }`}
      >
        <span className={`text-xs sm:text-sm font-medium ${finding ? 'font-bold' : ''}`}>
          {toothNum}
        </span>
        {finding && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white" />
        )}
      </button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Tooth Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upper Arch */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Upper Arch</p>
            <div className="grid grid-cols-8 gap-1">
              {upperTeeth.map((tooth) => (
                <ToothCell key={tooth} toothNum={tooth} />
              ))}
            </div>
          </div>

          {/* Lower Arch */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Lower Arch</p>
            <div className="grid grid-cols-8 gap-1">
              {lowerTeeth.map((tooth) => (
                <ToothCell key={tooth} toothNum={tooth} />
              ))}
            </div>
          </div>

          {/* Selected Tooth Info */}
          {selectedTooth && getToothStatus(selectedTooth) && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Tooth #{selectedTooth}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{getToothStatus(selectedTooth)?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Urgency:</span>
                  <Badge 
                    variant={getToothStatus(selectedTooth)?.severity === 'urgent' ? 'destructive' : 'default'}
                    className="capitalize"
                  >
                    {getToothStatus(selectedTooth)?.severity}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Legend</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 bg-red-100 border-2 border-red-500" />
                <span>Urgent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 bg-yellow-100 border-2 border-yellow-500" />
                <span>Attention</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 bg-green-100 border-2 border-green-500" />
                <span>Routine</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
