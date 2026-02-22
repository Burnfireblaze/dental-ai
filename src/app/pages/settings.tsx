import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { changePassword, getProfile, updateProfile } from '../services/settings-api';
import type { ProfileData } from '../types/auth';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72;
const getPasswordByteLength = (value: string) =>
  new TextEncoder().encode(value).length;

export default function Settings() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setLicenseNumber(data.license_number || '');
        setSpecialty(data.specialty || '');
      })
      .catch((err) => {
        setSaveError(err instanceof Error ? err.message : 'Unable to load profile');
      });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      const updated = await updateProfile({
        name: fullName || profile?.name || '',
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        license_number: licenseNumber || null,
        specialty: specialty || null,
      });
      setProfile(updated);
      setSaveMessage('Profile updated successfully.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (getPasswordByteLength(currentPassword) > MAX_PASSWORD_BYTES) {
      setPasswordError(`Current password must be at most ${MAX_PASSWORD_BYTES} bytes.`);
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (getPasswordByteLength(newPassword) > MAX_PASSWORD_BYTES) {
      setPasswordError(`New password must be at most ${MAX_PASSWORD_BYTES} bytes.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Unable to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                  {(profile?.display_name || profile?.name || 'DR').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{profile?.display_name || profile?.name || 'Profile'}</h3>
                <p className="text-sm text-gray-600">{specialty || 'General Dentistry'}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
            {saveMessage && (
              <p className="text-sm text-green-600">{saveMessage}</p>
            )}
            {saveError && (
              <p className="text-sm text-red-600">{saveError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  const next = e.target.value;
                  setCurrentPassword(next);
                  if (getPasswordByteLength(next) > MAX_PASSWORD_BYTES) {
                    setPasswordError(`Current password must be at most ${MAX_PASSWORD_BYTES} bytes.`);
                  } else if (passwordError) {
                    setPasswordError(null);
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  const next = e.target.value;
                  setNewPassword(next);
                  if (getPasswordByteLength(next) > MAX_PASSWORD_BYTES) {
                    setPasswordError(`New password must be at most ${MAX_PASSWORD_BYTES} bytes.`);
                  } else if (passwordError) {
                    setPasswordError(null);
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                Minimum {MIN_PASSWORD_LENGTH} characters. Maximum {MAX_PASSWORD_BYTES} bytes.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  const next = e.target.value;
                  setConfirmPassword(next);
                  if (passwordError && next === newPassword) {
                    setPasswordError(null);
                  }
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
            {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Urgent Findings Alert</p>
                <p className="text-sm text-gray-600">Receive immediate notifications for urgent cases</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Analysis Complete</p>
                <p className="text-sm text-gray-600">Notify when AI analysis is finished</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Weekly Summary</p>
                <p className="text-sm text-gray-600">Receive weekly performance reports</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">AI Updates</p>
                <p className="text-sm text-gray-600">Notifications about new AI features</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Assistant Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Auto-suggest Treatment Plans</p>
                <p className="text-sm text-gray-600">AI automatically suggests treatment sequences</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Patient Education Materials</p>
                <p className="text-sm text-gray-600">Generate patient-friendly explanations</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Clinical References</p>
                <p className="text-sm text-gray-600">Include literature references in responses</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Confidence Threshold</p>
                <p className="text-sm text-gray-600">Minimum confidence level for AI suggestions</p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="85" className="w-20" min="0" max="100" />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Status & Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">System Status</span>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">AI Model Version</p>
                <p className="font-medium text-gray-900">DentalAI v2.3.1</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">February 15, 2026</p>
              </div>
              <div>
                <p className="text-gray-600">System Version</p>
                <p className="font-medium text-gray-900">1.0.0</p>
              </div>
              <div>
                <p className="text-gray-600">Server Region</p>
                <p className="font-medium text-gray-900">US-East</p>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Next Scheduled Maintenance:</strong> February 28, 2026, 2:00 AM - 4:00 AM EST
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Button variant="outline">Change Password</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="30" className="w-20" min="5" max="120" />
                <span className="text-sm text-gray-600">min</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full sm:w-auto">
                Download Data
              </Button>
              <p className="text-xs text-gray-600">Export all your data in accordance with privacy regulations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
