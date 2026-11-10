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
  const isDark = false; // print is always light
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: '"Helvetica", "Arial", sans-serif', fontSize: "11px", color: "#1e293b", lineHeight: 1.4, background: "#ffffff" }}>
      <div style={{ width: "8.5in", minHeight: "11in", margin: "0 auto", padding: "70px 50px", background: "#ffffff", position: "relative" }}>
        {/* Barangay seal badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "2px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", boxShadow: "0 4px 12px rgba(30,41,59,0.15)" }}>
            <div style={{ fontSize: "28px" }}>🏛️</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "3px", color: "#1e293b", textTransform: "uppercase" }}>Republic of the Philippines</div>
          <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1e293b", marginTop: "2px" }}>Barangay Main Avenue, Purok 3</div>
          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>Telephone: +63 45 234 5678  |  secretary@barangay.gov.ph</div>
          <div style={{ borderBottom: "2px solid #1e293b", margin: "20px 0" }}></div>
        </div>
        <div style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", color: "#1e293b", marginBottom: "14px", letterSpacing: "1px" }}>{titles[data.type]}</div>
        <div style={{ fontSize: "11.5px", textAlign: "center", color: "#475569", marginBottom: "20px", lineHeight: 1.5 }}>{certTexts[data.type]}</div>
        <div style={{ borderBottom: "1px solid #cbd5e1", margin: "20px 0" }}></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 30px", marginBottom: "22px" }}>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Reference No.:</span> {data.reference}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Name:</span> {data.residentName}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Address:</span> {data.residentAddress}</div>
          <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Resident ID:</span> {data.residentId ?? "—"}</div>
          {data.type === "clearance" && (
            <>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Purpose:</span> {data.purpose ?? "N/A"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Valid Until:</span> {data.validUntil ?? "—"}</div>
            </>
          )}
          {data.type === "business" && (
            <>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Business Name:</span> {data.businessName ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Business Address:</span> {data.businessAddress ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Owner / Proprietor:</span> {data.ownerName ?? "—"}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Applicant:</span> {data.residentName}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ fontWeight: "bold", color: "#334155", display: "inline-block", minWidth: "150px" }}>Applicant Address:</span> {data.residentAddress}</div>
            </>
          )}
        </div>
        <div style={{ borderBottom: "1px solid #cbd5e1", margin: "26px 0" }}></div>
        <div style={{ marginTop: "34px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ borderBottom: "1px solid #94a3b8", width: "260px", marginBottom: "10px" }}></div>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#475569", textAlign: "center" }}>Barangay Secretary</div>
          <div style={{ fontSize: "10px", color: "#64748b", textAlign: "center" }}>Barangay Hall</div>
          <div style={{ fontSize: "10px", color: "#64748b", textAlign: "center", marginTop: "14px" }}>Issued on {data.issuedDate}</div>
        </div>
        {/* Footer */}
        <div style={{ position: "absolute", bottom: "40px", left: "50px", right: "50px", fontSize: "8.5px", color: "#94a3b8", textAlign: "center", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
          Barangay Main Avenue, Purok 3  •  Telephone: +63 45 234 5678  •  secretary@barangay.gov.ph
        </div>
      </div>
    </div>
  );
}
