import { BASE_API_URL } from '@/constants/api.constant';

import type {
  TruckId,
  FacilityLocation,
  GetAllResponse
} from './api.interface';

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

  getMaintenanceData: async (
    page: number = 1,
    limit: number = 25,
    filter?: string,
    sort?: 'asc' | 'desc'
  ): Promise<GetAllResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filter) {
      params.append('filter', filter);
    }
    if (sort) {
      params.append('sort', sort);
    }

    const response = await fetch(
      `${BASE_API_URL}/api/maintenance?${params.toString()}`
    );
    if (!response.ok) throw new Error('Failed to Fetch Maintenance Data');
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
