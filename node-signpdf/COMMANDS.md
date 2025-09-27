# Quick Command Reference

## 🚀 Essential Commands

### Setup
```bash
# Install dependencies
yarn install

# Create output directory
mkdir -p packages/examples/output
```

### Basic PDF Signing

#### 1. Sign PDF with existing placeholders
```bash
cd packages/examples
node src/with-placeholder.js
```

#### 2. Sign regular PDF (adds placeholders first)
```bash
cd packages/examples
node src/sign-payslip.js
```

#### 3. Create and sign sample payslip
```bash
# Create sample payslip
cd packages/examples
node src/create-payslip.js

# Sign the sample payslip
node src/sign-sample-payslip.js
```

### Additional Examples
```bash
# PDF-lib example
node src/pdf-lib.js

# JavaScript example
node src/javascript.js

# TypeScript example
yarn ts
```

## 📁 File Locations

### Input Files
- `resources/with-placeholder.pdf` - PDF with signature placeholders
- `resources/Payslip.pdf` - Original payslip (encrypted)
- `resources/sample-payslip.pdf` - Generated sample payslip
- `resources/certificate.p12` - Signing certificate

### Output Files
- `output/with-placeholder-signed.pdf` - Signed PDF with placeholders
- `output/payslip-signed.pdf` - Signed original payslip
- `output/sample-payslip-signed.pdf` - Signed sample payslip

## 🔧 Troubleshooting Commands

### Fix Common Issues
```bash
# Install missing dependencies
yarn add pdf-lib @signpdf/placeholder-pdf-lib pdfkit

# Create missing output directory
mkdir -p packages/examples/output

# Check output files
ls -la packages/examples/output/
```

### Verify Files
```bash
# Check if files exist
ls -la resources/
ls -la packages/examples/output/

# Check file sizes
du -h packages/examples/output/*
```

## 🛠️ Development Commands

### Create New Script
```bash
# Copy template
cp src/sign-payslip.js src/your-new-script.js

# Edit the script
# Run the script
node src/your-new-script.js
```

### Test All Scripts
```bash
# Test placeholder signing
node src/with-placeholder.js

# Test regular PDF signing
node src/sign-payslip.js

# Test sample payslip creation and signing
node src/create-payslip.js
node src/sign-sample-payslip.js
```

## 📊 Output Verification

```bash
# Check all output files
ls -la packages/examples/output/

# Expected output:
# -rw-r--r-- with-placeholder-signed.pdf
# -rw-r--r-- payslip-signed.pdf  
# -rw-r--r-- sample-payslip-signed.pdf
```

## 🔐 Certificate Commands

```bash
# Check certificate exists
ls -la resources/certificate.p12

# Verify certificate format
file resources/certificate.p12
```

## 📝 Quick Workflow

```bash
# Complete workflow: Create → Sign → Verify
cd packages/examples

# 1. Create sample payslip
node src/create-payslip.js

# 2. Sign the payslip
node src/sign-sample-payslip.js

# 3. Verify output
ls -la output/
```

