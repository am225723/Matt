/**
 * PDF Service for Ketamine Question Bank Application
 * Handles PDF generation and export functionality
 */

class PDFService {
  /**
   * Generate a PDF from session data
   * @param {Object} sessionData - The session data containing questions, responses, and followups
   * @param {String} userName - Optional user name for the PDF header
   * @returns {Blob} - PDF file as a Blob
   */
  static generatePDF(sessionData, userName = 'User') {
    return new Promise((resolve, reject) => {
      try {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
          console.warn('jsPDF library not found. Using fallback method.');
          return resolve(this.generateFallbackPDF(sessionData, userName));
        }
        
        // Get the jsPDF instance
        const { jsPDF } = window.jspdf;
        
        // Create a new jsPDF instance
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add title
        doc.setFontSize(22);
        doc.setTextColor(106, 76, 147); // #6a4c93
        doc.text('Ketamine Therapy Reflection', 105, 20, { align: 'center' });
        
        // Add date
        const today = new Date();
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51); // #333333
        doc.text(`Date: ${today.toLocaleDateString()}`, 105, 30, { align: 'center' });
        
        // Add user name if provided
        doc.text(`Name: ${userName}`, 105, 40, { align: 'center' });
        
        // Add content
        let yPosition = 60;
        
        // Loop through each question and response
        for (let i = 0; i < sessionData.questions.length; i++) {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Add question number
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(74, 44, 115); // #4a2c73
          doc.text(`Question ${i + 1}`, 20, yPosition);
          yPosition += 10;
          
          // Handle long questions with text wrapping
          const questionLines = doc.splitTextToSize(sessionData.questions[i], 170);
          doc.setFontSize(14);
          doc.setTextColor(51, 51, 51); // #333333
          doc.text(questionLines, 20, yPosition);
          yPosition += (questionLines.length * 7);
          
          // Add response
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text('Your Response:', 20, yPosition);
          yPosition += 10;
          
          // Handle long responses with text wrapping
          const responseLines = doc.splitTextToSize(sessionData.responses[i] || 'No response recorded', 170);
          doc.setFontSize(12);
          doc.setFont(undefined, 'normal');
          doc.text(responseLines, 20, yPosition);
          yPosition += (responseLines.length * 7);
          
          // Add follow-up question if available
          if (sessionData.followups && sessionData.followups[i]) {
            // Check if we need a new page
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(52, 152, 219); // #3498db
            doc.text('AI Follow-up:', 20, yPosition);
            yPosition += 10;
            
            const followupLines = doc.splitTextToSize(sessionData.followups[i], 170);
            doc.setFontSize(12);
            doc.setFont(undefined, 'italic');
            doc.text(followupLines, 20, yPosition);
            yPosition += (followupLines.length * 7) + 15;
          } else {
            yPosition += 15;
          }
        }
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(102, 102, 102); // #666666
          doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        }
        
        // Return the PDF as a blob
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
      } catch (error) {
        console.error('Error generating PDF:', error);
        // Use fallback method if jsPDF fails
        resolve(this.generateFallbackPDF(sessionData, userName));
      }
    });
  }
  
  /**
   * Generate a fallback PDF when jsPDF is not available
   * @param {Object} sessionData - The session data
   * @param {String} userName - User name
   * @returns {Blob} - Text file as a Blob
   */
  static generateFallbackPDF(sessionData, userName) {
    // Create a text representation of the data
    let textContent = `KETAMINE THERAPY REFLECTION\n`;
    textContent += `Date: ${new Date().toLocaleDateString()}\n`;
    textContent += `Name: ${userName}\n\n`;
    
    // Add questions and responses
    for (let i = 0; i < sessionData.questions.length; i++) {
      textContent += `QUESTION ${i + 1}:\n`;
      textContent += `${sessionData.questions[i]}\n\n`;
      textContent += `YOUR RESPONSE:\n`;
      textContent += `${sessionData.responses[i] || 'No response recorded'}\n\n`;
      
      if (sessionData.followups && sessionData.followups[i]) {
        textContent += `AI FOLLOW-UP:\n`;
        textContent += `${sessionData.followups[i]}\n\n`;
      }
      
      textContent += `----------------------------------------\n\n`;
    }
    
    // Return as a text file blob
    return new Blob([textContent], { type: 'text/plain' });
  }
  
  /**
   * Save the PDF to the user's device
   * @param {Blob} pdfBlob - The PDF file as a Blob
   * @param {String} fileName - The name to save the file as
   */
  static savePDF(pdfBlob, fileName = 'ketamine-reflection.pdf') {
    // Create a download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default PDFService;
