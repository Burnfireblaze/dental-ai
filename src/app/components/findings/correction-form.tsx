import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save, X } from 'lucide-react';
import XRayViewer from '../analysis/xray-viewer';
import type { Finding } from '../../types/ai';

interface CorrectionFormProps {
  finding: Finding;
  onSave: (updates: any) => void;
  onCancel: () => void;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export default function CorrectionForm({ finding, onSave, onCancel, imageUrl, imageWidth, imageHeight }: CorrectionFormProps) {
  const [condition, setCondition] = useState(finding.label);
  const [tooth, setTooth] = useState(String(finding.tooth));
  const [urgency, setUrgency] = useState(finding.severity);
  const [notes, setNotes] = useState('');
  const [bbox, setBbox] = useState<[number, number, number, number]>(finding.bbox);

  const previewFinding: Finding = useMemo(() => ({
    ...finding,
    label: condition,
    tooth: Number(tooth) || finding.tooth,
    severity: urgency,
    bbox,
  }), [bbox, condition, finding, tooth, urgency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericTooth = Number(tooth);
    onSave({
      label: condition,
      tooth: Number.isFinite(numericTooth) ? numericTooth : finding.tooth,
      severity: urgency,
      bbox,
      polygon: [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
      ],
      correctionNotes: notes,
    });
  };

  return (
    <Card className="border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg">Correct AI Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Adjust Bounding Box</Label>
            <XRayViewer
              findings={[previewFinding]}
              showAnnotations={true}
              onToggleAnnotations={() => undefined}
              selectedTooth={previewFinding.tooth}
              selectedFindingId={previewFinding.id}
              onSelectFinding={() => undefined}
              imageUrl={imageUrl}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              compact
              editMode
              onUpdateFindingBox={(_, updated) => setBbox(updated)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., Periapical Lesion"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tooth">Tooth Reference</Label>
              <Input
                id="tooth"
                value={tooth}
                onChange={(e) => setTooth(e.target.value)}
                placeholder="e.g., 19"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="attention">Needs Attention</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Correction Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain why you're correcting this detection..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Correction
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
