import { DocumentHTML } from "@/components/DocumentHTML";
import { PrintTrigger } from "@/components/PrintTrigger";
import { type DocumentData } from "@/lib/document-generator";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const data: DocumentData = {
    reference: (params.reference as string) ?? "",
    type: ((params.type as string) ?? "clearance") as
      | "clearance"
      | "indigency"
      | "residency"
      | "business",
    residentName: (params.residentName as string) ?? "",
    residentAddress: (params.residentAddress as string) ?? "",
    residentId: (params.residentId as string) ?? undefined,
    issuedDate: (params.issuedDate as string) ?? "",
    validUntil: (params.validUntil as string) ?? undefined,
    purpose: (params.purpose as string) ?? undefined,
    businessName: (params.businessName as string) ?? undefined,
    businessAddress: (params.businessAddress as string) ?? undefined,
    ownerName: (params.ownerName as string) ?? undefined,
    remarks: (params.remarks as string) ?? undefined,
    officialName: (params.officialName as string) ?? undefined,
    officialRole: (params.officialRole as string) ?? undefined,
    window: (params.window as string) ?? undefined,
    hasId: (params.hasId as string) === "true",
  };

  return (
    <div>
      <DocumentHTML data={data} />
      <PrintTrigger />
    </div>
  );
}
