import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Download, Send, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useCaseAnalysis } from "../hooks/useCaseAnalysis";

export default function ClinicalReport() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { caseData } = useCaseAnalysis(caseId);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Clinical-Report-${caseId || "case"}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const reportData = caseData
    ? {
        caseId: caseData.caseId,
        patient: caseData.patientId || "Patient",
        date: new Date(caseData.createdAt).toLocaleDateString(),
        time: new Date(caseData.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        doctor: "Dr. Rodriguez",
        urgency: caseData.urgency,
        findings: caseData.findings,
      }
    : {
        caseId: caseId,
        patient: "Patient",
        date: "Processing",
        time: "",
        doctor: "Dr. Rodriguez",
        urgency: {
          level: "attention",
          score: 0,
          summary: "Analysis in progress",
        },
        findings: [],
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
              <h1 className="text-xl font-bold text-gray-900">
                Clinical Report
              </h1>
              <p className="text-sm text-gray-600">{reportData.patient}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={downloading}>
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{downloading ? "Preparing..." : "Download PDF"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Report Content */}
        <Card className="mb-6" ref={reportRef}>
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                AI-Assisted Dental Imaging Report
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Patient ID:</p>
                  <p className="font-medium text-gray-900">
                    {reportData.patient}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Case ID:</p>
                  <p className="font-medium text-gray-900">
                    {reportData.caseId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p className="font-medium text-gray-900">
                    {reportData.date} {reportData.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Reviewing Doctor:</p>
                  <p className="font-medium text-gray-900">
                    {reportData.doctor}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Urgency Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Urgency Assessment
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="capitalize">
                    {reportData.urgency.level} - Score{" "}
                    {reportData.urgency.score}/10
                  </Badge>
                </div>
                <p className="text-gray-900">{reportData.urgency.summary}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Patient Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Patient Summary
              </h3>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-gray-900 leading-relaxed">
                    The AI-assisted analysis of your dental X-ray has identified{" "}
                    {reportData.findings.length} areas that require attention.
                    Our evaluation shows conditions ranging from early-stage
                    concerns to situations requiring prompt treatment. Your
                    dental team will work with you to develop an appropriate
                    treatment plan and schedule based on the urgency of each
                    finding.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-6" />

            {/* Detailed Findings */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Detailed Findings
              </h3>
              <div className="space-y-4">
                {reportData.findings.map((finding, index) => (
                  <Card key={finding.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {finding.label}
                            </h4>
                            <Badge
                              variant={
                                finding.severity === "urgent"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {finding.severity}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <span className="text-gray-600 w-24">
                                Location:
                              </span>
                              <span className="font-medium text-gray-900">
                                Tooth #{finding.tooth}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-600 w-24">
                                Timeline:
                              </span>
                              <span className="font-medium text-gray-900">
                                {finding.timeline || "To be scheduled"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-600 w-24">
                                Action:
                              </span>
                              <span className="font-medium text-gray-900">
                                {finding.action || "Review clinically"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Treatment Plan */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recommended Treatment Timeline
              </h3>
              <div className="space-y-4">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-base text-red-900">
                      Immediate (24-48 hours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-red-900">
                      {reportData.findings
                        .filter((f) => f.severity === "urgent")
                        .map((f) => (
                          <li key={f.id}>
                            • {f.label} (Tooth #{f.tooth})
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-base text-green-900">
                      Routine Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-green-900">
                      {reportData.findings
                        .filter((f) => f.severity === "routine")
                        .map((f) => (
                          <li key={f.id}>
                            • {f.label} (Tooth #{f.tooth})
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recommended Next Steps
              </h3>
              <ol className="space-y-2 text-gray-900">
                <li className="flex gap-3">
                  <span className="font-semibold">1.</span>
                  <span>
                    Contact patient immediately to schedule emergency
                    appointment for urgent findings
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">2.</span>
                  <span>
                    Review all findings with patient and discuss treatment
                    options in detail
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">3.</span>
                  <span>
                    Schedule necessary follow-up appointments based on urgency
                    levels
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">4.</span>
                  <span>
                    Document patient consent and agreed treatment plan
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">5.</span>
                  <span>
                    Schedule post-treatment follow-up radiographs as needed
                  </span>
                </li>
              </ol>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
              <p className="font-semibold mb-2">Important Notice:</p>
              <p>
                This report is generated with AI assistance and should be
                reviewed by a licensed dental professional. AI findings are
                provided as clinical decision support and do not replace
                professional judgment. All treatment decisions should be made by
                qualified healthcare providers based on comprehensive clinical
                evaluation.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <p>Report generated on {new Date().toLocaleString()}</p>
              <p className="mt-1">
                DentAI - AI-Assisted Dental Imaging System v1.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
