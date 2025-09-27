var fs = require('fs');
var path = require('path');
var PDFDocument = require('pdf-lib').PDFDocument;
var pdflibAddPlaceholder = require('@signpdf/placeholder-pdf-lib').pdflibAddPlaceholder;
var signpdf = require('@signpdf/signpdf').default;
var P12Signer = require('@signpdf/signer-p12').P12Signer;

function work() {
    // sample-payslip.pdf is the file that is going to be signed
    var sourcePath = path.join(__dirname, '/../../../resources/sample-payslip.pdf');
    var pdfBuffer = fs.readFileSync(sourcePath);
    
    // certificate.p12 is the certificate that is going to be used to sign
    var certificatePath = path.join(__dirname, '/../../../resources/certificate.p12');
    var certificateBuffer = fs.readFileSync(certificatePath);
    var signer = new P12Signer(certificateBuffer);

    // Load the document into PDF-LIB
    PDFDocument.load(pdfBuffer).then(function (pdfDoc) {
        // Add a placeholder for a signature.
        pdflibAddPlaceholder({
            pdfDoc: pdfDoc,
            reason: 'Digital signature for sample payslip document',
            contactInfo: 'hr@abccompany.com',
            name: 'HR Department',
            location: 'ABC Company Ltd.',
        });

        // Get the modified PDFDocument bytes
        pdfDoc.save().then(function (pdfWithPlaceholderBytes) {
            // And finally sign the document.
            signpdf
                .sign(pdfWithPlaceholderBytes, signer)
                .then(function (signedPdf) {
                    // signedPdf is a Buffer of an electronically signed PDF. Store it.
                    var targetPath = path.join(__dirname, '/../output/sample-payslip-signed.pdf');
                    fs.writeFileSync(targetPath, signedPdf);
                    console.log('Sample payslip has been successfully signed and saved as sample-payslip-signed.pdf');
                })
                .catch(function (error) {
                    console.error('Error signing PDF:', error);
                });
        })
        .catch(function (error) {
            console.error('Error adding placeholder:', error);
        });
    })
    .catch(function (error) {
        console.error('Error loading PDF:', error);
    });
}

work();

