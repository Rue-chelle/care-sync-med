
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (title: string, data: any[], filename: string) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('AloraMed Healthcare System', 20, 20);
  
  doc.setFontSize(16);
  doc.text(title, 20, 35);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Prepare table data based on the type of export
  let headers: string[] = [];
  let rows: any[][] = [];
  
  if (title.includes('Prescription')) {
    headers = ['ID', 'Patient', 'Doctor', 'Medication', 'Dosage', 'Duration', 'Date', 'Status'];
    rows = data.map(item => [
      item.id,
      item.patient,
      item.doctor,
      item.medication,
      item.dosage,
      item.duration,
      item.date,
      item.status
    ]);
  } else if (title.includes('Billing')) {
    headers = ['Invoice ID', 'Patient', 'Doctor', 'Service', 'Amount', 'Date', 'Status'];
    rows = data.map(item => [
      item.id,
      item.patient,
      item.doctor,
      item.service,
      `$${item.amount?.toFixed(2)}`,
      item.date,
      item.status
    ]);
  } else {
    // Generic export
    if (data.length > 0) {
      headers = Object.keys(data[0]);
      rows = data.map(item => Object.values(item));
    }
  }
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
  });
  
  // Save the PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
