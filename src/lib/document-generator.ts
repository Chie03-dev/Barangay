/**
 * Document Generator for Barangay
 *
 * Generates exportable, official-looking documents (PDF + DOCX) for the
 * barangay resident portal. Supports: Barangay Clearance, Certificate of
 * Indigency, Certificate of Residency, Barangay Business Permit.
 *
 * Uses pdfmake for PDF and docx for Word.
 *
 * SERVER-ONLY: runs in Node.js (Next.js Server Actions). Not safe for the
 * browser bundle because pdfmake relies on require/Buffer/createPdfKitDocument.
 */

"use server";

import PDFDocument from "pdfkit";
import {
  Document as DocxDocument,
  Packer,
  Paragraph as DocxParagraph,
  TextRun,
  AlignmentType,
  BorderStyle,
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
/*  PDF GENERATOR (pdfkit, server-side Node.js)               */
/* ============================================================ */

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;

function addHeader(doc: any) {
  doc.fontSize(13).font("Helvetica-Bold").fillColor("#1e293b").text("BARANGAY HALL", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(8).font("Helvetica").fillColor("#64748b").text("Barangay Main Avenue, Purok 3", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(7).fillColor("#94a3b8").text("Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", { align: "center" });
  doc.moveDown(1);
  doc.lineWidth(0.5).strokeColor("#cbd5e1").moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).stroke();
  doc.moveDown(0.5);
}

function addField(doc: any, label: string, value: string) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor("#1e293b").text(`${label}: `, { continued: true });
  doc.font("Helvetica").fillColor("#334155").text(value);
  doc.moveDown(0.5);
}

function addDivider(doc: any) {
  doc.moveDown(0.5);
  doc.lineWidth(0.5).strokeColor("#cbd5e1").moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).stroke();
  doc.moveDown(0.5);
}

function addSignatureLine(doc: any) {
  doc.moveDown(0.5);
  doc.fontSize(9).font("Helvetica").fillColor("#64748b").text("_______________________________", { align: "center" });
  doc.moveDown(0.5);
  doc.text("Barangay Secretary", { align: "center" });
  doc.moveDown(0.5);
  doc.text("Barangay Hall", { align: "center" });
}

