import { Calendar, FileText, Activity, AlertCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

export default function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
          <p className="text-blue-100">Your dental health at a glance</p>
        </div>

        {/* Alert Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">Treatment Pending</h3>
              <p className="text-sm text-amber-700 mb-3">
                Your dentist has recommended treatment for 2 findings. Please schedule a follow-up appointment.
              </p>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                View Details
              </Button>
            </div>
          </div>
        </div>

        {/* Last Visit Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Last Visit</h2>
              <p className="text-sm text-gray-600">January 15, 2026</p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Completed
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Activity className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Routine Examination & X-ray</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Dr. Rodriguez</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Findings: 3 detected</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                1 Urgent
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                2 Monitor
              </span>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/patient/records')}
            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Latest X-ray</h3>
            <p className="text-sm text-gray-600">View your most recent dental imaging</p>
          </button>

          <button
            onClick={() => navigate('/patient/records')}
            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
            <p className="text-sm text-gray-600">Access your clinical reports</p>
          </button>

          <button
            onClick={() => navigate('/patient/timeline')}
            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Treatment Timeline</h3>
            <p className="text-sm text-gray-600">Track your treatment progress</p>
          </button>

          <button
            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Appointments</h3>
            <p className="text-sm text-gray-600">Next: Feb 28, 2026</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">X-ray Uploaded</p>
                <p className="text-sm text-gray-600">Panoramic X-ray analysis completed</p>
                <p className="text-xs text-gray-500 mt-1">Jan 15, 2026</p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Report Available</p>
                <p className="text-sm text-gray-600">Clinical report ready for review</p>
                <p className="text-xs text-gray-500 mt-1">Jan 15, 2026</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Appointment Scheduled</p>
                <p className="text-sm text-gray-600">Follow-up on February 28</p>
                <p className="text-xs text-gray-500 mt-1">Jan 12, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
