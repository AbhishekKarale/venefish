'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Measurement } from '@/lib/types/measurement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useMeasurementService } from '@/lib/hooks/useMeasurementService';

export default function MeasurementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const measurementService = useMeasurementService();
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadMeasurement = async () => {
      if (!params?.id || typeof params.id !== 'string') return;
      const data = await measurementService.getById(params.id);
      setMeasurement(data);
    };
    loadMeasurement();
  }, [params?.id, measurementService]);

  if (!measurement) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading measurement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-12 px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Measurements
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="mb-8">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              {measurement.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {measurement.title}
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                {measurement.images.length > 0 ? (
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700">
                      <img
                        src={measurement.images[selectedImageIndex].url}
                        alt={measurement.images[selectedImageIndex].caption}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        {measurement.images[selectedImageIndex].caption}
                      </p>
                    </div>
                    {measurement.images.length > 1 && (
                      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {measurement.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`relative flex-shrink-0 ${
                                selectedImageIndex === index
                                  ? 'ring-2 ring-blue-600 dark:ring-blue-400'
                                  : 'hover:opacity-75'
                              }`}
                            >
                              <div className="relative w-20 h-20">
                                <img
                                  src={image.url}
                                  alt={image.caption}
                                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 space-y-6">
                  {/* Normal Value */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Normal Value
                    </h2>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {measurement.normalValue}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {measurement.description}
                    </p>
                  </div>

                  {/* Search Terms */}
                  {measurement.searchTerms.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Related Terms
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {measurement.searchTerms.map((term, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 