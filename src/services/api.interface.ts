export interface TruckId {
  id: number;
  truckId: string;
}

export interface FacilityLocation {
  id: number;
  name: string;
}

export interface MaintenanceRecord {
  id: number;
  maintenanceDate: string;
  odometerReading: number;
  laborHours: string;
  laborCost: string;
  partCost: string;
  totalCost: string;
  downtimeHours: string;
  maintenanceType: string;
  serviceDescription: string;
  truckId: number;
  facilityLocationId: number;
  truck: TruckId;
  facilityLocation: FacilityLocation;
}

export interface GetAllResponse {
  data: MaintenanceRecord[];
  meta: {
    totalData: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
