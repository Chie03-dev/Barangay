/**
 * Document Generator for Barangay
 *
 * Generates exportable, official-looking documents (PDF + DOCX) for the
 * barangay resident portal. Supports: Barangay Clearance, Certificate of
 * Indigency, Certificate of Residency, Barangay Business Permit.
 *
 * Uses pdfmake for PDF and docx for Word.
 */

import { Document, StyleSheet, Text, Paragraph } from "pdfmake";
import {
  Document as DocxDocument,
  Packer,
  Paragraph as DocxParagraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  PageOrientation,
} from "docx";

/* ============================================================ */
/*  Types                                                     */
/* ============================================================ */

export type DocumentType = "clearance" | "indigency" | "residency" | "business";

export type Format = "pdf" | "docx";

export type DocumentData = {
  reference: string;
  type: DocumentType;
  residentName: string;
  residentAddress: string;
  residentId?: string;
  issuedDate: string;
  validUntil?: string;
  purpose?: string;
  businessName?: string;
  businessAddress?: string;
  ownerName?: string;
  remarks?: string;
  officialName?: string;
  officialRole?: string;
  window?: string;
  hasId: boolean;
};

/* ============================================================ */
/*  Shared branding tokens (match the portal's design system) */
/* ============================================================ */

const pdfmake = require("pdfmake") as typeof import("pdfmake");
const pm = pdfmake.default ?? pdfmake;

/* ============================================================ */
/*  Helper builders                                           */
/* ============================================================ */

/** Simple paragraph with a thin bottom border (used for signature lines). */
function lineParagraph(text: string, options: Record<string, unknown> = {}) {
  return new Paragraph({
    ...options,
    border: { bottom: { color: "#94a3b8", width: 0.5 } },
    margin: [0, 2, 0, 6],
    children: [new Text({ text, font: "Helvetica", size: 9, color: "#64748b" })],
  });
}

/** Divider line paragraph (used between sections). */
function divider() {
  return new Paragraph({
    margin: [0, 6, 0, 6],
    border: { bottom: { color: "#cbd5e1", width: 0.5 } },
    children: [new Text({ text: "", fontSize: 2 })],
  });
}

/** Agency header block rendered at the top of every document. */
function headerBlock() {
  return [
    new Paragraph({
      alignment: "center",
      margin: [0, 0, 0, 6],
      children: [new Text({ text: "BARANGAY HALL", font: "Helvetica-Bold", fontSize: 13, color: "#1e293b", letterSpacing: 2 })],
    }),
    new Paragraph({
      alignment: "center",
      margin: [0, 0, 0, 2],
      children: [new Text({ text: "Barangay Main Avenue, Purok 3", font: "Helvetica", fontSize: 8, color: "#64748b" })],
    }),
    new Paragraph({
      alignment: "center",
      margin: [0, 0, 0, 10],
      children: [new Text({ text: "Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", font: "Helvetica", fontSize: 7, color: "#94a3b8" })],
    }),
    divider(),
  ];
}

/* ============================================================ */
/*  PDF TEMPLATES (pdfmake)                                   */
/* ============================================================ */

