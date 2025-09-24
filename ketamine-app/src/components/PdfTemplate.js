/**
 * PDF Template Component for Ketamine Question Bank Application
 * Defines the structure and styling for generated PDFs
 */

class PdfTemplate {
  /**
   * Generate PDF content from session data
   * @param {Object} sessionData - The session data containing questions, responses, and followups
   * @param {String} userName - Optional user name for the PDF header
   * @returns {Object} - PDF configuration object for jsPDF
   */
  static generateTemplate(sessionData, userName = 'User') {
    // Format the date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create document definition
    const docDefinition = {
      info: {
        title: 'Ketamine Therapy Reflection',
        author: userName,
        subject: 'Therapy Reflections',
        keywords: 'ketamine, therapy, reflection, anxiety'
      },
      content: [
        // Header
        {
          text: 'Ketamine Therapy Reflection',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: `Date: ${formattedDate}`,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Name: ${userName}`,
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        
        // Content - Questions and Responses
        ...this.generateQuestionsAndResponses(sessionData),
        
        // Footer
        {
          text: 'This document contains personal reflections from ketamine therapy sessions.',
          style: 'footer',
          alignment: 'center',
          margin: [0, 30, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#6a4c93'
        },
        questionHeader: {
          fontSize: 16,
          bold: true,
          color: '#4a2c73',
          margin: [0, 20, 0, 10]
        },
        question: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        responseHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        response: {
          fontSize: 12,
          margin: [0, 0, 0, 10],
          italics: false
        },
        followupHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
          color: '#3498db'
        },
        followup: {
          fontSize: 12,
          italics: true,
          color: '#3498db',
          margin: [0, 0, 0, 20]
        },
        footer: {
          fontSize: 10,
          italics: true,
          color: '#666666'
        }
      },
      defaultStyle: {
        fontSize: 12,
        color: '#333333'
      },
      pageMargins: [40, 60, 40, 60],
      footer: function(currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        };
      }
    };
    
    return docDefinition;
  }
  
  /**
   * Generate questions and responses content for the PDF
   * @param {Object} sessionData - The session data
   * @returns {Array} - Array of content objects for the PDF
   */
  static generateQuestionsAndResponses(sessionData) {
    const content = [];
    
    // Loop through each question and response
    for (let i = 0; i < sessionData.questions.length; i++) {
      // Add question number header
      content.push({
        text: `Question ${i + 1}`,
        style: 'questionHeader'
      });
      
      // Add question
      content.push({
        text: sessionData.questions[i],
        style: 'question'
      });
      
      // Add response header
      content.push({
        text: 'Your Response:',
        style: 'responseHeader'
      });
      
      // Add response
      content.push({
        text: sessionData.responses[i] || 'No response recorded',
        style: 'response'
      });
      
      // Add follow-up if available
      if (sessionData.followups && sessionData.followups[i]) {
        content.push({
          text: 'AI Follow-up Question:',
          style: 'followupHeader'
        });
        
        content.push({
          text: sessionData.followups[i],
          style: 'followup'
        });
      }
    }
    
    return content;
  }
}

export default PdfTemplate;