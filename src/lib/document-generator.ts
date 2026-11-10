"use server";

import {
  Document as DocxDocument,
  Packer,
  Paragraph as DocxParagraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export type DocumentType = "clearance" | "indigency" | "residency" | "business";

export type Format = "docx";

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

const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440;

function addHeader(doc: DocxDocument) {
  // Header is added per-section below
}

function addHeaderParagraphs(children: DocxParagraph[]) {
  children.push(
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
    })
  );
}

function profileRow(label: string, value: string) {
  return new DocxParagraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }), new TextRun({ text: value, size: 20, font: "Calibri" })],
  });
}

function sectionDivider(children: DocxParagraph[]) {
  children.push(
    new DocxParagraph({
      spacing: { before: 60, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "#94a3b8" } },
      children: [new TextRun({ text: "", size: 20 })],
    })
  );
}

function signatureBlock(children: DocxParagraph[], issuedDate: string) {
  children.push(
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
    })
  );
}

const titles: Record<string, string> = {
  clearance: "BARANGAY CLEARANCE",
  indigency: "CERTIFICATE OF INDIGENCY",
  residency: "CERTIFICATE OF RESIDENCY",
  business: "BARANGAY BUSINESS PERMIT",
};

const certTexts: Record<string, string> = {
  clearance: "I hereby certify to whom it may concern that the bearer of this document is a resident of this barangay.",
  indigency: "I hereby certify that the person named below is indigent / has very limited income and is unable to meet the basic needs of life.",
  residency: "I hereby certify that the person named below is a resident of this barangay and has been residing within the jurisdiction for a period of time.",
  business: "I hereby certify that the business described below is duly registered and in good standing within this barangay.",
};

function buildDocx(data: DocumentData): DocxDocument {
  const children: DocxParagraph[] = [];
  addHeaderParagraphs(children);

  children.push(
    new DocxParagraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 14 },
      children: [new TextRun({ text: titles[data.type], bold: true, size: 36, font: "Calibri", color: "#1e293b" })],
    }),
    new DocxParagraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 10 },
      children: [new TextRun({ text: certTexts[data.type], size: 22, font: "Calibri", color: "#334155" })],
    })
  );

  sectionDivider(children);

  children.push(profileRow("Reference No.", data.reference));
  children.push(profileRow("Name", data.residentName));
  children.push(profileRow("Address", data.residentAddress));
  children.push(profileRow("Resident ID", data.residentId ?? "—"));

  if (data.type === "clearance") {
    children.push(profileRow("Purpose", data.purpose ?? "N/A"));
    children.push(profileRow("Valid Until", data.validUntil ?? "—"));
  } else if (data.type === "business") {
    children.push(profileRow("Business Name", data.businessName ?? "—"));
    children.push(profileRow("Business Address", data.businessAddress ?? "—"));
    children.push(profileRow("Owner / Proprietor", data.ownerName ?? "—"));
    children.push(profileRow("Applicant", data.residentName));
    children.push(profileRow("Applicant Address", data.residentAddress));
  }

  sectionDivider(children);
  signatureBlock(children, data.issuedDate);

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
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

async function renderDocx(data: DocumentData): Promise<Buffer> {
  const doc = buildDocx(data);
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

export async function generateDocument(data: DocumentData, format: Format): Promise<Buffer> {
  return renderDocx(data);
}