function renderPdf(data: DocumentData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: "LETTER", margin: MARGIN });
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    addHeader(doc);

    // Title
    const titles: Record<string, string> = {
      clearance: "BARANGAY CLEARANCE",
      indigency: "CERTIFICATE OF INDIGENCY",
      residency: "CERTIFICATE OF RESIDENCY",
      business: "BARANGAY BUSINESS PERMIT",
    };
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1e293b").text(titles[data.type], { align: "center" });
    doc.moveDown(0.5);

    // Certification text
    const certTexts: Record<string, string> = {
      clearance: "I hereby certify to whom it may concern that the bearer of this document is a resident of this barangay.",
      indigency: "I hereby certify that the person named below is indigent / has very limited income and is unable to meet the basic needs of life.",
      residency: "I hereby certify that the person named below is a resident of this barangay and has been residing within the jurisdiction for a period of time.",
      business: "I hereby certify that the business described below is duly registered and in good standing within this barangay.",
    };
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(certTexts[data.type], { align: "center" });
    doc.moveDown(0.8);

    addDivider(doc);

    // Fields
    addField(doc, "Reference No.", data.reference);
    addField(doc, "Name", data.residentName);
    addField(doc, "Address", data.residentAddress);
    addField(doc, "Resident ID", data.residentId ?? "—");
    if (data.type === "clearance") {
      addField(doc, "Purpose", data.purpose ?? "N/A");
      addField(doc, "Valid Until", data.validUntil ?? "—");
    } else if (data.type === "business") {
      addField(doc, "Business Name", data.businessName ?? "—");
      addField(doc, "Business Address", data.businessAddress ?? "—");
      addField(doc, "Owner / Proprietor", data.ownerName ?? "—");
      addField(doc, "Applicant", data.residentName);
      addField(doc, "Applicant Address", data.residentAddress);
    }

    addDivider(doc);
    addSignatureLine(doc);
    doc.fontSize(9).fillColor("#64748b").text(`Issued on ${data.issuedDate}`, { align: "center" });

    doc.end();
  });
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
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: "BARANGAY HALL", bold: true, size: 26, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Main Avenue, Purok 3", size: 16, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: "Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", size: 14, font: "Calibri", color: "#94a3b8" })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#cbd5e1" } },
            children: [new TextRun({ text: "", size: 2 })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 14 },
            children: [new TextRun({ text: "BARANGAY CLEARANCE", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 10 },
            children: [
              new TextRun({ text: "I hereby certify to whom it may concern that the bearer of this document is a resident of this barangay.", size: 20, font: "Calibri", color: "#334155" }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: "BARANGAY HALL", bold: true, size: 26, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Main Avenue, Purok 3", size: 16, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: "Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", size: 14, font: "Calibri", color: "#94a3b8" })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#cbd5e1" } },
            children: [new TextRun({ text: "", size: 2 })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 14 },
            children: [new TextRun({ text: "CERTIFICATE OF INDIGENCY", bold: true, size: 34, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 10 },
            children: [
              new TextRun({ text: "I hereby certify that the person named below is indigent / has very limited income and is unable to meet the basic needs of life.", size: 20, font: "Calibri", color: "#334155" }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Name", residentName),
          profileRow("Address", residentAddress),
          profileRow("Resident ID", data.residentId ?? "—"),
          profileRow("Reference No.", reference),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: "BARANGAY HALL", bold: true, size: 26, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Main Avenue, Purok 3", size: 16, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: "Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", size: 14, font: "Calibri", color: "#94a3b8" })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#cbd5e1" } },
            children: [new TextRun({ text: "", size: 2 })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 14 },
            children: [new TextRun({ text: "CERTIFICATE OF RESIDENCY", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 10 },
            children: [
              new TextRun({ text: "I hereby certify that the person named below is a resident of this barangay and has been residing within the jurisdiction for a period of time.", size: 20, font: "Calibri", color: "#334155" }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
            children: [new TextRun({ text: "", size: 20 })],
          }),
          profileRow("Name", residentName),
          profileRow("Address", residentAddress),
          profileRow("Resident ID", data.residentId ?? "—"),
          profileRow("Reference No.", reference),
          profileRow("Valid Until", validUntil ?? "—"),
          new DocxParagraph({
            spacing: { before: 80, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: "BARANGAY HALL", bold: true, size: 26, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: "Barangay Main Avenue, Purok 3", size: 16, font: "Calibri", color: "#64748b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: "Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph", size: 14, font: "Calibri", color: "#94a3b8" })],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#cbd5e1" } },
            children: [new TextRun({ text: "", size: 2 })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 14 },
            children: [new TextRun({ text: "BARANGAY BUSINESS PERMIT", bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
          }),
          new DocxParagraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 10 },
            children: [
              new TextRun({ text: "I hereby certify that the business described below is duly registered and in good standing within this barangay.", size: 20, font: "Calibri", color: "#334155" }),
            ],
          }),
          new DocxParagraph({
            spacing: { before: 60, after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
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
/*  DOCX GENERATOR (returns Buffer for server-side use)       */
/* ============================================================ */

async function renderDocx(data: DocumentData): Promise<Buffer> {
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
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

/* ============================================================ */
/*  PUBLIC API                                                  */
/* ============================================================ */

/**
 * Generates an exportable document for the given request.
 *
 * @param data   - The document payload (reference, resident info, etc.)
 * @param format - "pdf" for PDFKit, "docx" for Word
 * @returns A Buffer ready for streaming / base64 encoding
 */
export async function generateDocument(data: DocumentData, format: Format): Promise<Buffer> {
  if (format === "pdf") {
    return renderPdf(data);
  }
  return renderDocx(data);
}
