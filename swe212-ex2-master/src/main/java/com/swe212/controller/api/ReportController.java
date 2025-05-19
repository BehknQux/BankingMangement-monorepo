package com.swe212.controller.api;

import com.swe212.dto.DepositDto;
import com.swe212.service.DepositService;
import com.swe212.service.PdfGenerationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final PdfGenerationService pdfGenerationService;
    private final DepositService depositService;

    @GetMapping("/transactions/pdf")
    public ResponseEntity<byte[]> generateTransactionsPdf(
            HttpServletResponse response,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws JRException, IOException {

        Page<DepositDto> transactionPage = depositService.getAllDepositors(page, size, sortBy, sortDir);
        List<DepositDto> transactions = transactionPage.getContent();

        if (transactions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        byte[] pdfReport = pdfGenerationService.generatePdfReport(transactions);

        HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = "transaction_report.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfReport, headers, HttpStatus.OK);
    }
} 