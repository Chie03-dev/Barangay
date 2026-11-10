import { type DocumentData } from "@/lib/document-generator";

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

export function DocumentHTML({ data }: { data: DocumentData }) {
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: '"Helvetica", "Arial", sans-serif', fontSize: "12px", color: "#1e293b", lineHeight: 1.4, background: "#ffffff" }}>
      <div style={{ width: "8.5in", minHeight: "11in", margin: "0 auto", padding: "72px 54px", background: "#ffffff" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "2px", color: "#1e293b" }}>BARANGAY HALL</div>
            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>Barangay Main Avenue, Purok 3</div>
            <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px" }}>Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph</div>
            <div style={{ borderBottom: "1px solid #cbd5e1", margin: "16px 0" }}></div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", color: "#1e293b", marginBottom: "12px" }}>{titles[data.type]}</div>
          <div style={{ fontSize: "11px", textAlign: "center", color: "#334155", marginBottom: "18px" }}>{certTexts[data.type]}</div>
          <div style={{ borderBottom: "1px solid #cbd5e1", margin: "16px 0" }}></div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Reference No.:</span> {data.reference}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Name:</span> {data.residentName}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Address:</span> {data.residentAddress}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Resident ID:</span> {data.residentId ?? "—"}</div>
          {data.type === "clearance" && (
            <>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Purpose:</span> {data.purpose ?? "N/A"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Valid Until:</span> {data.validUntil ?? "—"}</div>
            </>
          )}
          {data.type === "business" && (
            <>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Business Name:</span> {data.businessName ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Business Address:</span> {data.businessAddress ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Owner / Proprietor:</span> {data.ownerName ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Applicant:</span> {data.residentName}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", display: "inline-block", minWidth: "140px" }}>Applicant Address:</span> {data.residentAddress}</div>
            </>
          )}
          <div style={{ borderBottom: "1px solid #cbd5e1", margin: "16px 0" }}></div>
          <div style={{ marginTop: "30px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", width: "250px", margin: "0 auto 8px" }}></div>
            <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>Barangay Secretary</div>
            <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>Barangay Hall</div>
            <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center", marginTop: "12px" }}>Issued on {data.issuedDate}</div>
          </div>
        </div>
      </div>
    );
}
