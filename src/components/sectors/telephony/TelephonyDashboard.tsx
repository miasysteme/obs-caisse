import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress
} from '@mui/material';

interface IMEIDevice {
  id: string;
  imei: string;
  brand: string;
  model: string;
  color: string;
  status: 'in_stock' | 'sold' | 'repair' | 'reserved';
  purchase_price: number;
  sale_price: number;
  supplier: string;
  purchase_date: string;
  sale_date?: string;
  customer_name?: string;
  warranty_months: number;
}

interface RepairTicket {
  id: string;
  imei: string;
  device_info: string;
  customer_name: string;
  issue_description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  repair_cost: number;
  created_date: string;
  completion_date?: string;
}

const mockDevices: IMEIDevice[] = [
  {
    id: '1',
    imei: '123456789012345',
    brand: 'Samsung',
    model: 'Galaxy A54',
    color: 'Noir',
    status: 'in_stock',
    purchase_price: 180000,
    sale_price: 220000,
    supplier: 'Distributeur Officiel',
    purchase_date: '2024-12-01',
    warranty_months: 12
  },
  {
    id: '2',
    imei: '987654321098765',
    brand: 'iPhone',
    model: '15 Pro',
    color: 'Bleu Titane',
    status: 'sold',
    purchase_price: 650000,
    sale_price: 750000,
    supplier: 'Apple Store',
    purchase_date: '2024-11-15',
    sale_date: '2024-12-05',
    customer_name: 'Kouassi Jean',
    warranty_months: 12
  }
];

const mockRepairs: RepairTicket[] = [
  {
    id: '1',
    imei: '555666777888999',
    device_info: 'Samsung Galaxy S23 - Écran cassé',
    customer_name: 'Adjoua Marie',
    issue_description: 'Écran fissuré suite à une chute',
    status: 'in_progress',
    repair_cost: 45000,
    created_date: '2024-12-03'
  }
];

const statusColors = {
  in_stock: 'success',
  sold: 'primary',
  repair: 'warning',
  reserved: 'info'
} as const;

const statusLabels = {
  in_stock: 'En Stock',
  sold: 'Vendu',
  repair: 'En Réparation',
  reserved: 'Réservé'
};

const repairStatusColors = {
  pending: 'default',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error'
} as const;

const repairStatusLabels = {
  pending: 'En Attente',
  in_progress: 'En Cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

export const TelephonyDashboard: React.FC = () => {
  const [devices, setDevices] = useState<IMEIDevice[]>([]);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [searchIMEI, setSearchIMEI] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<IMEIDevice | null>(null);
  const [openDeviceDialog, setOpenDeviceDialog] = useState(false);

  useEffect(() => {
    // En production, ces données viendraient de l'API Supabase
    setDevices(mockDevices);
    setRepairs(mockRepairs);
  }, []);

  const handleSearchIMEI = () => {
    if (!searchIMEI.trim()) return;
    
    const device = devices.find(d => d.imei.includes(searchIMEI));
    if (device) {
      setSelectedDevice(device);
      setOpenDeviceDialog(true);
    } else {
      alert('IMEI non trouvé dans la base de données');
    }
  };

  const getStockStats = () => {
    const total = devices.length;
    const inStock = devices.filter(d => d.status === 'in_stock').length;
    const sold = devices.filter(d => d.status === 'sold').length;
    const inRepair = devices.filter(d => d.status === 'repair').length;
    
    return { total, inStock, sold, inRepair };
  };

  const stats = getStockStats();

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec statistiques */}
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        📱 Tableau de Bord Téléphonie
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Appareils
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Stock
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.inStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vendus
              </Typography>
              <Typography variant="h4" color="primary.main">
                {stats.sold}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Réparation
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.inRepair}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recherche IMEI */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Recherche par IMEI
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Numéro IMEI"
              value={searchIMEI}
              onChange={(e) => setSearchIMEI(e.target.value)}
              placeholder="Entrez le numéro IMEI..."
              sx={{ flexGrow: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearchIMEI}
              disabled={!searchIMEI.trim()}
            >
              Rechercher
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Liste des appareils */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Inventaire des Appareils
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>IMEI</TableCell>
                      <TableCell>Appareil</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Prix Vente</TableCell>
                      <TableCell>Client</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {device.imei}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {device.brand} {device.model}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {device.color}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[device.status]}
                            color={statusColors[device.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {device.sale_price.toLocaleString()} F
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {device.customer_name || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tickets de réparation */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔧 Réparations en Cours
              </Typography>
              {repairs.map((repair) => (
                <Card key={repair.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ pb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="bold">
                        {repair.customer_name}
                      </Typography>
                      <Chip
                        label={repairStatusLabels[repair.status]}
                        color={repairStatusColors[repair.status]}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {repair.device_info}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {repair.issue_description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="bold">
                        {repair.repair_cost.toLocaleString()} F
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(repair.created_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog détails appareil */}
      <Dialog open={openDeviceDialog} onClose={() => setOpenDeviceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          📱 Détails de l'Appareil
        </DialogTitle>
        <DialogContent>
          {selectedDevice && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informations Générales
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">IMEI</Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedDevice.imei}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Appareil</Typography>
                  <Typography variant="body1">
                    {selectedDevice.brand} {selectedDevice.model} - {selectedDevice.color}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Statut</Typography>
                  <Chip
                    label={statusLabels[selectedDevice.status]}
                    color={statusColors[selectedDevice.status]}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informations Commerciales
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Prix d'Achat</Typography>
                  <Typography variant="body1">
                    {selectedDevice.purchase_price.toLocaleString()} F CFA
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Prix de Vente</Typography>
                  <Typography variant="body1">
                    {selectedDevice.sale_price.toLocaleString()} F CFA
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Fournisseur</Typography>
                  <Typography variant="body1">
                    {selectedDevice.supplier}
                  </Typography>
                </Box>
                {selectedDevice.customer_name && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Client</Typography>
                    <Typography variant="body1">
                      {selectedDevice.customer_name}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeviceDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TelephonyDashboard;
