'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { measurementService } from '@/lib/services/measurementService';
import { Measurement } from '@/lib/types/measurement';
import Link from 'next/link';
import { Search, Image as ImageIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    const loadMeasurements = async () => {
      const data = await measurementService.getAll();
      setMeasurements(data);
      setFilteredMeasurements(data);
    };
    loadMeasurements();
  }, []);

  useEffect(() => {
    const filtered = measurements.filter(measurement => {
      const searchTerms = [
        measurement.title.toLowerCase(),
        ...measurement.searchTerms.map(term => term.toLowerCase()),
        measurement.category.toLowerCase(),
      ];
      return searchTerms.some(term => term.includes(searchQuery.toLowerCase()));
    });
    setFilteredMeasurements(filtered);
  }, [searchQuery, measurements]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-12 px-4">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Radiology Normal Values
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive collection of radiological measurements and their normal ranges
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search measurements by name, category, or related terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </div>
          {searchQuery && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-4">
              Showing {filteredMeasurements.length} results for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeasurements.map((measurement) => (
            <Link href={`/measurements/${measurement.id}`} key={measurement.id}>
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 overflow-hidden group dark:bg-gray-800">
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
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {measurement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {measurement.description}
                  </p>
                  {measurement.searchTerms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {measurement.searchTerms.slice(0, 3).map((term, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {term}
                        </span>
                      ))}
                      {measurement.searchTerms.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          +{measurement.searchTerms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
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