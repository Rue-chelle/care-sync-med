
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (
  elementId: string, 
  filename: string = 'report.pdf',
  options?: {
    orientation?: 'portrait' | 'landscape';
    unit?: 'mm' | 'pt' | 'in';
    format?: string | number[];
  }
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options?.orientation || 'portrait',
      unit: options?.unit || 'mm',
      format: options?.format || 'a4'
    });

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

    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
};

export const generatePrescriptionPDF = (prescription: any) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('Medical Prescription', 20, 30);
  
  // Patient info
  pdf.setFontSize(12);
  pdf.text(`Patient: ${prescription.patient}`, 20, 50);
  pdf.text(`Doctor: ${prescription.doctor}`, 20, 60);
  pdf.text(`Date: ${prescription.date}`, 20, 70);
  
  // Prescription details
  pdf.setFontSize(14);
  pdf.text('Prescription Details:', 20, 90);
  
  pdf.setFontSize(12);
  pdf.text(`Medication: ${prescription.medication}`, 20, 110);
  pdf.text(`Dosage: ${prescription.dosage}`, 20, 120);
  pdf.text(`Duration: ${prescription.duration}`, 20, 130);
  
  if (prescription.instructions) {
    pdf.text(`Instructions: ${prescription.instructions}`, 20, 140);
  }
  
  pdf.save(`prescription-${prescription.id}.pdf`);
};
