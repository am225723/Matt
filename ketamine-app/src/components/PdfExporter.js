/**
 * PDF Exporter Component for Ketamine Question Bank Application
 * Handles PDF generation and export
 */

import PDFService from '../services/pdfService.js';

class PdfExporter {
  /**
   * Generate and export a PDF from session data
   * @param {Object} sessionData - The session data to export
   * @param {String} userName - Optional user name for the PDF header
   */
  static exportToPDF(sessionData, userName = '') {
    // Show loading indicator
    this.showLoadingIndicator();
    
    try {
      // Generate the PDF
      const pdfBlob = PDFService.generatePDF(sessionData, userName);
      
      // Save the PDF
      PDFService.savePDF(pdfBlob, this.generateFileName(sessionData));
      
      // Show success message
      this.showSuccessMessage();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.showErrorMessage(error.message);
    } finally {
      // Hide loading indicator
      this.hideLoadingIndicator();
    }
  }
  
  /**
   * Generate a filename for the PDF
   * @param {Object} sessionData - The session data
   * @returns {String} - The filename
   */
  static generateFileName(sessionData) {
    // Use the first question as part of the filename (shortened)
    let questionPart = '';
    if (sessionData.questions && sessionData.questions.length > 0) {
      questionPart = sessionData.questions[0]
        .substring(0, 20)
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
    }
    
    // Create a filename with date and question
    const date = new Date().toISOString().split('T')[0];
    return `ketamine-reflection-${date}-${questionPart}.pdf`;
  }
  
  /**
   * Show a loading indicator
   */
  static showLoadingIndicator() {
    // Create loading indicator if it doesn't exist
    let loadingIndicator = document.getElementById('pdf-loading-indicator');
    
    if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'pdf-loading-indicator';
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Generating PDF...</p>
      `;
      document.body.appendChild(loadingIndicator);
    }
    
    // Show the loading indicator
    loadingIndicator.style.display = 'flex';
  }
  
  /**
   * Hide the loading indicator
   */
  static hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('pdf-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
  
  /**
   * Show a success message
   */
  static showSuccessMessage() {
    // Create toast notification
    this.showToast('PDF exported successfully!', 'success');
  }
  
  /**
   * Show an error message
   * @param {String} message - The error message
   */
  static showErrorMessage(message) {
    // Create toast notification
    this.showToast(`Error exporting PDF: ${message}`, 'error');
  }
  
  /**
   * Show a toast notification
   * @param {String} message - The message to show
   * @param {String} type - The type of toast (success, error, info)
   */
  static showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <p>${message}</p>
      </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  /**
   * Preview the PDF before exporting
   * @param {Object} sessionData - The session data to preview
   */
  static previewPDF(sessionData) {
    // In a real implementation, this would generate a preview
    // For now, we'll just show a message
    this.showToast('PDF preview not available in this demo version', 'info');
  }
}

export default PdfExporter;