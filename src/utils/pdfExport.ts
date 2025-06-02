
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (data: any[], filename: string, title: string) => {
  try {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(title, 20, 20);
    
    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add data as table
    let yPosition = 50;
    
    if (Array.isArray(data) && data.length > 0) {
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Add headers
      pdf.setFontSize(12);
      headers.forEach((header, index) => {
        pdf.text(header.charAt(0).toUpperCase() + header.slice(1), 20 + (index * 40), yPosition);
      });
      
      yPosition += 10;
      
      // Add data rows
      pdf.setFontSize(10);
      data.forEach((row, rowIndex) => {
        headers.forEach((header, colIndex) => {
          const value = row[header] ? String(row[header]) : '';
          pdf.text(value.substring(0, 15), 20 + (colIndex * 40), yPosition + (rowIndex * 8));
        });
      });
    }
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportElementToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
