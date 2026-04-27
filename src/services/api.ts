import { BASE_API_URL } from '@/constants/api.constant';

import type { TruckId, FacilityLocation } from './api.interface';

export const apiService = {
  getTruckIds: async (): Promise<TruckId[]> => {
    const response = await fetch(`${BASE_API_URL}/api/truck`);
    if (!response.ok) throw new Error('Failed to Fetch Truck ID');
    return response.json();
  },

  getFacilityLocations: async (): Promise<FacilityLocation[]> => {
    const response = await fetch(`${BASE_API_URL}/api/facility-location`);
    if (!response.ok) throw new Error('Failed to Fetch Facility Locations');
    return response.json();
  },

  postMaintenanceData: async (data: unknown) => {
    const response = await fetch(`${BASE_API_URL}/api/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to Submit Maintenance Record');
    return response.json();
  }
};
