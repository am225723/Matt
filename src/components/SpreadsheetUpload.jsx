import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

const SpreadsheetUpload = ({ onDataImport, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  // Expected columns for health data
  const expectedColumns = {
    date: ['date', 'Date', 'DATE', 'timestamp', 'Timestamp'],
    steps: ['steps', 'Steps', 'STEPS', 'step_count', 'stepCount'],
    sleep: ['sleep', 'Sleep', 'SLEEP', 'sleep_hours', 'sleepHours', 'hours_slept'],
    heartRate: ['heart_rate', 'heartRate', 'Heart Rate', 'HR', 'bpm', 'pulse'],
    weight: ['weight', 'Weight', 'WEIGHT', 'body_weight', 'bodyWeight'],
    stressLevel: ['stress', 'Stress', 'stress_level', 'stressLevel', 'Stress Level'],
    alcoholIntake: ['alcohol', 'Alcohol', 'drinks', 'Drinks', 'alcohol_intake'],
    calories: ['calories', 'Calories', 'CALORIES', 'calorie_intake', 'calorieIntake'],
    mood: ['mood', 'Mood', 'MOOD', 'mood_score', 'moodScore'],
    exerciseMinutes: ['exercise', 'Exercise', 'exercise_minutes', 'exerciseMinutes', 'workout'],
    sleepQuality: ['sleep_quality', 'sleepQuality', 'Sleep Quality', 'quality'],
    waterIntake: ['water', 'Water', 'water_intake', 'waterIntake', 'hydration']
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setErrors([]);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('File must contain at least a header row and one data row');
          }
          
          // Extract headers and data
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          // Auto-detect column mapping
          const mapping = autoDetectColumns(headers);
          setColumnMapping(mapping);
          
          // Preview first 5 rows
          const preview = rows.slice(0, 5).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          setPreviewData({
            headers,
            rows: preview,
            totalRows: rows.length,
            fullData: rows
          });
          
          // Validate data
          validateData(rows, headers, mapping);
          
        } catch (error) {
          console.error('Error parsing file:', error);
          setErrors([error.message]);
          toast({
            variant: "destructive",
            title: "Error Processing File",
            description: error.message,
          });
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setErrors(['Failed to read file']);
        setIsProcessing(false);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setErrors([error.message]);
      setIsProcessing(false);
    }
  };

  const autoDetectColumns = (headers) => {
    const mapping = {};
    
    Object.entries(expectedColumns).forEach(([key, possibleNames]) => {
      const matchedHeader = headers.find(header => 
        possibleNames.some(name => 
          header.toLowerCase().includes(name.toLowerCase())
        )
      );
      if (matchedHeader) {
        mapping[key] = matchedHeader;
      }
    });
    
    return mapping;
  };

  const validateData = (rows, headers, mapping) => {
    const validationErrors = [];
    
    // Check if date column is mapped
    if (!mapping.date) {
      validationErrors.push('Date column not found. Please ensure your spreadsheet has a date column.');
    }
    
    // Check if at least one health metric is mapped
    const healthMetrics = Object.keys(mapping).filter(key => key !== 'date');
    if (healthMetrics.length === 0) {
      validationErrors.push('No health metrics detected. Please check your column names.');
    }
    
    // Validate date format in first few rows
    if (mapping.date) {
      const dateColumnIndex = headers.indexOf(mapping.date);
      const sampleDates = rows.slice(0, 5).map(row => row[dateColumnIndex]);
      
      sampleDates.forEach((dateValue, index) => {
        if (dateValue && !isValidDate(dateValue)) {
          validationErrors.push(`Invalid date format in row ${index + 2}: ${dateValue}`);
        }
      });
    }
    
    setErrors(validationErrors);
  };

  const isValidDate = (dateValue) => {
    // Try to parse various date formats
    const date = new Date(dateValue);
    return date instanceof Date && !isNaN(date);
  };

  const handleImport = () => {
    if (!previewData || errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Import",
        description: "Please fix errors before importing.",
      });
      return;
    }
    
    try {
      const { headers, fullData } = previewData;
      
      // Transform data to match health data format
      const transformedData = fullData.map(row => {
        const entry = {};
        
        Object.entries(columnMapping).forEach(([key, headerName]) => {
          const columnIndex = headers.indexOf(headerName);
          const value = row[columnIndex];
          
          if (key === 'date') {
            // Parse and format date
            const date = new Date(value);
            entry.date = date.toISOString();
          } else if (value !== undefined && value !== null && value !== '') {
            // Parse numeric values
            const numValue = parseFloat(value);
            entry[key] = isNaN(numValue) ? value : numValue;
          }
        });
        
        return entry;
      }).filter(entry => entry.date); // Only include entries with valid dates
      
      // Call the import callback
      onDataImport(transformedData);
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${transformedData.length} entries.`,
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message,
      });
    }
  };

  const downloadTemplate = () => {
    // Create a sample template
    const template = [
      ['date', 'steps', 'sleep', 'heartRate', 'weight', 'stressLevel', 'calories', 'mood', 'exerciseMinutes', 'waterIntake'],
      ['2025-01-01', '8000', '7.5', '72', '150', '5', '2000', '4', '45', '64'],
      ['2025-01-02', '10000', '8', '70', '149.5', '4', '1800', '5', '60', '72'],
      ['2025-01-03', '7500', '6.5', '75', '150', '6', '2200', '3', '30', '56']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Health Data Template');
    XLSX.writeFile(wb, 'health_data_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Use this template to format your health data.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" />
              Import Health Data from Spreadsheet
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white text-lg">Select File</Label>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-white mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-400">
                  Supports Excel (.xlsx, .xls) and CSV files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-white mt-2">Processing file...</p>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-400 font-semibold mb-2">Validation Errors</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-300 text-sm">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Column Mapping */}
            {previewData && Object.keys(columnMapping).length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Detected Columns
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(columnMapping).map(([key, value]) => (
                    <div key={key} className="bg-gray-700 rounded px-3 py-2">
                      <p className="text-xs text-gray-400">{key}</p>
                      <p className="text-sm text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {previewData && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold">
                  Preview (showing 5 of {previewData.totalRows} rows)
                </h3>
                <div className="overflow-x-auto bg-gray-800 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700">
                      <tr>
                        {previewData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left text-white font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-700">
                          {previewData.headers.map((header, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-gray-300">
                              {row[header] !== undefined ? String(row[header]) : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import Button */}
            {previewData && (
              <div className="flex gap-3">
                <Button 
                  onClick={handleImport} 
                  disabled={errors.length > 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import {previewData.totalRows} Entries
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-200 font-semibold mb-2">Instructions</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-200 text-sm">
                <li>Your spreadsheet must include a date column</li>
                <li>Column names should match common health metric names (steps, sleep, heartRate, etc.)</li>
                <li>Dates should be in a standard format (YYYY-MM-DD, MM/DD/YYYY, etc.)</li>
                <li>Numeric values should be numbers without units</li>
                <li>Download the template for a properly formatted example</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SpreadsheetUpload;