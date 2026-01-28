import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../api/axios';
import { RiZoomInLine, RiZoomOutLine, RiRefreshLine } from '@remixicon/react';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ---------- Memoized Page ---------- */
const PdfPage = memo(({ pageNumber, width, scale }) => (
  <Page
    pageNumber={pageNumber}
    width={width}
    scale={scale}
    renderAnnotationLayer={false}
  />
));

/* ---------- Component ---------- */
const TermsAndCondition = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [scale, setScale] = useState(1);

  const containerRef = useRef(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setPageWidth(containerRef.current.offsetWidth - 24);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      try {
        const { data } = await api.get('/terms-conditions');
        const response = await fetch(data.data);
        const blob = await response.blob();
        if (!cancelled) setPdfFile(blob);
      } catch {
        if (!cancelled) setError('Failed to load PDF');
      }
    };

    loadPdf();
    return () => (cancelled = true);
  }, []);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
  <div
    ref={containerRef}
    style={{
      height: '70vh',
      overflowY: 'auto',
      background: '#f9f9f9',
      borderRadius: 8,
      position: 'relative',
    }}
  >
    {pdfFile && pageWidth > 0 && (
      <>
        <Document file={pdfFile} onLoadSuccess={onLoadSuccess}>
          {Array.from({ length: numPages }, (_, i) => (
            <PdfPage
              key={i}
              pageNumber={i + 1}
              width={pageWidth}
              scale={scale}
            />
          ))}
        </Document>

        <div
          style={{
            position: 'sticky',
            bottom: 0,
            background: '#f9f9f9',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            borderTop: '1px solid #e5e5e5',
            zIndex: 10,
          }}
        >
          <RiZoomOutLine
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
          />

          <RiRefreshLine
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={() => setScale(1)}
          />

          <RiZoomInLine
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={() => setScale(s => Math.min(3, s + 0.2))}
          />
        </div>
      </>
    )}
  </div>
);
};

export default TermsAndCondition;