'use client';

import { useEffect, useState } from 'react';
import { useUser } from 'reactfire';
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

export default function MeasurementsAdminPage() {
  const { data: user } = useUser();
  const router = useRouter();
  const measurementService = useMeasurementService();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirectTo=/admin/measurements');
      return;
    }
    loadMeasurements();
  }, [user, router, measurementService]);

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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Measurements Admin</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Measurement</Button>
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
          {measurements.map((measurement) => (
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
  );
} 