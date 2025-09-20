import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, RotateCcw } from 'lucide-react';

export default function PlaybookHeader({ hasSaved, onLoad, onExport, onReset }) {
  return (
    <div className="relative z-10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Resilience Playbook
            </h1>
            <p className="text-white/80">
              Build your personalized coping strategy
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onLoad}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={!hasSaved}
            >
              <Upload className="w-4 h-4 mr-2" />
              Load
            </Button>
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}