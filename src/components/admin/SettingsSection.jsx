import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  RefreshCw, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Smartphone,
  Database,
  Cloud,
  HardDrive
} from 'lucide-react';

const SettingsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Matthew's Playbook",
    siteDescription: "Your space for mental clarity and resilience",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "en-US"
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#3b82f6",
    accentColor: "#10b981",
    fontFamily: "Inter, sans-serif",
    enableAnimations: true
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    notifyOnLogin: true,
    notifyOnUpdate: true,
    digestFrequency: "daily"
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    minimumPasswordLength: 12,
    requireSpecialChars: true
  });
  
  // Handle form submission
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
      alert("Settings saved successfully!");
    }, 1500);
  };
  
  // Handle input change for general settings
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle toggle change
  const handleToggleChange = (settingType, settingName) => {
    if (settingType === 'appearance') {
      setAppearanceSettings(prev => ({
        ...prev,
        [settingName]: !prev[settingName]
      }));
    } else if (settingType === 'notification') {
      setNotificationSettings(prev => ({
        ...prev,
        [settingName]: !prev[settingName]
      }));
    } else if (settingType === 'security') {
      setSecuritySettings(prev => ({
        ...prev,
        [settingName]: !prev[settingName]
      }));
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500">Customize your dashboard experience</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      name="siteName" 
                      value={generalSettings.siteName} 
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input 
                      id="siteDescription" 
                      name="siteDescription" 
                      value={generalSettings.siteDescription} 
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      id="timezone" 
                      name="timezone" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={generalSettings.timezone}
                      onChange={handleGeneralChange}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select 
                      id="dateFormat" 
                      name="dateFormat" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={generalSettings.dateFormat}
                      onChange={handleGeneralChange}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="MMMM D, YYYY">MMMM D, YYYY</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language" 
                      name="language" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={generalSettings.language}
                      onChange={handleGeneralChange}
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Configure data storage and backup settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Database Settings</h4>
                        <p className="text-sm text-gray-500">Configure database connection</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Cloud Storage</h4>
                        <p className="text-sm text-gray-500">Manage cloud storage options</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Backup Settings</h4>
                        <p className="text-sm text-gray-500">Schedule automatic backups</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          appearanceSettings.theme === 'light' ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="font-medium">Light Mode</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${
                            appearanceSettings.theme === 'light' ? 'bg-blue-500' : 'border border-gray-300'
                          }`}></div>
                        </div>
                        <div className="h-20 bg-gray-100 rounded-md border border-gray-200"></div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          appearanceSettings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                            <span className="font-medium">Dark Mode</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${
                            appearanceSettings.theme === 'dark' ? 'bg-blue-500' : 'border border-gray-300'
                          }`}></div>
                        </div>
                        <div className="h-20 bg-gray-800 rounded-md border border-gray-700"></div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          appearanceSettings.theme === 'system' ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'system'})}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex">
                              <Sun className="h-5 w-5 text-yellow-500" />
                              <Moon className="h-5 w-5 text-indigo-500 -ml-1" />
                            </div>
                            <span className="font-medium ml-1">System Default</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${
                            appearanceSettings.theme === 'system' ? 'bg-blue-500' : 'border border-gray-300'
                          }`}></div>
                        </div>
                        <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-800 rounded-md border border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: appearanceSettings.primaryColor }}
                        ></div>
                        <Input 
                          id="primaryColor" 
                          name="primaryColor" 
                          type="color"
                          value={appearanceSettings.primaryColor} 
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: appearanceSettings.accentColor }}
                        ></div>
                        <Input 
                          id="accentColor" 
                          name="accentColor" 
                          type="color"
                          value={appearanceSettings.accentColor} 
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <select 
                        id="fontFamily" 
                        name="fontFamily" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={appearanceSettings.fontFamily}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, fontFamily: e.target.value})}
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Options</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Animations</h4>
                        <p className="text-sm text-gray-500">Show animations and transitions throughout the interface</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="animations"
                          checked={appearanceSettings.enableAnimations}
                          onChange={() => handleToggleChange('appearance', 'enableAnimations')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            appearanceSettings.enableAnimations ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={() => handleToggleChange('notification', 'emailNotifications')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            notificationSettings.emailNotifications ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="pushNotifications"
                          checked={notificationSettings.pushNotifications}
                          onChange={() => handleToggleChange('notification', 'pushNotifications')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            notificationSettings.pushNotifications ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Events</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Activity</h4>
                        <p className="text-sm text-gray-500">Notify when there's a new login to your account</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="notifyOnLogin"
                          checked={notificationSettings.notifyOnLogin}
                          onChange={() => handleToggleChange('notification', 'notifyOnLogin')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            notificationSettings.notifyOnLogin ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Updates</h4>
                        <p className="text-sm text-gray-500">Notify when there are system updates or maintenance</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="notifyOnUpdate"
                          checked={notificationSettings.notifyOnUpdate}
                          onChange={() => handleToggleChange('notification', 'notifyOnUpdate')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            notificationSettings.notifyOnUpdate ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="digestFrequency">Email Digest Frequency</Label>
                    <select 
                      id="digestFrequency" 
                      name="digestFrequency" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={notificationSettings.digestFrequency}
                      onChange={(e) => setNotificationSettings({...notificationSettings, digestFrequency: e.target.value})}
                    >
                      <option value="realtime">Real-time</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={() => handleToggleChange('security', 'twoFactorAuth')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          securitySettings.twoFactorAuth ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="sessionTimeout" 
                        name="sessionTimeout" 
                        type="number"
                        min="5"
                        max="1440"
                        value={securitySettings.sessionTimeout} 
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">Time before inactive users are logged out</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input 
                        id="passwordExpiry" 
                        name="passwordExpiry" 
                        type="number"
                        min="0"
                        max="365"
                        value={securitySettings.passwordExpiry} 
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">Days before password change is required (0 = never)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minimumPasswordLength">Minimum Password Length</Label>
                      <Input 
                        id="minimumPasswordLength" 
                        name="minimumPasswordLength" 
                        type="number"
                        min="8"
                        max="32"
                        value={securitySettings.minimumPasswordLength} 
                        onChange={(e) => setSecuritySettings({...securitySettings, minimumPasswordLength: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Require Special Characters</h4>
                        <p className="text-sm text-gray-500">Passwords must include special characters</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="requireSpecialChars"
                          checked={securitySettings.requireSpecialChars}
                          onChange={() => handleToggleChange('security', 'requireSpecialChars')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            securitySettings.requireSpecialChars ? 'transform translate-x-6 bg-blue-600' : 'bg-white'
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Security Actions</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full md:w-auto">
                        Reset Password
                      </Button>
                      <Button variant="outline" className="w-full md:w-auto">
                        View Login History
                      </Button>
                      <Button variant="outline" className="w-full md:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">
                        Revoke All Sessions
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;