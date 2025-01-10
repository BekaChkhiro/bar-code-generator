import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { toPng, toJpeg, toSvg } from 'html-to-image';

function App() {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const barcodeRef = useRef();
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBarcodeValue(value);
      setError(value.length !== 13 ? 'EAN-13 ბარკოდი უნდა შედგებოდეს 13 ციფრისგან' : '');
    }
  };

  const downloadImage = async (format) => {
    if (!barcodeValue || barcodeValue.length !== 13) {
      setError('EAN-13 ბარკოდი უნდა შედგებოდეს 13 ციფრისგან');
      return;
    }
    
    try {
      setIsGenerating(true);
      let dataUrl;
      switch (format) {
        case 'PNG':
          dataUrl = await toPng(barcodeRef.current);
          break;
        case 'JPG':
          dataUrl = await toJpeg(barcodeRef.current);
          break;
        case 'SVG':
          dataUrl = await toSvg(barcodeRef.current);
          break;
        default:
          return;
      }
      
      const link = document.createElement('a');
      link.download = `barcode-${barcodeValue}.${format.toLowerCase()}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting barcode:', err);
      setError('ბარკოდის ექსპორტის დროს მოხდა შეცდომა');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 hover:shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 animate-pulse"></div>
                <svg className="relative w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-3">
                EAN-13 ბარკოდი
              </h1>
            </div>
            
            <div className="mb-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
                <input
                  type="text"
                  value={barcodeValue}
                  onChange={handleInputChange}
                  maxLength={13}
                  placeholder="შეიყვანეთ 13 ციფრი"
                  className="relative w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 text-lg shadow-sm"
                />
                {barcodeValue.length === 13 && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                )}
              </div>
              {error ? (
                <p className="mt-3 text-sm text-red-500 flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{error}</span>
                </p>
              ) : (
                <div className="mt-3 flex items-center justify-center text-sm text-gray-500 space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>შეიყვანეთ 13 ციფრი EAN-13 ბარკოდისთვის</p>
                </div>
              )}
            </div>

            {barcodeValue && (
              <div className="space-y-8 animate-fade-in">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-20"></div>
                  <div ref={barcodeRef} className="relative flex justify-center p-8 bg-white rounded-lg shadow-sm">
                    <Barcode
                      value={barcodeValue}
                      format="EAN13"
                      width={2}
                      height={100}
                      displayValue={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['PNG', 'JPG', 'SVG'].map((format) => (
                    <button
                      key={format}
                      onClick={() => downloadImage(format)}
                      disabled={isGenerating || barcodeValue.length !== 13}
                      className="relative group overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        <span>{format}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
