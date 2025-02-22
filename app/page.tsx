'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Measurement } from '@/lib/types/measurement';
import Link from 'next/link';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useMeasurementService } from '@/lib/hooks/useMeasurementService';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const measurementService = useMeasurementService();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadMeasurements = async () => {
      setIsLoading(true);
      try {
        const data = await measurementService.getAll();
        setMeasurements(data);
        setFilteredMeasurements(data);
      } catch (error) {
        console.error('Failed to load measurements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMeasurements();
  }, [measurementService]);

  useEffect(() => {
    setIsSearching(true);
    const filtered = measurements.filter(measurement => {
      const searchTerms = [
        measurement.title.toLowerCase(),
        ...measurement.searchTerms.map(term => term.toLowerCase()),
        measurement.category.toLowerCase(),
      ];
      return searchTerms.some(term => term.includes(debouncedSearchQuery.toLowerCase()));
    });
    setFilteredMeasurements(filtered);
    setTimeout(() => setIsSearching(false), 300);
  }, [debouncedSearchQuery, measurements]);

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full" />
          </CardHeader>
        </Card>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Radiology Normal Values
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive collection of radiological measurements and their normal ranges
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            )}
            <Input
              type="text"
              placeholder="Search measurements by name, category, or related terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-4"
              >
                Showing {filteredMeasurements.length} results for "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <AnimatePresence>
              {filteredMeasurements.map((measurement, index) => (
                <motion.div
                  key={measurement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/measurements/${measurement.id}`}>
                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 overflow-hidden group dark:bg-gray-800 transform hover:scale-[1.02]">
                      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                        {measurement.images.length > 0 ? (
                          <img
                            src={measurement.images[0].url}
                            alt={measurement.images[0].caption}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <ImageIcon className="h-12 w-12" />
                          </div>
                        )}
                        {measurement.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded-md">
                            +{measurement.images.length - 1} more
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                          {measurement.category}
                        </div>
                        <CardTitle className="text-xl">{measurement.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* No Results Message */}
        {filteredMeasurements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No measurements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No measurements found for "{searchQuery}". Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 