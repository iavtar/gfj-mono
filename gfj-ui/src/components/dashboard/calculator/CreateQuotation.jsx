import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Close, ArrowDropDown } from "@mui/icons-material";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";

import jsPDF from "jspdf";
import dayjs from "dayjs";
import "jspdf-autotable";
import { Formik, Form, Field } from "formik";
import { useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import HeaderCard from "../../HeaderCard";
import apiClient from "../../../app/axiosConfig";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const purityToPercentMap = {
  22: 92,
  18: 75.5,
  14: 59,
  10: 43,
  9: 38.5,
  Silver: 100,
};

const roundRanges = {
  "0.50-2.30": "(0.5-2.3mm) Natural Diamonds Round",
  "2.40-2.75": "(2.3-2.7mm) Natural Diamonds Round",
  "2.80-3.30": "(2.7-3.3mm) Natural Diamonds Round",
  "Above-3.30": "(Above 3.3mm) Natural Diamonds Round",
};

const baguetteRanges = {
  "1.50-2.10": "(0.5-2.3mm) Natural Diamonds Baguette",
  "2.20-2.60": "(2.3-2.7mm) Natural Diamonds Baguette",
  "2.70-4.00": "(2.7-4.0mm) Natural Diamonds Baguette",
  "Above-4.00": "(Above 4.0mm) Natural Diamonds Baguette",
};

const CreateQuotation = ({
  calculatorData,
  client,
  isEdit,
  quotationDetails,
  quotationTable,
  quotationId,
  parentContentRows,
  parentTotalsSection,
  parentQuotationDetails,
  isChild,
}) => {
  const { id, token } = useSelector((state) => state.user.userDetails || {});
  const [contentRows, setContentRows] = useState([]);
  const [contentStarted, setContentStarted] = useState(false);
  const [showValuesSection, setShowValuesSection] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openClearAll, setOpenClearAll] = useState(false);
  const [profitAndLabour, setProfitAndLabour] = useState();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSave, setShowSave] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const [quotationNumber, setQuotationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [details, setDetails] = useState({
    goldPrice: "0.00",
    goldWastage: client?.goldWastagePercentage?.toFixed(2) || "0.00",
    weight: "0.00",
    diamondSetting: client?.diamondSettingPrice?.toFixed(2) || "0.00",
    profitLabour: client?.profitAndLabourPercentage?.toFixed(2) || "0.00",
    purity: "43",
    roundsRange1: "10.00",
    roundsRange2: "20.00",
    roundsRange3: "20.00",
    roundsRange4: "20.00",
    baguettesRange1: "50.00",
    baguettesRange2: "50.00",
    baguettesRange3: "50.00",
    baguettesRange4: "50.00",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [materials, setMaterials] = useState([]);
  const exportRef = useRef();

  useEffect(() => {
    if (!isEdit) {
      if (materials?.length > 0 && client) {
        const goldMaterial = materials.find(
          (item) => item?.id === 1
        );
        const usdToInr = materials.find(
          (item) => item?.id === 2
        );

        setDetails({
          goldPrice: (goldMaterial?.price / usdToInr?.price)?.toFixed(2) || "0.00",
          goldWastage: client?.goldWastagePercentage?.toFixed(2) || "0.00",
          weight: "15.00",
          diamondSetting: client?.diamondSettingPrice?.toFixed(2) || "0.00",
          profitLabour: client?.profitAndLabourPercentage?.toFixed(2) || "0.00",
          purity: "43",
          roundsRange1: "10.00",
          roundsRange2: "20.00",
          roundsRange3: "20.00",
          roundsRange4: "20.00",
          baguettesRange1: "50.00",
          baguettesRange2: "50.00",
          baguettesRange3: "50.00",
          baguettesRange4: "50.00",
        });
      }
    }
  }, [materials, client, isEdit]);

  useEffect(() => {
    if (isEdit) {
      console.log("Details", quotationDetails);
      setDetails(quotationDetails);
      setShowValuesSection(true);
      setContentRows(quotationTable);
      return;
    }
    const fetchMaterials = async () => {
      try {
        const response = await apiClient.get("/businessAdmin/materials");
        setMaterials(response?.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, [token]);

  const addContentRow = () => {
    if (!contentStarted) setContentStarted(true);
    const newRow = ["", ""];
    setContentRows([...contentRows, newRow]);
  };

  const updateContentCell = (rowIndex, colIndex, value) => {
    const updatedRows = [...contentRows];
    updatedRows[rowIndex][colIndex] = value;
    setContentRows(updatedRows);
  };

  const deleteContentRow = (index) => {
    const updatedRows = contentRows.filter((_, i) => i !== index);
    setContentRows(updatedRows);
  };

  const clearAllEntries = () => {
    setContentRows([]);
    setContentStarted(false);
  };

  const handleCloseValuesSection = () => {
    setOpenWarning(true);
  };

  const handleWarningClose = (confirmed) => {
    setOpenWarning(false);
    if (confirmed) {
      setShowValuesSection(false);
      clearAllEntries();
    }
  };

  const handleStartAddingEntries = (formValues) => {
    const ndrRange = {
      round: {
        "0.50-2.30": formValues?.roundsRange1 || 1,
        "2.40-2.75": formValues?.roundsRange2 || 1,
        "2.80-3.30": formValues?.roundsRange3 || 1,
        "Above-3.30": formValues?.roundsRange4 || 1,
      },
      baguettes: {
        "1.50-2.10": formValues?.baguettesRange1 || 1,
        "2.20-2.60": formValues?.baguettesRange2 || 1,
        "2.70-4.00": formValues?.baguettesRange3 || 1,
        "Above-4.00": formValues?.baguettesRange4 || 1,
      },
    };
    const computedRows = [];

    let currentGoldValue = 0;

    currentGoldValue =
      (((parseFloat(formValues?.goldPrice || 0) / 10) *
        (formValues?.purity || 0)) /
        100) *
      formValues?.weight;
    computedRows.push([
      `Current Pure Gold Price \t [ ($${(parseFloat(formValues?.goldPrice || 0) / 10)} x ${formValues?.weight}g) x ${formValues?.purity}% ] `,
      currentGoldValue?.toFixed(2),
    ]);

    if (isEdit && isChild) {
      currentGoldValue =
        (((parseFloat(parentQuotationDetails?.goldPrice || 0) / 10) *
          (parentQuotationDetails?.purity || 0)) /
          100) *
        parentQuotationDetails?.weight;
    }

    computedRows.push([
      `Gold Wastage \t [ ($${currentGoldValue?.toFixed(2)} x ${formValues?.goldWastage}%) / 100 ] `,
      ((currentGoldValue?.toFixed(2) * formValues?.goldWastage) / 100)?.toFixed(
        2
      ),
    ]);

    // Round CTWs
    Object.entries(roundRanges).forEach(([key, label]) => {
      const weight = calculatorData?.rounds?.[key]?.totalWeight || 0;
      const multiplier = ndrRange?.round?.[key] || 0;
      const res = (weight * multiplier)?.toFixed(2);
      if (res > 0) {
        label = `${label} \t [ ${weight}ctw x $${multiplier} ]`;
        computedRows.push([label, res]);
      }
    });

    // Baguette CTWs
    Object.entries(baguetteRanges).forEach(([key, label]) => {
      const weight = calculatorData?.baguettes?.[key]?.totalWeight || 0;
      const multiplier = ndrRange?.baguettes?.[key] || 0;
      const res = (weight * multiplier)?.toFixed(2);
      if (res > 0) {
        label = `${label} \t [ ${weight}ctw x $${multiplier} ]`;
        computedRows.push([label, res]);
      }
    });

    computedRows.push([
      `Diamond Setting \t [ ${calculatorData?.totalGems} x $${formValues?.diamondSetting} ] `,
      (calculatorData?.totalGems * formValues?.diamondSetting)?.toFixed(2),
    ]);
    computedRows.push([`Cad-Cam Wax`, client?.cadCamWaxPrice?.toFixed(2)]);

    setContentStarted(true);
    setShowValuesSection(true);
    setContentRows(computedRows);
    setDetails(formValues);
  };

  useEffect(() => {
    const sum = contentRows?.reduce((acc, row) => {
      if (row[0] === "Profit & Labour" || row[0] === "Total") return acc;
      const value = parseFloat(row[1]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    setSubtotal(sum?.toFixed(2));
    const profitLabour = sum * (details?.profitLabour / 100);
    setProfitAndLabour(profitLabour?.toFixed(2));
    setTotal((sum + profitLabour)?.toFixed(2));
  }, [contentRows, details]);

  // Helper to generate the PDF and return the jsPDF instance
  const generateQuotationPDF = async (
    details,
    contentRows,
    subtotal,
    profitAndLabour,
    total,
    generateForShipper,
    quotationNumberParam = null
  ) => {
    const doc = new jsPDF();

    // Helper: Load logo as base64
    const getBase64FromImageUrl = (url) =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const base64String = canvas.toDataURL("image/png");
          resolve(base64String);
        };
        img.onerror = reject;
        img.src = url;
      });

    // Try loading logo
    let logoBase64 = "";
    try {
      logoBase64 = await getBase64FromImageUrl("/src/assets/gfj.png");
      if (!logoBase64)
        logoBase64 = await getBase64FromImageUrl("/assets/gfj.png");
    } catch {
      //
    }

    // Add logo (reduced size)
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 14, 8, 18, 18);
    }

    // Title (reduced size)
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("QUOTATION", 190, 18, { align: "right" });

    // Client + Quotation Details
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    // Quotation Info Section (compact)
    const formattedDate = dayjs().format("DD-MM-YYYY");
    const quoteInfo = [
      ["DATE", formattedDate],
      ["QUOTE", quotationNumberParam || quotationNumber],
    ];
    const quoteX = 134;
    const quoteY = 25; // moved up more
    quoteInfo.forEach(([label, value], i) => {
      doc.text(label, quoteX, quoteY + i * 5); // reduced spacing
      doc.text(value, quoteX + 25, quoteY + i * 5);
    });

    // Client Section as Table
    const clientY = 35; // moved up
    const clientKeyLabelMap = {
      clientName: "Client Name",
      businessAddress: "Business Address",
      city: "City",
      state: "State",
      country: "Country",
      zipCode: "Zip Code",
      phoneNumber: "Phone Number",
      email: "Email",
    };

    const clientDetails = client || {};
    const validClientKeys = Object.keys(clientDetails).filter((key) =>
      Object.keys(clientKeyLabelMap).includes(key)
    );

    const clientHeaders = [
      validClientKeys.map((key) => clientKeyLabelMap[key]),
    ];
    const clientBody = [
      validClientKeys.map(
        (key) => clientDetails[key] || `##${key.toUpperCase()}`
      ),
    ];

    doc.autoTable({
      head: clientHeaders,
      body: clientBody,
      startY: clientY,
      styles: { fontSize: 8, halign: "center" }, // reduced font size
      headStyles: { fillColor: [105, 41, 117] },
      margin: { left: 14, right: 14 },
      tableWidth: 182,
    });

    // Calculate client section end position using table height
    const clientSectionEnd = doc.lastAutoTable.finalY + 2; // reduced gap

    const diamondData = [
      ["Diamond Types", "VS2 si1", "VS G-H", "VS D-F", "Lab grown (VVS-VS)", "True VS D-F", "Si2-Si3 regular", "Si1- FG", "VVS D-F (top quality)", "Moissanite"],
      ["Price/ct", "$350/ct", "$400/ct", "$500/ct", "Custom", "$550/ct", "$300/ct", "$450/ct", "$650/ct", "Custom"],
    ];

    doc.autoTable({
      body: diamondData,
      startY: clientSectionEnd, // add extra gap below client section
      styles: { fontSize: 8, halign: "center" },
      bodyStyles: { valign: "middle" },
      columnStyles: {
        0: { fillColor: [105, 41, 117], textColor: 255, fontStyle: "bold" }, // first column purple
      },
      margin: { left: 14, right: 14 },
      tableWidth: 182,
    });

    // update descY so description starts after diamond section
    const diamondSectionEnd = doc.lastAutoTable.finalY + 2; // gap below diamond section

    // DESCRIPTION SECTION (side by side layout)
    const descY = diamondSectionEnd;

    // Description title (purple background)
    doc.setFillColor(105, 41, 117); // #692975
    doc.setTextColor(255, 255, 255);
    doc.rect(14, descY, 40, 6, "F"); // smaller height
    doc.text("DESCRIPTION", 16, descY + 4);

    // Description content (gray background)
    doc.setFillColor(240, 240, 240); // subtle gray
    doc.setTextColor(0, 0, 0);

    const maxWidth = 142; // remaining width after title
    let descEndY = descY + 6; // start after header bar
    if (description && description.trim()) {
      const lineHeight = 5; // reduced spacing
      const descContentLines = description.split("\n");

      descContentLines.forEach((line, i) => {
        // Check if line needs to be wrapped
        if (doc.getTextWidth(line) > maxWidth) {
          // Simple text wrapping - split by words
          const words = line.split(" ");
          let currentLine = "";
          let lineCount = 0;

          words.forEach((word) => {
            const testLine = currentLine + (currentLine ? " " : "") + word;
            if (doc.getTextWidth(testLine) <= maxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                doc.rect(
                  54,
                  descY + lineCount * lineHeight,
                  maxWidth,
                  lineHeight,
                  "F"
                );
                doc.text(currentLine, 56, descY + 4 + lineCount * lineHeight);
                lineCount++;
                currentLine = word;
              } else {
                // Single word too long, truncate
                doc.rect(
                  54,
                  descY + lineCount * lineHeight,
                  maxWidth,
                  lineHeight,
                  "F"
                );
                doc.text(
                  word.substring(0, 20) + "...",
                  56,
                  descY + 4 + lineCount * lineHeight
                );
                lineCount++;
              }
            }
          });

          if (currentLine) {
            doc.rect(
              54,
              descY + lineCount * lineHeight,
              maxWidth,
              lineHeight,
              "F"
            );
            doc.text(currentLine, 56, descY + 4 + lineCount * lineHeight);
            lineCount++;
          }

          descEndY = descY + lineCount * lineHeight;
        } else {
          doc.rect(54, descY + i * lineHeight, maxWidth, lineHeight, "F");
          doc.text(line, 56, descY + 4 + i * lineHeight);
          descEndY = descY + (i + 1) * lineHeight;
        }
      });
    } else {
      // No description, just show empty gray area
      doc.rect(54, descY, maxWidth, 6, "F");
      descEndY = descY + 6;
    }

    //Generic Details
    const genKeyLabelMap = {
      goldPrice: "Gold Price ($)",
      goldWastage: "Gold Wastage (%)",
      weight: "Weight (g)",
      diamondSetting: "Diamond Setting ($)",
      profitLabour: "Profit & Labour (%)",
      purity: "Purity (%)",
    };

    const genDetails = details || {};
    const validKeys = Object.keys(genDetails).filter((key) =>
      Object.keys(genKeyLabelMap).includes(key)
    );

    const genHeaders = [validKeys.map((key) => genKeyLabelMap[key])];
    const genBody = [validKeys.map((key) => genDetails[key])];

    doc.autoTable({
      head: genHeaders,
      body: genBody,
      startY: descEndY + 2, // reduced gap
      styles: { fontSize: 8, halign: "center" }, // reduced font size
      headStyles: { fillColor: [105, 41, 117] },
      margin: { left: 14, right: 14 },
      tableWidth: 182,
    });

    // ✅ Use lastAutoTable.finalY as anchor
    let currentY = doc.lastAutoTable.finalY + 2; // reduced gap

    // --- PRODUCT TABLE (child) ---
    let newcontentRows = contentRows || [];

    const newTotals = [
      [`Subtotal`, subtotal],
      [`Profit & Labour \t [ ${details?.profitLabour}% ]`, profitAndLabour],
      [`TOTAL`, total],
    ];
    newcontentRows = newcontentRows.concat(newTotals);
    doc.autoTable({
      head: [["PRODUCT", "AMOUNT"]],
      body: newcontentRows.map((row) => [
        String(row[0] || ""),
        String("$ " + row[1] || ""),
      ]),
      startY: currentY,
      styles: { fontSize: 9 }, // reduced font size
      headStyles: { fillColor: [105, 41, 117] },
      columnStyles: {
        0: { cellWidth: 145 },
        1: { cellWidth: 37, halign: "left" },
      },
      margin: { left: 14, right: 14 },
      tableWidth: 182,
    });

    currentY = doc.lastAutoTable.finalY + 3; // reduced gap

    // --- ORIGINAL QUOTATION (parent) ---
    if (isEdit && isChild && !generateForShipper) {
      doc.setFillColor(105, 41, 117); // purple
      doc.setTextColor(255, 255, 255);
      doc.rect(14, currentY, 182, 7, "F");
      doc.text("PROPOSED QUOTATION", 16, currentY + 5);
      doc.setTextColor(0, 0, 0);

      // parent generic details
      const genParentDetails = parentQuotationDetails || {};
      const validParentKeys = Object.keys(genParentDetails).filter((key) =>
        Object.keys(genKeyLabelMap).includes(key)
      );

      doc.autoTable({
        head: [validParentKeys.map((key) => genKeyLabelMap[key])],
        body: [validParentKeys.map((key) => genParentDetails[key])],
        startY: currentY + 8, // reduced gap
        styles: { fontSize: 8, halign: "center" }, // reduced font size
        headStyles: { fillColor: [105, 41, 117] },
        margin: { left: 14, right: 14 },
        tableWidth: 182,
      });

      currentY = doc.lastAutoTable.finalY + 2; // reduced gap

      // parent product table
      const newParentContentRows = parentContentRows || [];
      const newParentTotals = [
        ["Subtotal", parentTotalsSection?.subtotal],
        [
          `Profit & Labour \t [ ${parentQuotationDetails?.profitLabour}% ]`,
          parentTotalsSection?.profitAndLabour,
        ],
        ["TOTAL", parentTotalsSection?.total],
      ];
      newParentContentRows.push(...newParentTotals);
      doc.autoTable({
        head: [["PRODUCT", "AMOUNT"]],
        body: newParentContentRows.map((row) => [
          String(row[0] || ""),
          String("$ " + row[1] || ""),
        ]),
        startY: currentY,
        styles: { fontSize: 9 }, // reduced font size
        headStyles: { fillColor: [105, 41, 117] },
        columnStyles: {
          0: { cellWidth: 145 },
          1: { cellWidth: 37, halign: "left" },
        },
        margin: { left: 14, right: 14 },
        tableWidth: 182,
      });

      currentY = doc.lastAutoTable.finalY + 6; // reduced gap
    }

    // Contact section (compact, one line)
    doc.setFont(undefined, "italic");
    doc.setFontSize(9); // smaller font
    doc.text(
      "Contact Us: Email: admin@gemsfromjaipur.com | Phone: +91-9828882226",
      14,
      currentY + 8
    );

    // Thank you message (separate line)
    doc.setFont(undefined, "bolditalic");
    doc.text("Thank You For Your Business!", 14, currentY + 15);
    return doc;
  };

  const handleSaveQuotation = async () => {
    // Validate description field
    if (!description || description.trim() === "") {
      setDescriptionError("Description is required");
      toast.error("Please enter a quotation description");
      return;
    }

    // Clear any previous error
    setDescriptionError("");

    setIsSaving(true);
    try {
      const data = {
        quotationTable: contentRows,
        quotationDetails: details,
        client: client,
        description: description,
        contentRows: contentRows,
        calculatorData: calculatorData,
        totalsSection: { subtotal, profitAndLabour, total },
      };

      let requestBody = {
        data: JSON.stringify(data),
        price: total,
        agentId: id,
        clientId: client?.id,
        quotationStatus: "new",
        description: description,
      };

      let response;
      if (isEdit) {
        const { quotationStatus, ...rest } = requestBody;
        requestBody = {
          ...rest,
        };
        if (isChild) {
          requestBody.finalQuotationId = quotationId;
          response = await apiClient.post(
            `/agent/updateFinalQuotation`,
            requestBody,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          requestBody.quotationId = quotationId;
          response = await apiClient.post(
            `/agent/updateQuotation`,
            requestBody,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } else {
        response = await apiClient.post(`/agent/createQuotation`, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      if (response?.status === 200) {
        if (isChild) {
          setQuotationNumber(quotationId);
          uploadImage(quotationId, false);
          // uploadImage(quotationId, true);
          toast.success(`Quotation Saved Successfully!`);
        } else {
          const newQuotationNumber = response?.data?.quotationId || quotationId;
          setQuotationNumber(newQuotationNumber);
          uploadImage(newQuotationNumber);
          toast.success(`Quotation Saved Successfully!`);
        }
      } else {
        toast.error("Error While Saving Quotation!");
      }
    } catch (error) {
      console.error("Error Saving Quotation", error);
      toast.error("Error While Saving Quotation!");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async (generateForShipper) => {
    const doc = await generateQuotationPDF(
      details,
      contentRows,
      subtotal,
      profitAndLabour,
      total,
      generateForShipper
    );
    doc.save(`${client?.clientName}_quotation_${Date.now()}.pdf`);
  };

  const downloadImage = async (generateForShipper) => {
    const doc = await generateQuotationPDF(
      details,
      contentRows,
      subtotal,
      profitAndLabour,
      total,
      generateForShipper
    );
    const pdfBlob = doc.output("blob");
    const reader = new FileReader();
    reader.onload = async function (e) {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const link = document.createElement("a");
      link.download = `${client?.clientName}_quotation_${Date.now()}.jpeg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    };
    reader.readAsArrayBuffer(pdfBlob);
  };

  const uploadImage = async (quotationId, generateForShipper) => {
    try {
      const doc = await generateQuotationPDF(
        details,
        contentRows,
        subtotal,
        profitAndLabour,
        total,
        generateForShipper,
        quotationId
      );
      const pdfBlob = doc.output("blob");

      const reader = new FileReader();

      reader.onload = async function (e) {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error("Failed to convert canvas to blob.");
            return;
          }

          const formData = new FormData();
          formData.append(
            "file",
            blob,
            `${client?.clientName}_quotation_${Date.now()}.jpeg`
          );

          try {
            let response;
            if (isChild) {
              response = await apiClient.post(
                `/agent/finalQuotation/upload?quotationId=${quotationId}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
            } else {
              response = await apiClient.post(
                `/agent/quotation/upload?quotationId=${quotationId}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
            }

            if (response?.status === 200) {
              setImageUrl(response?.data);
            } else {
              toast.error("Failed to upload quotation image.");
              throw new Error("Upload failed");
            }
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.error("Failed to upload image.");
          }
        }, "image/jpeg");
      };

      reader.readAsArrayBuffer(pdfBlob);
      setShowSave(false);
    } catch (err) {
      console.error("Error generating or uploading image:", err);
    }
  };

  const sendImageToWhatsApp = async () => {
    try {
      if (!imageUrl) {
        toast.error(
          "Please save the quotation first to generate the image URL."
        );
        return;
      }
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Here's your quotation: ${imageUrl}`
      )}`;
      window.open(whatsappUrl, "_blank");
      toast.success("WhatsApp link opened!");
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      toast.error("Failed to open WhatsApp link.");
    }
  };

  const baguetteFields = [
    { label: "0.50-2.30", name: "baguettesRange1" },
    { label: "2.80-3.30", name: "baguettesRange2" },
    { label: "2.40-2.75", name: "baguettesRange3" },
    { label: "Above-3.30", name: "baguettesRange4" },
  ];

  const roundFields = [
    { label: "0.50-2.30", name: "roundsRange1" },
    { label: "2.80-3.30", name: "roundsRange2" },
    { label: "2.40-2.75", name: "roundsRange3" },
    { label: "Above-3.30", name: "roundsRange4" },
  ];

  const totals = [
    { label: "Sub Total", value: subtotal },
    { label: "Profit and Labour", value: profitAndLabour },
    { label: "Total", value: total },
  ];

  // useEffect(() => {
  //   console.log("Calculator Data", calculatorData);
  // }, [calculatorData]);

  return (
    <Box className="bg-white h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <HeaderCard
          icon="📒"
          title={`${isEdit ? "Edit" : "Create"} Quotation`}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Details Section */}
        <Fade in={true} timeout={300}>
          <Box className="mb-5 p-6 bg-white rounded shadow-md">
            <Typography variant="h5" className="text-[#4c257e] font-bold pb-10">
              Configure Quotation
            </Typography>
            <Formik
              initialValues={details}
              onSubmit={(values) => {
                setDetails(values);
              }}
              enableReinitialize
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      marginBottom: 24,
                    }}
                  >
                    <Typography
                      variant="h7"
                      className="text-[#4c257e] font-bold pb-5 w-[180px]"
                    >
                      Generic Details
                    </Typography>
                    <TextField
                      label="Current Gold Price"
                      name="goldPrice"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={values?.goldPrice}
                      onChange={(e) =>
                        setFieldValue("goldPrice", e.target.value)
                      }
                      sx={{ width: 180 }}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Gold Wastage"
                      name="goldWastage"
                      type="number"
                      value={values?.goldWastage}
                      onChange={(e) => {
                        let val = Math.max(
                          1,
                          Math.min(15, Number(e.target.value))
                        );
                        setFieldValue("goldWastage", val);
                      }}
                      inputProps={{ min: 1, max: 15, step: 0.01 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      sx={{ width: 180 }}
                      size="small"
                    />
                    <TextField
                      label="Weight"
                      name="weight"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={values?.weight}
                      onChange={(e) => setFieldValue("weight", e.target.value)}
                      sx={{ width: 180 }}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">g</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Diamond Setting (Per Stone)"
                      name="diamondSetting"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={values?.diamondSetting}
                      onChange={(e) =>
                        setFieldValue("diamondSetting", e.target.value)
                      }
                      sx={{ width: 180 }}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                    <TextField
                      label="Profit & Labour"
                      name="profitLabour"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={values?.profitLabour}
                      onChange={(e) =>
                        setFieldValue("profitLabour", e.target.value)
                      }
                      sx={{ width: 150 }}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      select
                      label="Purity"
                      name="purity"
                      value={values?.purity}
                      onChange={(e) =>
                        setFieldValue("purity", e?.target?.value)
                      }
                      sx={{ width: 180 }}
                      size="small"
                      SelectProps={{
                        IconComponent: () => null, // Hide the default dropdown icon
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ gap: 0.5 }}>
                            <ArrowDropDown sx={{ pointerEvents: "none" }} />K
                          </InputAdornment>
                        ),
                      }}
                    >
                      {Object.entries(purityToPercentMap).map(
                        ([label, value]) => (
                          <MenuItem key={label} value={value}>
                            {label}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      marginBottom: 24,
                    }}
                  >
                    <Typography
                      variant="h7"
                      className="text-[#4c257e] font-bold pb-5 w-[180px]"
                    >
                      CTW for Rounds
                    </Typography>

                    {roundFields.map((field) => (
                      <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={values?.[field.name]}
                        onChange={(e) =>
                          setFieldValue(field.name, e.target.value)
                        }
                        sx={{ width: 180 }}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      marginBottom: 24,
                    }}
                  >
                    <Typography
                      variant="h7"
                      className="text-[#4c257e] font-bold pb-5 w-[180px]"
                    >
                      CTW for Baguettes
                    </Typography>

                    {baguetteFields.map((field) => (
                      <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={values?.[field.name]}
                        onChange={(e) =>
                          setFieldValue(field.name, e.target.value)
                        }
                        sx={{ width: 180 }}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={() => handleStartAddingEntries(values)}
                      variant="contained"
                      className="!bg-[var(--brand-purple)] font-semibold hover:!bg-[var(--brand-dark-purple)] transition-all"
                    >
                      {!showValuesSection ? (
                        <Typography>Create Quotation</Typography>
                      ) : (
                        <Typography>Update Quotation</Typography>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </Fade>

        {/* Values Section */}
        <Fade in={showValuesSection} timeout={300}>
          <Box className="mb-5 p-6 bg-white rounded shadow-md" ref={exportRef}>
            <Box className="flex justify-between items-center gap-2">
              <Typography
                variant="h5"
                className="text-[#4c257e] font-bold pb-10"
              >
                Manage Entries
              </Typography>
              <IconButton
                size="small"
                onClick={handleCloseValuesSection}
                style={{ marginTop: "-30px" }}
              >
                <Close />
              </IconButton>
            </Box>

            {contentRows?.length > 0 ? (
              <Table
                sx={{ minWidth: 650, border: 1, borderColor: "grey.400" }}
                aria-label="quotation table"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      borderBottom: 1,
                      borderColor: "grey.400",
                      height: 45,
                    }}
                  >
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.400",
                        py: 0.5,
                        minHeight: 24,
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      Product
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.400",
                        py: 0.5,
                        minHeight: 24,
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      <TextField
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          // Clear error when user starts typing
                          if (descriptionError) {
                            setDescriptionError("");
                          }
                        }}
                        placeholder="Enter quotation description..."
                        multiline
                        error={!!descriptionError}
                        helperText={descriptionError}
                        // rows={2}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white",
                            },
                            "&:hover fieldset": {
                              borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "white",
                            },
                            minHeight: 24,
                            fontWeight: 700,
                            fontSize: "16px",
                          },
                          "& .MuiInputBase-input": {
                            py: 0.5,
                            fontSize: "16px",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.400",
                        py: 0.5,
                        minHeight: 24,
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contentRows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        borderBottom: 1,
                        borderColor: "grey.400",
                        height: 36,
                      }}
                    >
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "grey.400",
                          py: 0.5,
                          minHeight: 24,
                        }}
                      >
                        <TextField
                          value={row[0]}
                          onChange={(e) =>
                            updateContentCell(rowIndex, 0, e.target.value)
                          }
                          type="text"
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "white",
                              },
                              "&:hover fieldset": {
                                borderColor: "white",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "white",
                              },
                              minHeight: 24,
                              fontSize: 14,
                            },
                            "& .MuiInputBase-input": {
                              py: 0.5,
                              fontSize: 14,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "grey.400",
                          py: 0.5,
                          minHeight: 24,
                        }}
                      >
                        <TextField
                          value={row[1]}
                          onChange={(e) =>
                            updateContentCell(rowIndex, 1, e.target.value)
                          }
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "white",
                              },
                              "&:hover fieldset": {
                                borderColor: "white",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "white",
                              },
                              minHeight: 24,
                              fontSize: 14,
                            },
                            "& .MuiInputBase-input": {
                              py: 0.5,
                              fontSize: 14,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderColor: "grey.400",
                          py: 0.5,
                          minHeight: 24,
                          width: "231px",
                        }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => deleteContentRow(rowIndex)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {totals.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderBottom: 1,
                        borderColor: "grey.400",
                        height: 36,
                      }}
                    >
                      <TableCell
                        sx={{
                          paddingLeft: 4,
                          borderRight: 1,
                          borderColor: "grey.400",
                          py: 0.5,
                          minHeight: 24,
                          fontWeight: 700,
                          fontSize: "15px",
                        }}
                      >
                        {item.label}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: "grey.400",
                          borderRight: "1px solid white",
                          py: 0.5,
                          minHeight: 24,
                        }}
                      >
                        <TextField
                          value={item?.value}
                          type="number"
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "white",
                              },
                              "&:hover fieldset": {
                                borderColor: "white",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "white",
                              },
                              minHeight: 24,
                              fontSize: 14,
                            },
                            "& .MuiInputBase-input": {
                              py: 0.5,
                              fontSize: 14,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderColor: "grey.400",
                          py: 0.5,
                          minHeight: 24,
                          width: "231px",
                        }}
                      >
                        {/* Empty cell for alignment */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography className="text-gray-500 italic mb-2">
                No entries yet
              </Typography>
            )}
            {contentRows?.length > 0 && (
              <Box className="flex justify-end w-full">
                <Box></Box>
              </Box>
            )}

            {/* Buttons */}
            <Box className="flex justify-between items-center mt-6 gap-2">
              <Box className="flex gap-2">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  className="!bg-[var(--brand-purple)] font-semibold hover:!bg-[var(--brand-dark-purple)] transition-all"
                  onClick={addContentRow}
                >
                  Add Entry
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpenClearAll(true)}
                  disabled={contentRows?.length === 0}
                >
                  Clear All
                </Button>
              </Box>
              {contentRows?.length > 0 && (
                <Box className="flex justify-between items-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    onClick={sendImageToWhatsApp}
                    className="whatsapp-btn"
                  >
                    <FaWhatsapp
                      size={35}
                      color="#25D366"
                      className="whatsapp-icon"
                    />
                  </Button>
                  <Box>
                    {showSave ? (
                      <Button
                        variant="contained"
                        className="!bg-[var(--brand-purple)] font-semibold hover:!bg-[var(--brand-dark-purple)] transition-all"
                        onClick={handleSaveQuotation}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : (
                          <Typography variant="button" className="text-white">
                            Save
                          </Typography>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          className="!bg-[var(--brand-purple)] font-semibold hover:!bg-[var(--brand-dark-purple)] transition-all"
                          onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                          Download
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => setAnchorEl(null)}
                        >
                          <MenuItem
                            onClick={() => {
                              setAnchorEl(null);
                              downloadPDF(false);
                            }}
                          >
                            Download as PDF
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setAnchorEl(null);
                              downloadImage(false);
                            }}
                          >
                            Download as Image
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
            {/* Warning Dialog */}
            <Dialog
              open={openWarning}
              onClose={() => handleWarningClose(false)}
            >
              <DialogTitle>Clear and Close Manage Entries?</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This will clear all entries and close the Manage Entries
                  section. Are you sure you want to proceed?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => handleWarningClose(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleWarningClose(true)}
                  color="error"
                  autoFocus
                >
                  Yes, Clear & Close
                </Button>
              </DialogActions>
            </Dialog>
            {/* Clear All Dialog */}
            <Dialog open={openClearAll} onClose={() => setOpenClearAll(false)}>
              <DialogTitle>Clear All Entries?</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This will remove all entries. Are you sure you want to
                  proceed?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenClearAll(false)} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    clearAllEntries();
                    setOpenClearAll(false);
                  }}
                  color="error"
                  autoFocus
                >
                  Yes, Clear All
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Fade>
      </div>
    </Box>
  );
};

export default CreateQuotation;

const style = document.createElement("style");
style.innerHTML = `
.whatsapp-btn .whatsapp-icon {
  transition: transform 0.2s;
}
.whatsapp-btn:hover .whatsapp-icon {
  transform: scale(1.2857); /* 35 -> 45 */
}
`;
document.head.appendChild(style);
