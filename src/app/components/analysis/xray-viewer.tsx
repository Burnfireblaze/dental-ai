import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, EyeOff, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Finding } from '../../types/ai';

interface XRayViewerProps {
  findings: Finding[];
  showAnnotations: boolean;
  onToggleAnnotations: (show: boolean) => void;
  selectedTooth: number | null;
  selectedFindingId?: number | null;
  onSelectFinding?: (id: number | null) => void;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  compact?: boolean;
  editMode?: boolean;
  onUpdateFindingBox?: (id: number, bbox: [number, number, number, number]) => void;
}

export default function XRayViewer({ 
  findings, 
  showAnnotations, 
  onToggleAnnotations,
  selectedTooth,
  selectedFindingId,
  onSelectFinding,
  imageUrl,
  imageWidth,
  imageHeight,
  compact,
  editMode,
  onUpdateFindingBox,
}: XRayViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: imageWidth || 0, height: imageHeight || 0 });
  const [displayRect, setDisplayRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dragRef = useRef<{
    type: 'move' | 'nw' | 'ne' | 'sw' | 'se' | null;
    findingId: number | null;
    startX: number;
    startY: number;
    startBbox: [number, number, number, number];
  } | null>(null);

  const baseWidth = naturalSize.width || imageWidth || 1;
  const baseHeight = naturalSize.height || imageHeight || 1;

  useEffect(() => {
    if (imageWidth && imageHeight) {
      setNaturalSize({ width: imageWidth, height: imageHeight });
    }
  }, [imageWidth, imageHeight]);

  const getUrgencyColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'border-red-500 bg-red-500/20';
      case 'attention':
        return 'border-yellow-500 bg-yellow-500/20';
      default:
        return 'border-green-500 bg-green-500/20';
    }
  };

  const computeDisplayRect = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (!cw || !ch) return;
    const scale = Math.min(cw / baseWidth, ch / baseHeight);
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    const x = (cw - width) / 2;
    const y = (ch - height) / 2;
    setDisplayRect({ x, y, width, height });
  }, [baseWidth, baseHeight]);

  useEffect(() => {
    computeDisplayRect();
    window.addEventListener('resize', computeDisplayRect);
    return () => window.removeEventListener('resize', computeDisplayRect);
  }, [computeDisplayRect]);

  const toDisplayBox = useCallback(
    (bbox: [number, number, number, number]) => {
      const [x1, y1, x2, y2] = bbox;
      const left = displayRect.x + (x1 / baseWidth) * displayRect.width;
      const top = displayRect.y + (y1 / baseHeight) * displayRect.height;
      const width = ((x2 - x1) / baseWidth) * displayRect.width;
      const height = ((y2 - y1) / baseHeight) * displayRect.height;
      return { left, top, width, height };
    },
    [displayRect, baseWidth, baseHeight]
  );

  const startDrag = (
    event: React.MouseEvent,
    finding: Finding,
    type: 'move' | 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    if (!editMode) return;
    event.stopPropagation();
    dragRef.current = {
      type,
      findingId: finding.id,
      startX: event.clientX,
      startY: event.clientY,
      startBbox: finding.bbox,
    };
  };

  const onMove = useCallback(
    (event: MouseEvent) => {
      if (!dragRef.current || !onUpdateFindingBox) return;
      const { type, findingId, startX, startY, startBbox } = dragRef.current;
      if (!type || findingId == null) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const scaleX = baseWidth / (displayRect.width || 1);
      const scaleY = baseHeight / (displayRect.height || 1);
      const dxImg = dx * scaleX;
      const dyImg = dy * scaleY;
      let [x1, y1, x2, y2] = startBbox;

      if (type === 'move') {
        x1 += dxImg;
        x2 += dxImg;
        y1 += dyImg;
        y2 += dyImg;
      } else {
        if (type.includes('n')) y1 += dyImg;
        if (type.includes('s')) y2 += dyImg;
        if (type.includes('w')) x1 += dxImg;
        if (type.includes('e')) x2 += dxImg;
      }

      const minSize = 5;
      if (x2 - x1 < minSize) x2 = x1 + minSize;
      if (y2 - y1 < minSize) y2 = y1 + minSize;

      x1 = Math.max(0, Math.min(baseWidth, x1));
      y1 = Math.max(0, Math.min(baseHeight, y1));
      x2 = Math.max(0, Math.min(baseWidth, x2));
      y2 = Math.max(0, Math.min(baseHeight, y2));

      onUpdateFindingBox(findingId, [x1, y1, x2, y2]);
    },
    [baseWidth, baseHeight, displayRect.width, displayRect.height, onUpdateFindingBox]
  );

  const stopDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (!editMode) return;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [editMode, onMove, stopDrag]);

  const overlayFindings = useMemo(
    () => findings.filter((finding) => finding.bbox && finding.bbox.length === 4),
    [findings]
  );

  const viewerContent = (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ transform: compact ? undefined : `scale(${zoom / 100})` }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Dental radiograph"
            className="absolute inset-0 w-full h-full object-contain"
            onLoad={(event) => {
              const target = event.currentTarget;
              setNaturalSize({ width: target.naturalWidth, height: target.naturalHeight });
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-gray-500 text-center p-8">
              <p className="text-sm mb-2">Dental Radiograph</p>
              <p className="text-xs">Awaiting image preview</p>
            </div>
          </div>
        )}

        {showAnnotations && (
          <div
            className="absolute"
            style={{
              left: `${displayRect.x}px`,
              top: `${displayRect.y}px`,
              width: `${displayRect.width}px`,
              height: `${displayRect.height}px`,
            }}
          >
            {overlayFindings.map((finding) => {
              const { left, top, width, height } = toDisplayBox(finding.bbox);
              const isSelected = selectedFindingId === finding.id || selectedTooth === finding.tooth;
              return (
                <div
                  key={finding.id}
                  className={`absolute border-2 ${getUrgencyColor(finding.severity)} transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:scale-105'
                  }`}
                  style={{
                    left: `${left - displayRect.x}px`,
                    top: `${top - displayRect.y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                  onClick={() => onSelectFinding?.(finding.id)}
                  onMouseDown={(event) => startDrag(event, finding, 'move')}
                >
                  <div className="absolute -top-7 left-0 whitespace-nowrap">
                    <Badge variant={finding.severity === 'urgent' ? 'destructive' : 'default'} className="text-xs">
                      #{finding.tooth}
                    </Badge>
                  </div>
                  {editMode && isSelected && (
                    <>
                      {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                        <div
                          key={corner}
                          className="absolute h-2.5 w-2.5 bg-white border border-blue-500"
                          style={{
                            left: corner.includes('w') ? -5 : undefined,
                            right: corner.includes('e') ? -5 : undefined,
                            top: corner.includes('n') ? -5 : undefined,
                            bottom: corner.includes('s') ? -5 : undefined,
                            cursor: `${corner}-resize`,
                          }}
                          onMouseDown={(event) => startDrag(event, finding, corner)}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (compact) {
    return viewerContent;
  }

  return (
    <Card className={fullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>X-ray Viewer</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleAnnotations(!showAnnotations)}
            >
              {showAnnotations ? (
                <>
                  <EyeOff className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Hide</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Show</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFullscreen(!fullscreen)}
              className="hidden sm:flex"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewerContent}

        {showAnnotations && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-red-500 bg-red-500/20" />
              <span className="text-gray-700">Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-yellow-500 bg-yellow-500/20" />
              <span className="text-gray-700">Attention Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-green-500 bg-green-500/20" />
              <span className="text-gray-700">Routine</span>
            </div>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-600">
          Zoom: {zoom}% • {findings.length} findings detected
        </div>
      </CardContent>
    </Card>
  );
}
