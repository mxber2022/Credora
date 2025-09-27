var fs = require('fs');
var path = require('path');
var PDFDocument = require('pdfkit');

function createPayslip() {
    // Create a new PDF document
    var doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set up the output stream
    var outputPath = path.join(__dirname, '/../../../resources/sample-payslip.pdf');
    var stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text('PAYSLIP', 50, 50, { align: 'center' });
    
    // Company info
    doc.fontSize(12)
       .font('Helvetica')
       .text('ABC Company Ltd.', 50, 100)
       .text('123 Business Street', 50, 115)
       .text('City, State 12345', 50, 130);
    
    // Employee info
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Employee Information:', 50, 180);
    
    doc.fontSize(12)
       .font('Helvetica')
       .text('Name: John Doe', 50, 200)
       .text('Employee ID: EMP001', 50, 215)
       .text('Department: IT', 50, 230)
       .text('Pay Period: January 2024', 50, 245);
    
    // Pay details table
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Pay Details:', 50, 280);
    
    // Table headers
    var tableTop = 300;
    var tableLeft = 50;
    var col1 = tableLeft;
    var col2 = tableLeft + 200;
    var col3 = tableLeft + 350;
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text('Description', col1, tableTop)
       .text('Hours/Amount', col2, tableTop)
       .text('Total', col3, tableTop);
    
    // Table rows
    var currentY = tableTop + 20;
    doc.font('Helvetica')
       .text('Basic Salary', col1, currentY)
       .text('40 hours', col2, currentY)
       .text('$3,000.00', col3, currentY);
    
    currentY += 20;
    doc.text('Overtime', col1, currentY)
       .text('5 hours', col2, currentY)
       .text('$187.50', col3, currentY);
    
    currentY += 20;
    doc.text('Bonus', col1, currentY)
       .text('1.0', col2, currentY)
       .text('$500.00', col3, currentY);
    
    // Deductions
    currentY += 40;
    doc.font('Helvetica-Bold')
       .text('Deductions:', col1, currentY);
    
    currentY += 20;
    doc.font('Helvetica')
       .text('Tax', col1, currentY)
       .text('', col2, currentY)
       .text('$450.00', col3, currentY);
    
    currentY += 20;
    doc.text('Insurance', col1, currentY)
       .text('', col2, currentY)
       .text('$120.00', col3, currentY);
    
    currentY += 20;
    doc.text('Retirement', col1, currentY)
       .text('', col2, currentY)
       .text('$180.00', col3, currentY);
    
    // Net pay
    currentY += 40;
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Net Pay: $2,937.50', col3, currentY);
    
    // Footer
    doc.fontSize(10)
       .font('Helvetica')
       .text('This is a computer generated payslip.', 50, 500)
       .text('Generated on: ' + new Date().toLocaleDateString(), 50, 515);
    
    // Add a line for signature
    doc.text('Authorized Signature: _________________', 50, 550)
       .text('Date: _________________', 300, 550);
    
    // Finalize the PDF
    doc.end();
    
    stream.on('finish', function() {
        console.log('Sample payslip created successfully at:', outputPath);
    });
}

createPayslip();

