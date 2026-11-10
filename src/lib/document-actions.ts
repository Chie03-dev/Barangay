"use server";

import { generateDocument, type DocumentData } from "@/lib/document-generator";

export async function downloadDocument(data: DocumentData): Promise<string> {
  const buffer = await generateDocument(data, "docx");
  const base64 = buffer.toString("base64");
  return `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
}
