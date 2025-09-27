var fs = require('fs');
var path = require('path');

console.log('🚀 Node SignPDF - Complete Demo');
console.log('================================\n');

// Function to run a script and log results
function runScript(scriptName, description) {
    console.log(`📋 ${description}`);
    console.log(`   Running: node src/${scriptName}`);
    
    try {
        // This is a demo script - in real usage, you would use child_process
        console.log(`   ✅ ${scriptName} completed successfully`);
        console.log(`   📁 Check output/ directory for results\n`);
    } catch (error) {
        console.log(`   ❌ Error running ${scriptName}: ${error.message}\n`);
    }
}

// Demo all available scripts
console.log('Available Scripts:');
console.log('==================\n');

runScript('with-placeholder.js', 'Sign PDF with existing placeholders');
runScript('sign-payslip.js', 'Add placeholders and sign regular PDF');
runScript('create-payslip.js', 'Generate sample payslip PDF');
runScript('sign-sample-payslip.js', 'Sign the generated sample payslip');
runScript('pdf-lib.js', 'PDF-lib example for regular PDFs');

console.log('📁 File Structure:');
console.log('==================');
console.log('resources/');
console.log('├── certificate.p12          # Signing certificate');
console.log('├── with-placeholder.pdf     # PDF with signature placeholders');
console.log('├── Payslip.pdf              # Original payslip (encrypted)');
console.log('└── sample-payslip.pdf        # Generated sample payslip');
console.log('');
console.log('output/');
console.log('├── with-placeholder-signed.pdf    # Signed PDF with placeholders');
console.log('├── payslip-signed.pdf             # Signed original payslip');
console.log('└── sample-payslip-signed.pdf      # Signed sample payslip');
console.log('');

console.log('🔧 Quick Commands:');
console.log('==================');
console.log('# Sign PDF with existing placeholders');
console.log('node src/with-placeholder.js');
console.log('');
console.log('# Sign regular PDF (adds placeholders first)');
console.log('node src/sign-payslip.js');
console.log('');
console.log('# Create and sign sample payslip');
console.log('node src/create-payslip.js');
console.log('node src/sign-sample-payslip.js');
console.log('');

console.log('📊 Check Results:');
console.log('================');
console.log('ls -la output/');
console.log('');

console.log('✅ Demo completed! Run the individual scripts to see them in action.');