function buildClearancePdf(data: DocumentData) {
  const { residentName, residentAddress, issuedDate, validUntil, purpose, reference } = data;

  return {
    content: [
      ...headerBlock(),
      new Paragraph({ alignment: "center", margin: [0, 8, 0, 14], children: [new Text({ text: "BARANGAY CLEARANCE", font: "Helvetica-Bold", fontSize: 18, color: "#1e293b" })] }),
      new Paragraph({ alignment: "center", margin: [0, 0, 0, 10], children: [new Text({ text: "I hereby certify to whom it may concern that the bearer of this document is a resident of this barangay.", font: "Helvetica", fontSize: 10, color: "#334155" })] }),
      divider(),
      new Paragraph({ margin: [0, 4, 0, 8], children: [new Text({ text: "Name: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentName, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Address: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentAddress, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Resident ID: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: data.residentId ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Purpose: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: purpose ?? "N/A", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Valid Until: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: validUntil ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Reference No.: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: reference, font: "Helvetica", fontSize: 10 })] }),
      divider(),
      lineParagraph("_______________________________"),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Barangay Secretary", font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
      new Paragraph({ margin: [0, 0, 0, 6], children: [new Text({ text: "Barangay Hall", font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
      new Paragraph({ margin: [0, 0, 0, 10], children: [new Text({ text: `Issued on ${issuedDate}`, font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
    ],
    styles: { header: { fontSize: 18, bold: true, color: "#1e293b", alignment: "center" }, body: { fontSize: 10, color: "#334155" }, center: { alignment: "center" } },
  };
}

function buildIndigencyPdf(data: DocumentData) {
  const { residentName, residentAddress, issuedDate, reference } = data;

  return {
    content: [
      ...headerBlock(),
      new Paragraph({ alignment: "center", margin: [0, 8, 0, 14], children: [new Text({ text: "CERTIFICATE OF INDIGENCY", font: "Helvetica-Bold", fontSize: 17, color: "#1e293b" })] }),
      new Paragraph({ alignment: "center", margin: [0, 0, 0, 10], children: [new Text({ text: "I hereby certify that the person named below is indigent / has very limited income and is unable to meet the basic needs of life.", font: "Helvetica", fontSize: 10, color: "#334155" })] }),
      divider(),
      new Paragraph({ margin: [0, 4, 0, 8], children: [new Text({ text: "Name: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentName, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Address: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentAddress, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Resident ID: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: data.residentId ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Reference No.: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: reference, font: "Helvetica", fontSize: 10 })] }),
      divider(),
      lineParagraph("_______________________________"),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Barangay Secretary", font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
      new Paragraph({ margin: [0, 0, 0, 10], children: [new Text({ text: `Issued on ${issuedDate}`, font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
    ],
    styles: { header: { fontSize: 17, bold: true, color: "#1e293b", alignment: "center" }, body: { fontSize: 10, color: "#334155" }, center: { alignment: "center" } },
  };
}

function buildResidencyPdf(data: DocumentData) {
  const { residentName, residentAddress, issuedDate, validUntil, reference } = data;

  return {
    content: [
      ...headerBlock(),
      new Paragraph({ alignment: "center", margin: [0, 8, 0, 14], children: [new Text({ text: "CERTIFICATE OF RESIDENCY", font: "Helvetica-Bold", fontSize: 18, color: "#1e293b" })] }),
      new Paragraph({ alignment: "center", margin: [0, 0, 0, 10], children: [new Text({ text: "I hereby certify that the person named below is a resident of this barangay and has been residing within the jurisdiction for a period of time.", font: "Helvetica", fontSize: 10, color: "#334155" })] }),
      divider(),
      new Paragraph({ margin: [0, 4, 0, 8], children: [new Text({ text: "Name: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentName, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Address: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentAddress, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Resident ID: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: data.residentId ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Reference No.: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: reference, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Valid Until: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: validUntil ?? "—", font: "Helvetica", fontSize: 10 })] }),
      divider(),
      lineParagraph("_______________________________"),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Barangay Secretary", font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
      new Paragraph({ margin: [0, 0, 0, 10], children: [new Text({ text: `Issued on ${issuedDate}`, font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
    ],
    styles: { header: { fontSize: 18, bold: true, color: "#1e293b", alignment: "center" }, body: { fontSize: 10, color: "#334155" }, center: { alignment: "center" } },
  };
}

function buildBusinessPdf(data: DocumentData) {
  const { residentName, residentAddress, businessName, businessAddress, ownerName, issuedDate, reference } = data;

  return {
    content: [
      ...headerBlock(),
      new Paragraph({ alignment: "center", margin: [0, 8, 0, 14], children: [new Text({ text: "BARANGAY BUSINESS PERMIT", font: "Helvetica-Bold", fontSize: 18, color: "#1e293b" })] }),
      new Paragraph({ alignment: "center", margin: [0, 0, 0, 10], children: [new Text({ text: "I hereby certify that the business described below is duly registered and in good standing within this barangay.", font: "Helvetica", fontSize: 10, color: "#334155" })] }),
      divider(),
      new Paragraph({ margin: [0, 4, 0, 8], children: [new Text({ text: "Business Name: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: businessName ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Business Address: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: businessAddress ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Owner / Proprietor: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: ownerName ?? "—", font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Applicant: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentName, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Applicant Address: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: residentAddress, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Reference No.: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: reference, font: "Helvetica", fontSize: 10 })] }),
      new Paragraph({ margin: [0, 2, 0, 8], children: [new Text({ text: "Issued on: ", font: "Helvetica-Bold", fontSize: 10 }), new Text({ text: issuedDate, font: "Helvetica", fontSize: 10 })] }),
      divider(),
      lineParagraph("_______________________________"),
      new Paragraph({ margin: [0, 2, 0, 2], children: [new Text({ text: "Barangay Secretary", font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
      new Paragraph({ margin: [0, 0, 0, 10], children: [new Text({ text: `Issued on ${issuedDate}`, font: "Helvetica", fontSize: 9, color: "#64748b" })] }),
    ],
    styles: { header: { fontSize: 18, bold: true, color: "#1e293b", alignment: "center" }, body: { fontSize: 10, color: "#334155" }, center: { alignment: "center" } },
  };
}

/* ============================================================ */
/*  PDF GENERATOR (returns raw bytes for Blob construction)   */
/* ============================================================ */

function renderPdf(data: DocumentData): Uint8Array {
  let docDef;
  switch (data.type) {
    case "clearance":
      docDef = buildClearancePdf(data);
      break;
    case "indigency":
      docDef = buildIndigencyPdf(data);
      break;
    case "residency":
      docDef = buildResidencyPdf(data);
      break;
    case "business":
      docDef = buildBusinessPdf(data);
      break;
    default:
      docDef = buildClearancePdf(data);
  }
  const pdfDoc = pm.createPdfKitDocument(docDef);
  const chunks: Buffer[] = [];
  pdfDoc.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
  pdfDoc.end();
  return Buffer.concat(chunks) as unknown as Uint8Array;
}

/* ============================================================ */
/*  DOCX TEMPLATES (docx library)                             */
/* ============================================================ */

function buildClearanceDocx(data: DocumentData): DocxDocument {
  const { residentName, residentAddress, issuedDate, validUntil, purpose, reference } = data;

  const profileRow = (label: string, value: string) =>
    new DocxParagraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }), new TextRun({ text: value, size: 20, font: "Calibri" })],
    });

  return new DocxDocument({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20, color: "#1e293b" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...headerBlock().map((p) => p as DocxParagraph),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: "BARANGAY CLEARANCE", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: "I hereby certify to whom it may concern that the bearer of this document is a resident of this barangay.",
                size: 22,
                font: "Calibri",
                color: "#334155",
              }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Name", residentName),
          profileRow("Address", residentAddress),
          profileRow("Resident ID", data.residentId ?? "—"),
          profileRow("Purpose", purpose ?? "N/A"),
          profileRow("Valid Until", validUntil ?? "—"),
          profileRow("Reference No.", reference),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: "Barangay Secretary", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Hall", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: `Issued on ${issuedDate}`, size: 20, font: "Calibri", color: "#64748b" })],
          }),
        ],
      },
    ],
  });
}

function buildIndigencyDocx(data: DocumentData): DocxDocument {
  const { residentName, residentAddress, issuedDate, reference } = data;

  const profileRow = (label: string, value: string) =>
    new DocxParagraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }), new TextRun({ text: value, size: 20, font: "Calibri" })],
    });

  return new DocxDocument({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20, color: "#1e293b" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...headerBlock().map((p) => p as DocxParagraph),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: "CERTIFICATE OF INDIGENCY", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: "I hereby certify that the person named below is indigent / has very limited income and is unable to meet the basic needs of life.",
                size: 22,
                font: "Calibri",
                color: "#334155",
              }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Name", residentName),
          profileRow("Address", residentAddress),
          profileRow("Resident ID", data.residentId ?? "—"),
          profileRow("Reference No.", reference),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: "Barangay Secretary", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Hall", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: `Issued on ${issuedDate}`, size: 20, font: "Calibri", color: "#64748b" })],
          }),
        ],
      },
    ],
  });
}

function buildResidencyDocx(data: DocumentData): DocxDocument {
  const { residentName, residentAddress, issuedDate, validUntil, reference } = data;

  const profileRow = (label: string, value: string) =>
    new DocxParagraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }), new TextRun({ text: value, size: 20, font: "Calibri" })],
    });

  return new DocxDocument({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20, color: "#1e293b" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...headerBlock().map((p) => p as DocxParagraph),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: "CERTIFICATE OF RESIDENCY", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: "I hereby certify that the person named below is a resident of this barangay and has been residing within the jurisdiction for a period of time.",
                size: 22,
                font: "Calibri",
                color: "#334155",
              }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Name", residentName),
          profileRow("Address", residentAddress),
          profileRow("Resident ID", data.residentId ?? "—"),
          profileRow("Reference No.", reference),
          profileRow("Valid Until", validUntil ?? "—"),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: "Barangay Secretary", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Hall", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: `Issued on ${issuedDate}`, size: 20, font: "Calibri", color: "#64748b" })],
          }),
        ],
      },
    ],
  });
}

function buildBusinessDocx(data: DocumentData): DocxDocument {
  const { residentName, residentAddress, businessName, businessAddress, ownerName, issuedDate, reference } = data;

  const profileRow = (label: string, value: string) =>
    new DocxParagraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }), new TextRun({ text: value, size: 20, font: "Calibri" })],
    });

  return new DocxDocument({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20, color: "#1e293b" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          ...headerBlock().map((p) => p as DocxParagraph),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: "BARANGAY BUSINESS PERMIT", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: "I hereby certify that the business described below is duly registered and in good standing within this barangay.",
                size: 22,
                font: "Calibri",
                color: "#334155",
              }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Business Name", businessName ?? "—"),
          profileRow("Business Address", businessAddress ?? "—"),
          profileRow("Owner / Proprietor", ownerName ?? "—"),
          profileRow("Applicant", residentName),
          profileRow("Applicant Address", residentAddress),
          profileRow("Reference No.", reference),
          profileRow("Issued on", issuedDate),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" },
            },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: "Barangay Secretary", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Hall", size: 20, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: `Issued on ${issuedDate}`, size: 20, font: "Calibri", color: "#64748b" })],
          }),
        ],
      },
    ],
  });
}

/* ============================================================ */
/*  DOCX GENERATOR (returns raw bytes for Blob construction)  */
/* ============================================================ */

async function renderDocx(data: DocumentData): Promise<Uint8Array> {
  let doc: DocxDocument;
  switch (data.type) {
    case "clearance":
      doc = buildClearanceDocx(data);
      break;
    case "indigency":
      doc = buildIndigencyDocx(data);
      break;
    case "residency":
      doc = buildResidencyDocx(data);
      break;
    case "business":
      doc = buildBusinessDocx(data);
      break;
    default:
      doc = buildClearanceDocx(data);
  }
  const blob = await Packer.toBlob(doc);
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/* ============================================================ */
/*  PUBLIC API                                                  */
/* ============================================================ */

/**
 * Generates an exportable document for the given request.
 *
 * @param data   - The document payload (reference, resident info, etc.)
 * @param format - "pdf" for PDFKit, "docx" for Word
 * @returns A Blob ready for download / streaming
 */
export async function generateDocument(data: DocumentData, format: Format): Promise<Blob> {
  if (format === "pdf") {
    const bytes = renderPdf(data);
    return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  }
  // docx
  const bytes = await renderDocx(data);
  return new Blob([bytes as unknown as BlobPart], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}


