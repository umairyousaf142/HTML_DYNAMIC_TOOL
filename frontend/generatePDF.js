function generatePDF() {
    console.log('generate PDF function called');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica");

    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // First Page: Title, Score, Identifier, and Feedback Box
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Testimonial Readiness Assessment - Physicians (TRA-P)", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Data Output and Assessment Scores", 10, 40);

    const Identifier = document.getElementById("identifier").value;
    doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 50);

    const scoreString = document.getElementById("score").innerText;
    let score = scoreString.split('is')[1];
    
    // Get today's date dynamically
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    
    doc.text(`Assessment Date: ${formattedDate}`, 10, 60);
    doc.text("Your provider's overall testimonial readiness score is:", 10, 70);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text(`${score}`, 130, 70);
    doc.setTextColor(0, 0, 0);
    doc.text(" out of 10", 142, 70);

    doc.setFontSize(14);
    doc.text("Strengths and Weaknesses:", 10, 85);
    const textHeadingWidth = doc.getTextWidth("Strengths and Weaknesses:");
    const startX = 10;
    const startY = 87; // A bit below the text to simulate underlining
    doc.setLineWidth(0.5);
    doc.line(startX, startY, startX + textHeadingWidth, startY); // Draw underline

    // Feedback Box
    html2canvas(document.querySelector("#feedbackBox")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate dimensions to fit the page width
        const feedbackImgWidth = pageWidth - 2 * margin;
        const feedbackImgHeight = imgHeight * (feedbackImgWidth / imgWidth); // Maintain aspect ratio

        doc.addImage(imgData, 'PNG', margin, 90, feedbackImgWidth, feedbackImgHeight);

        // Bar Chart Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Sub-scale-scores (-100 to +100):", 10, 160);
        const textBarWidth = doc.getTextWidth("Sub-scale-scores (-100 to +100):");
        const startXBar = 10;
        const startYBar = 162;
        doc.setLineWidth(0.5);
        doc.line(startXBar, startYBar, startXBar + textBarWidth, startYBar);
        doc.setFont("helvetica");

        // Capture the Bar Chart
        html2canvas(document.querySelector("#chartContainer")).then(canvas => {
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const thresholdHeight = 350; // Increased crop height
            let yPosition = 170; // Start position for the bar chart on the first page
            let remainingHeight = imgHeight;
            let startCropY = 0; // Initial start point for cropping

            // Function to crop and add image to PDF
            const addImageToPDF = (startY, height, yPos, scale = 1) => {
                if (height <= 0) return; // No more content to add

                const croppedCanvas = document.createElement('canvas');
                const croppedCtx = croppedCanvas.getContext('2d');

                croppedCanvas.width = imgWidth;
                croppedCanvas.height = height;

                croppedCtx.drawImage(canvas, 0, startY, imgWidth, height, 0, 0, imgWidth, height);
                const croppedImgData = croppedCanvas.toDataURL("image/png");

                // Calculate dimensions to fit the page width
                const imgWidthScaled = pageWidth - 2 * margin;
                const imgHeightScaled = height * (imgWidthScaled / imgWidth) * scale; // Maintain aspect ratio

                doc.addImage(croppedImgData, 'PNG', margin, yPos, imgWidthScaled, imgHeightScaled);
            };

            // Add the first part of the bar chart to the first page
            const heightToPrint = Math.min(thresholdHeight, remainingHeight);
            addImageToPDF(startCropY, heightToPrint, yPosition, 1.0); // Keep to 1x scale for the first page
            yPosition += heightToPrint;
            remainingHeight -= heightToPrint;
            startCropY += heightToPrint; // Update crop start for the next page

            // Add a new page if needed and start the remaining image
            if (remainingHeight > 0) {
                doc.addPage();
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.text("Testimonial Readiness Assessment - Physicians (TRA-P)", 20, 20);
                doc.setFontSize(14);
                const Identifier = document.getElementById("identifier").value;
        doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 40);
    // Get today's date dynamically
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    
    doc.text(`Assessment Date: ${formattedDate}`, 10, 50);
                doc.setFont("helvetica", "bold");
                doc.text("Sub-scale-continues:", 10, 60);
                doc.setLineWidth(0.5);
                doc.line(10, 62, 10 + doc.getTextWidth("Sub-scale-continues:"), 62);

                yPosition = 70; // Reset Y position for the new page

                // Add the remaining part of the bar chart image with reduced scale to avoid crossing page text
                const addRemainingImage = (startY, yPos) => {
                    const heightToPrint = imgHeight - startY; // Remaining height to the end of the image
                    addImageToPDF(startY, heightToPrint, yPos, 0.7); // Scale slightly smaller for the second page
                };

                addRemainingImage(startCropY, yPosition);
                remainingHeight = 0; // All remaining image has been added
            }

            // Add Third Page: Questions and Answers
            doc.addPage();
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            const title = "Testimonial Readiness Assessment - Physicians (TRA-P)";
            const subtitle = "Questions Answers";
            const titleWidth = doc.getTextWidth(title);
            const subtitleWidth = doc.getTextWidth(subtitle);
            
            // Center Title
            doc.text(title, (pageWidth - titleWidth) / 2, 20);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");

            // Center Subtitle
            doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 40);

            // Capture and Add Image from assessmentForm
            html2canvas(document.querySelector("#assessmentForm")).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                let yPosition = 50; // Start position for assessment form on third page
                let remainingHeight = imgHeight;
                let startCropY = 0; // Initial start point for cropping

                // Function to crop and add image to PDF
                const addImageToPDF = (startY, height) => {
                    if (height <= 0) return; // No more content to add

                    const croppedCanvas = document.createElement('canvas');
                    croppedCanvas.width = imgWidth;
                    croppedCanvas.height = height;

                    const ctx = croppedCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, startY, imgWidth, height, 0, 0, imgWidth, height);
                    const croppedImgData = croppedCanvas.toDataURL("image/png");
                    
                    // Calculate dimensions to fit the page width
                    const formImgWidth = pageWidth - 2 * margin;
                    const formImgHeight = height * (formImgWidth / imgWidth) * 0.8; // Scale height to 80%

                    doc.addImage(croppedImgData, 'PNG', margin, yPosition, formImgWidth, formImgHeight);
                    yPosition += formImgHeight; // Update Y position for the next part
                };

                // Add the first part of the assessment form image to the page
                const thresholdHeight = 1850; // Increased crop height
                const heightToPrint = Math.min(thresholdHeight, remainingHeight);
                addImageToPDF(startCropY, heightToPrint);
                yPosition += heightToPrint;
                remainingHeight -= heightToPrint;
                startCropY += heightToPrint; // Update crop start for the next page

                // Add a new page if needed and start the remaining image
                if (remainingHeight > 0) {
                    doc.addPage();
                    yPosition = 10; // Reset Y position for the new page

                    // Add the remaining part of the assessment form image
                    addImageToPDF(startCropY, remainingHeight);
                    remainingHeight = 0; // All remaining image has been added
                }

                doc.save("assessment.pdf");
            });
        });
    });
}

export{
    generatePDF
}