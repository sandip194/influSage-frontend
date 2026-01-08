import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker once
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ---------- Memoized Page ---------- */
const PdfPage = memo(({ pageNumber, width }) => (
  <Page
    pageNumber={pageNumber}
    width={width}
    renderAnnotationLayer={false}
  />
));

/* ---------- Component ---------- */
const TermsAndCondition = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);

  const containerRef = useRef(null);

  /* ---------- Measure container width ---------- */
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      // Padding safe width
      setPageWidth(containerRef.current.offsetWidth - 24);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  /* ---------- Load PDF ---------- */
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      try {
        const { data } = await axios.get('/terms-conditions');
        const url = data.data;

        const response = await fetch(url);
        const blob = await response.blob();

        if (!cancelled) setPdfFile(blob);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Failed to load PDF');
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: '70vh',
        overflowY: 'auto',
        padding: 12,
        background: '#f9f9f9',
        borderRadius: 8,
      }}
    >
      {pdfFile && pageWidth > 0 && (
        <Document
          file={pdfFile}
          onLoadSuccess={onLoadSuccess}
          loading="Loading terms..."
        >
          {Array.from({ length: numPages }, (_, i) => (
            <PdfPage
              key={i}
              pageNumber={i + 1}
              width={pageWidth}
            />
          ))}
        </Document>
      )}
    </div>
  );
};

export default TermsAndCondition;
    