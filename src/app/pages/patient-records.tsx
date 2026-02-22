import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, FileText, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

const xrayHistory = [
  {
    id: 1,
    date: 'January 15, 2026',
    type: 'Panoramic X-ray',
    findings: 3,
    urgentFindings: 1,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
  },
  {
    id: 2,
    date: 'July 10, 2025',
    type: 'Bitewing X-ray',
    findings: 1,
    urgentFindings: 0,
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
  },
  {
    id: 3,
    date: 'January 8, 2025',
    type: 'Panoramic X-ray',
    findings: 2,
    urgentFindings: 0,
    image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80',
  },
];

const findings = [
  {
    id: 1,
    tooth: '16',
    condition: 'Cavity',
    severity: 'urgent',
    description: 'Small cavity detected on the upper right first molar. Early treatment recommended to prevent progression.',
    recommendation: 'Schedule filling appointment within 2 weeks',
  },
  {
    id: 2,
    tooth: '24',
    condition: 'Minor Wear',
    severity: 'monitor',
    description: 'Slight enamel wear on the upper left first premolar. Normal for age, but should be monitored.',
    recommendation: 'Continue regular check-ups every 6 months',
  },
  {
    id: 3,
    tooth: '46',
    condition: 'Previous Filling',
    severity: 'monitor',
    description: 'Existing filling appears stable and intact. No immediate concerns.',
    recommendation: 'Monitor during routine visits',
  },
];

export default function PatientRecords() {
  const [selectedXray, setSelectedXray] = useState(xrayHistory[0]);
  const [zoom, setZoom] = useState(100);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const navigate = useNavigate();

  const handlePrevious = () => {
    const currentIndex = xrayHistory.findIndex(x => x.id === selectedXray.id);
    if (currentIndex > 0) {
      setSelectedXray(xrayHistory[currentIndex - 1]);
      setZoom(100);
    }
  };

  const handleNext = () => {
    const currentIndex = xrayHistory.findIndex(x => x.id === selectedXray.id);
    if (currentIndex < xrayHistory.length - 1) {
      setSelectedXray(xrayHistory[currentIndex + 1]);
      setZoom(100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Records</h1>
          <p className="text-gray-600">View your dental imaging history and findings</p>
        </div>

        {/* X-ray Viewer */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Viewer Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedXray.type}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {selectedXray.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={selectedXray.id === xrayHistory[0].id}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  {xrayHistory.findIndex(x => x.id === selectedXray.id) + 1} / {xrayHistory.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={selectedXray.id === xrayHistory[xrayHistory.length - 1].id}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Viewer */}
          <div className="bg-gray-900 relative">
            <div className="aspect-video flex items-center justify-center overflow-hidden">
              <img
                src={selectedXray.image}
                alt={selectedXray.type}
                className="max-w-full max-h-full object-contain transition-transform"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>

            {/* Viewer Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm min-w-[60px] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-white/30 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setShowFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Findings Summary */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Findings:</span>
              <div className="flex gap-2">
                {selectedXray.urgentFindings > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                    {selectedXray.urgentFindings} Urgent
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                  {selectedXray.findings} Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* X-ray History Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Imaging History</h2>
          <div className="space-y-3">
            {xrayHistory.map((xray) => (
              <button
                key={xray.id}
                onClick={() => {
                  setSelectedXray(xray);
                  setZoom(100);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                  selectedXray.id === xray.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <img
                  src={xray.image}
                  alt={xray.type}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{xray.type}</h3>
                  <p className="text-sm text-gray-600">{xray.date}</p>
                </div>
                <div className="flex gap-2">
                  {xray.urgentFindings > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                      {xray.urgentFindings} Urgent
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {xray.findings} Findings
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Findings Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Findings Explanation ({selectedXray.findings})
          </h2>
          <div className="space-y-4">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className={`border rounded-lg p-4 ${
                  finding.severity === 'urgent'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Tooth #{finding.tooth} - {finding.condition}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      finding.severity === 'urgent'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {finding.severity === 'urgent' ? 'Urgent' : 'Monitor'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{finding.description}</p>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">Recommendation:</p>
                  <p className="text-sm text-gray-900">{finding.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Report Button */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold mb-1">Clinical Report Available</h3>
              <p className="text-sm text-blue-100">View detailed report from Dr. Rodriguez</p>
            </div>
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/patient/report')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-sm"
          >
            Close ✕
          </button>
          <img
            src={selectedXray.image}
            alt={selectedXray.type}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
