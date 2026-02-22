import { Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const timelineEvents = [
  {
    id: 1,
    date: 'February 28, 2026',
    title: 'Follow-up Appointment',
    description: 'Treatment for cavity on tooth #16',
    status: 'upcoming',
    type: 'treatment',
  },
  {
    id: 2,
    date: 'January 15, 2026',
    title: 'Routine Examination',
    description: 'Annual check-up and X-ray completed',
    status: 'completed',
    type: 'checkup',
    details: [
      'Panoramic X-ray taken',
      '3 findings detected',
      'Treatment plan created',
    ],
  },
  {
    id: 3,
    date: 'September 12, 2025',
    title: 'Cleaning & Polish',
    description: 'Professional dental cleaning',
    status: 'completed',
    type: 'cleaning',
    details: [
      'Deep cleaning performed',
      'Fluoride treatment applied',
      'Oral hygiene tips provided',
    ],
  },
  {
    id: 4,
    date: 'July 10, 2025',
    title: 'Follow-up X-ray',
    description: 'Bitewing X-ray to monitor previous filling',
    status: 'completed',
    type: 'checkup',
    details: [
      'Previous filling stable',
      'No new concerns',
    ],
  },
  {
    id: 5,
    date: 'April 22, 2025',
    title: 'Filling Procedure',
    description: 'Composite filling on tooth #32',
    status: 'completed',
    type: 'treatment',
    details: [
      'Cavity treated successfully',
      'Recovery instructions provided',
      'Follow-up scheduled',
    ],
  },
  {
    id: 6,
    date: 'January 8, 2025',
    title: 'Annual Examination',
    description: 'Routine check-up',
    status: 'completed',
    type: 'checkup',
    details: [
      'Overall dental health good',
      'Small cavity detected',
      'Treatment scheduled',
    ],
  },
];

export default function PatientTimeline() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Treatment Timeline</h1>
          <p className="text-gray-600">Track your dental treatment history and upcoming appointments</p>
        </div>

        {/* Upcoming Appointments Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Next Appointment</h3>
              <p className="text-sm text-blue-700 mb-3">
                February 28, 2026 at 2:00 PM with Dr. Rodriguez
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <p className="text-sm text-gray-600">Completed Visits</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">1</span>
            </div>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">2</span>
            </div>
            <p className="text-sm text-gray-600">Active Conditions</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Timeline Events */}
            <div className="space-y-6">
              {timelineEvents.map((event, index) => {
                const isUpcoming = event.status === 'upcoming';
                const isCompleted = event.status === 'completed';

                return (
                  <div key={event.id} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-1 h-10 w-10 rounded-full border-4 flex items-center justify-center ${
                        isUpcoming
                          ? 'bg-blue-600 border-blue-100'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {isUpcoming ? (
                        <Clock className="h-5 w-5 text-white" />
                      ) : (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    {/* Event Card */}
                    <div
                      className={`rounded-lg border p-4 ${
                        isUpcoming
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                            isUpcoming
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>

                      {event.details && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <ul className="space-y-1.5">
                            {event.details.map((detail, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isUpcoming && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-2">Current Care Instructions</h3>
          <ul className="space-y-2 text-sm text-green-50 mb-4">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Continue regular brushing twice daily with fluoride toothpaste</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Floss daily, especially around tooth #16</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Avoid hard or sticky foods until next appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Schedule your next cleaning in 6 months</span>
            </li>
          </ul>
          <Button className="bg-white text-green-600 hover:bg-green-50">
            Download Care Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
