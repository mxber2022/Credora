# Node SignPDF - Digital PDF Signing

A comprehensive Node.js library for digitally signing PDF documents with support for adding signature placeholders to regular PDFs.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 12
- Yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd node-signpdf

# Install dependencies
yarn install
```

## 📋 Available Examples

### 1. Sign PDF with Existing Placeholders
For PDFs that already have signature placeholders (like `with-placeholder.pdf`):

```bash
cd packages/examples
node src/with-placeholder.js
```

**Output**: `output/with-placeholder-signed.pdf`

### 2. Sign Regular PDF (Add Placeholders First)
For regular PDFs that need signature placeholders added:

```bash
cd packages/examples
node src/sign-payslip.js
```

**Output**: `output/payslip-signed.pdf`

### 3. Create and Sign Sample Payslip
Generate a sample payslip and sign it:

```bash
# Step 1: Create sample payslip
cd packages/examples
node src/create-payslip.js

# Step 2: Sign the sample payslip
node src/sign-sample-payslip.js
```

**Outputs**: 
- `resources/sample-payslip.pdf` (original)
- `output/sample-payslip-signed.pdf` (signed)

## 🔧 Scripts Overview

### Core Scripts

| Script | Purpose | Input | Output |
|--------|---------|-------|--------|
| `with-placeholder.js` | Sign PDF with existing placeholders | `resources/with-placeholder.pdf` | `output/with-placeholder-signed.pdf` |
| `sign-payslip.js` | Add placeholders and sign regular PDF | `resources/Payslip.pdf` | `output/payslip-signed.pdf` |
| `create-payslip.js` | Generate sample payslip PDF | - | `resources/sample-payslip.pdf` |
| `sign-sample-payslip.js` | Sign the generated sample payslip | `resources/sample-payslip.pdf` | `output/sample-payslip-signed.pdf` |

### Additional Examples

```bash
# Sign using PDF-lib (for regular PDFs)
node src/pdf-lib.js

# JavaScript example
node src/javascript.js

# TypeScript example
yarn ts

# Demo all available scripts
node src/demo-all.js
```

## 📁 File Structure

```
node-signpdf/
├── packages/
│   ├── examples/
│   │   ├── src/
│   │   │   ├── with-placeholder.js      # Sign PDF with placeholders
│   │   │   ├── sign-payslip.js          # Sign regular PDF
│   │   │   ├── create-payslip.js        # Generate sample payslip
│   │   │   ├── sign-sample-payslip.js  # Sign sample payslip
│   │   │   └── pdf-lib.js               # PDF-lib example
│   │   └── output/                      # Signed PDF outputs
│   └── signpdf/                         # Core signing library
├── resources/
│   ├── certificate.p12                  # Signing certificate
│   ├── with-placeholder.pdf            # PDF with signature placeholders
│   ├── Payslip.pdf                     # Original payslip (encrypted)
│   └── sample-payslip.pdf              # Generated sample payslip
└── README.md
```

## 🔐 Certificate Setup

The signing process requires a P12 certificate file:

- **Location**: `resources/certificate.p12`
- **Format**: PKCS#12 certificate
- **Usage**: Used for digital signature creation

## 📝 Creating Custom PDFs

### Generate Sample Payslip
```bash
cd packages/examples
node src/create-payslip.js
```

This creates a professional payslip with:
- Company header
- Employee information
- Pay details and calculations
- Deductions breakdown
- Net pay calculation
- Signature line

### Customize Payslip Content
Edit `src/create-payslip.js` to modify:
- Company information
- Employee details
- Pay calculations
- Styling and layout

## 🔍 Troubleshooting

### Common Issues

1. **"No ByteRangeStrings found" Error**
   ```bash
   # Solution: Use placeholder-adding approach
   node src/sign-payslip.js  # Instead of with-placeholder.js
   ```

2. **"PDF is encrypted" Error**
   ```bash
   # Solution: Add ignoreEncryption option
   PDFDocument.load(pdfBuffer, { ignoreEncryption: true })
   ```

3. **Missing Dependencies**
   ```bash
   # Install required packages
   yarn add pdf-lib @signpdf/placeholder-pdf-lib pdfkit
   ```

4. **Output Directory Missing**
   ```bash
   # Create output directory
   mkdir -p packages/examples/output
   ```

## 🛠️ Development

### Adding New Signing Scripts

1. **Create script file**:
   ```javascript
   var fs = require('fs');
   var path = require('path');
   var PDFDocument = require('pdf-lib').PDFDocument;
   var pdflibAddPlaceholder = require('@signpdf/placeholder-pdf-lib').pdflibAddPlaceholder;
   var signpdf = require('@signpdf/signpdf').default;
   var P12Signer = require('@signpdf/signer-p12').P12Signer;
   
   // Your signing logic here
   ```

2. **Run the script**:
   ```bash
   node src/your-script.js
   ```

### Customizing Signature Details

```javascript
pdflibAddPlaceholder({
    pdfDoc: pdfDoc,
    reason: 'Your custom reason',
    contactInfo: 'your-email@company.com',
    name: 'Your Name',
    location: 'Your Location',
});
```

## 📊 Output Files

After running the scripts, check the `output/` directory:

```bash
ls -la packages/examples/output/
```

Expected files:
- `with-placeholder-signed.pdf` - Signed PDF with existing placeholders
- `payslip-signed.pdf` - Signed original payslip
- `sample-payslip-signed.pdf` - Signed generated payslip

## 🔒 Security Notes

- Keep your P12 certificate secure
- Don't commit certificate files to version control
- Use proper certificate management in production
- Verify signature validity in PDF viewers

## 📚 Additional Resources

- [PDF Digital Signatures Documentation](https://github.com/vbuch/node-signpdf)
- [PDF-lib Documentation](https://pdf-lib.js.org/)
- [PDFKit Documentation](https://pdfkit.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.