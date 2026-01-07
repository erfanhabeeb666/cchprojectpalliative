package com.erfan.cch.Services;

import com.erfan.cch.Dto.PatientDto;
import com.erfan.cch.Dto.PatientVisitReportDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
public class PdfExportService {

    public void exportPatientsToPdf(List<PatientDto> patients, OutputStream out) throws IOException {
        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);

            Paragraph paragraph = new Paragraph("Patients List", fontTitle);
            paragraph.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(paragraph);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(5); // ID, Name, Phone, Address, Condition
            table.setWidthPercentage(100);

            // Header
            addHeader(table, "ID");
            addHeader(table, "Name");
            addHeader(table, "Mobile");
            addHeader(table, "Address");
            addHeader(table, "Condition");

            for (PatientDto p : patients) {
                addCell(table, String.valueOf(p.getId()));
                addCell(table, p.getName());
                addCell(table, p.getMobileNumber());
                addCell(table, p.getAddress());
                addCell(table, p.getMedicalCondition());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating PDF", e);
        }
    }

    public void exportVisitsToPdf(List<PatientVisitReportDto> visits, OutputStream out) throws IOException {
        try {
            Document document = new Document(PageSize.A4.rotate()); // Landscape
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);

            Paragraph paragraph = new Paragraph("Visits Report", fontTitle);
            paragraph.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(paragraph);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(8); // Date, Patient, Volunteer, procedures, consumables, status, notes
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 2, 3, 3, 3, 4, 3, 2, 4 });

            addHeader(table, "Date");
            addHeader(table, "Patient");
            addHeader(table, "Volunteer");
            addHeader(table, "Procedures");
            addHeader(table, "Consumables");
            addHeader(table, "Status");
            addHeader(table, "Submitted By");
            addHeader(table, "Notes");

            for (PatientVisitReportDto v : visits) {
                addCell(table, v.getVisitDate() != null ? v.getVisitDate().toString() : "");
                addCell(table, v.getPatientName());
                addCell(table, v.getVolunteerName());

                String procedures = v.getProceduresDone() != null ? String.join(", ", v.getProceduresDone()) : "";
                addCell(table, procedures);

                String consumables = "";
                if (v.getConsumablesUsed() != null && !v.getConsumablesUsed().isEmpty()) {
                    consumables = v.getConsumablesUsed().stream()
                            .map(c -> c.getConsumable().getName() + " (" + c.getQuantityUsed() + ")")
                            .reduce((a, b) -> a + ", " + b)
                            .orElse("");
                }
                addCell(table, consumables);

                addCell(table, v.getStatus() != null ? v.getStatus().toString() : "");
                addCell(table, v.getSubmittedBy());
                addCell(table, v.getNotes());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating PDF", e);
        }
    }

    private void addHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell();
        cell.setPhrase(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text) {
        table.addCell(text != null ? text : "");
    }
}
