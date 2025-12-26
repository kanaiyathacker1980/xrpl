"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

export function QRCodeGenerator() {
  const [businessAddress, setBusinessAddress] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const data = localStorage.getItem("xrpl_business_wallet");
    if (data) {
      const { address } = JSON.parse(data);
      setBusinessAddress(address);
      generateQR(address);
    }
  }, []);

  const generateQR = async (address: string) => {
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, address, {
          width: 256,
          margin: 2,
        });
      }
      const dataUrl = await QRCode.toDataURL(address, { width: 256 });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = "loyalty-wallet-qr.png";
      link.href = qrDataUrl;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Business Wallet QR Code</h2>

      <div className="space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="border rounded-lg" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Scan to receive loyalty tokens</p>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
            {businessAddress}
          </p>
        </div>

        <button
          onClick={downloadQR}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
}
