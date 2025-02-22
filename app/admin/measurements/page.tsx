'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Measurement } from '@/lib/types/measurement';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { MeasurementForm } from './measurement-form';
import { useMeasurementService } from '@/lib/hooks/useMeasurementService';
import { AdminRoute } from '@/components/admin/admin-route';
import { useUser } from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { LogOut, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MeasurementsAdminPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const measurementService = useMeasurementService();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    loadMeasurements();
  }, [measurementService]);

  const filteredMeasurements = useMemo(() => {
    if (!searchQuery.trim()) return measurements;
    
    const query = searchQuery.toLowerCase();
    return measurements.filter(measurement => {
      const searchableFields = [
        measurement.title,
        measurement.category,
        measurement.normalValue,
        measurement.description,
        ...(measurement.searchTerms || []),
        ...(measurement.references || []),
      ].map(field => field?.toLowerCase());

      return searchableFields.some(field => field?.includes(query));
    });
  }, [measurements, searchQuery]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const loadMeasurements = async () => {
    try {
      const data = await measurementService.getAll();
      setMeasurements(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load measurements',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    try {
      await measurementService.delete(id);
      await loadMeasurements();
      toast({
        title: 'Success',
        description: 'Measurement deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete measurement',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMeasurement(null);
    loadMeasurements();
  };

  return (
    <AdminRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Measurements Admin</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Signed in as <span className="font-medium text-gray-900 dark:text-gray-200">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 dark:text-gray-400">
            {filteredMeasurements.length} of {measurements.length} measurement{measurements.length !== 1 ? 's' : ''} shown
          </div>
          <Button onClick={() => setIsFormOpen(true)}>Add New Measurement</Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search measurements by title, category, normal value, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Normal Value</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeasurements.map((measurement) => (
              <TableRow key={measurement.id}>
                <TableCell>{measurement.title}</TableCell>
                <TableCell>{measurement.category}</TableCell>
                <TableCell>{measurement.normalValue}</TableCell>
                <TableCell>{measurement.images.length} images</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(measurement)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => measurement.id && handleDelete(measurement.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isFormOpen && (
          <MeasurementForm
            measurement={selectedMeasurement}
            onClose={handleFormClose}
          />
        )}
      </div>
    </AdminRoute>
  );
} 