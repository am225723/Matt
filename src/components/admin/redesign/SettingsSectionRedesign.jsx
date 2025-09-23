import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  HardDrive,
  Palette,
  Layout,
  Type,
  Monitor,
  Lock,
  Key,
  Clock,
  User,
  Users,
  FileText,
  Image,
  Sliders,
  Check,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';

const SettingsSectionRedesign = ({ darkMode, toggleDarkMode }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Matthew's Playbook",
    siteDescription: "Your space for mental clarity and resilience",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "en-US"
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: darkMode ? "dark" : "light",
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
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
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
  
  // Handle theme change
  const handleThemeChange = (theme) => {
    setAppearanceSettings(prev => ({
      ...prev,
      theme
    }));
    
    if (theme === 'dark' && !darkMode) {
      toggleDarkMode();
    } else if (theme === 'light' && darkMode) {
      toggleDarkMode();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your dashboard experience</p>
      </div>
      
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-4 rounded-md flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Settings saved successfully</p>
            <p className="text-sm text-green-700 dark:text-green-400">Your changes have been applied.</p>
          </div>
        </div>
      )}
      
      {/* Settings Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Sliders className="h-4 w-4 mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-2 px-1 inline-flex items-center border-b-2 whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </button>
        </nav>
      </div>
      
      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Configure data storage and backup settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Database Settings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure database connection</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Cloud Storage</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage cloud storage options</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Backup Settings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Schedule automatic backups</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Export Data</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Download all system data</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
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
                      className={`border dark:border-gray-700 rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium">Light Mode</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${
                          appearanceSettings.theme === 'light' ? 'bg-blue-500' : 'border border-gray-300 dark:border-gray-600'
                        }`}></div>
                      </div>
                      <div className="h-20 bg-gray-100 dark:bg-gray-100 rounded-md border border-gray-200"></div>
                    </div>
                    
                    <div 
                      className={`border dark:border-gray-700 rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                          <span className="font-medium">Dark Mode</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${
                          appearanceSettings.theme === 'dark' ? 'bg-blue-500' : 'border border-gray-300 dark:border-gray-600'
                        }`}></div>
                      </div>
                      <div className="h-20 bg-gray-800 rounded-md border border-gray-700"></div>
                    </div>
                    
                    <div 
                      className={`border dark:border-gray-700 rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleThemeChange('system')}
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
                          appearanceSettings.theme === 'system' ? 'bg-blue-500' : 'border border-gray-300 dark:border-gray-600'
                        }`}></div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-800 rounded-md border border-gray-300 dark:border-gray-600"></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border dark:border-gray-600"
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
                        className="w-8 h-8 rounded-full border dark:border-gray-600"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="layoutDensity">Layout Density</Label>
                    <select 
                      id="layoutDensity" 
                      name="layoutDensity" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable" selected>Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Animations</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show animations and transitions throughout the interface</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="animations"
                        checked={appearanceSettings.enableAnimations}
                        onChange={() => handleToggleChange('appearance', 'enableAnimations')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          appearanceSettings.enableAnimations ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reduced Motion</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations for accessibility</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="reducedMotion"
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white dark:bg-gray-400`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">High Contrast Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="highContrast"
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white dark:bg-gray-400`}
                      ></span>
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Notification Settings */}
      {activeTab === 'notifications' && (
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
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleToggleChange('notification', 'emailNotifications')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.emailNotifications ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleToggleChange('notification', 'pushNotifications')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.pushNotifications ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">In-App Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Show notifications within the application</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="inAppNotifications"
                        checked={true}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600 dark:bg-blue-500`}
                      ></span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Events</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Activity</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when there's a new login to your account</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="notifyOnLogin"
                        checked={notificationSettings.notifyOnLogin}
                        onChange={() => handleToggleChange('notification', 'notifyOnLogin')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.notifyOnLogin ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when there are system updates or maintenance</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="notifyOnUpdate"
                        checked={notificationSettings.notifyOnUpdate}
                        onChange={() => handleToggleChange('notification', 'notifyOnUpdate')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.notifyOnUpdate ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">User Activity</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when users perform important actions</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="notifyOnUserActivity"
                        checked={true}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600 dark:bg-blue-500`}
                      ></span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digestFrequency">Email Digest Frequency</Label>
                  <select 
                    id="digestFrequency" 
                    name="digestFrequency" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={notificationSettings.digestFrequency}
                    onChange={(e) => setNotificationSettings({...notificationSettings, digestFrequency: e.target.value})}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                    <option value="never">Never</option>
                  </select>
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
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
                      <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={() => handleToggleChange('security', 'twoFactorAuth')}
                      />
                      <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          securitySettings.twoFactorAuth ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time before inactive users are logged out</p>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">Days before password change is required (0 = never)</p>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Passwords must include special characters</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="requireSpecialChars"
                          checked={securitySettings.requireSpecialChars}
                          onChange={() => handleToggleChange('security', 'requireSpecialChars')}
                        />
                        <span 
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            securitySettings.requireSpecialChars ? 'transform translate-x-6 bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-400'
                          }`}
                        ></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Security Actions</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline">
                        Reset Password
                      </Button>
                      <Button variant="outline">
                        View Login History
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20">
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
          
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">API Access</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable API access for third-party integrations</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      id="apiAccess"
                      checked={true}
                    />
                    <span 
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600 dark:bg-blue-500`}
                    ></span>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">API Key</h4>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex items-center justify-between">
                    <code className="text-sm">••••••••••••••••••••••••••••••</code>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Last used: 2 days ago • Created: Sep 15, 2025
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Manage API Keys
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Integrations Settings */}
      {activeTab === 'integrations' && (
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect with third-party services and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Facebook</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Facebook account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Twitter</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Twitter account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Slack</h4>
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Connected</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in Slack</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018s7 3.14 7 7.018c0 3.878-3.132 7.018-7 7.018zm-1.503-10.851v3.837c0 .27.174.408.348.408.174 0 .36-.132.54-.264l2.256-1.74c.216-.162.27-.378.27-.54 0-.162-.054-.378-.27-.54l-2.256-1.74c-.18-.132-.366-.264-.54-.264-.174 0-.348.138-.348.408v3.837z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Analytics</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track website analytics</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsSectionRedesign;