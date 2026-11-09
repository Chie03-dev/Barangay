"use server";

import { generateDocument, type DocumentData } from "@/lib/document-generator";

export async function printDocument(data: DocumentData): Promise<string> {
  const buffer = await generateDocument(data, "pdf");
  const base64 = buffer.toString("base64");
  return `data:application/pdf;base64,${base64}`;
}

export async function downloadDocument(
  data: DocumentData,
  format: "pdf" | "docx"
): Promise<string> {
  const buffer = await generateDocument(data, format);
  const base64 = buffer.toString("base64");
  const mime =
    format === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return `data:${mime};base64,${base64}`;
}
