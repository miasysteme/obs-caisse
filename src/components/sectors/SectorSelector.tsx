import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { BusinessSector } from '../../types/multitenant';

interface SectorSelectorProps {
  onSectorSelect: (sector: BusinessSector) => void;
  selectedSector?: BusinessSector;
}

const sectorEmojis: Record<string, string> = {
  telephony: '📱',
  restaurant: '🍽️',
  hotel: '🏨',
  bar: '🍺',
  retail: '🛍️',
  health: '🏥',
  education: '🎓',
  services: '🔧'
};

const mockSectors: BusinessSector[] = [
  {
    id: '1',
    code: 'telephony',
    name: 'Téléphonie',
    display_name: 'Téléphonie & Accessoires',
    description: 'Vente de téléphones, accessoires et services télécoms',
    icon: 'phone',
    color: '#2196F3',
    modules: ['pos', 'inventory', 'imei_tracking', 'repairs', 'customers'],
    default_config: {},
    pricing_model: { monthly_fee: 20000 },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    code: 'restaurant',
    name: 'Restauration',
    display_name: 'Restaurant & Fast-Food',
    description: 'Gestion de restaurants, commandes et livraisons',
    icon: 'restaurant',
    color: '#FF9800',
    modules: ['pos', 'kitchen', 'orders', 'delivery', 'inventory'],
    default_config: {},
    pricing_model: { monthly_fee: 25000 },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    code: 'hotel',
    name: 'Hôtellerie',
    display_name: 'Hôtel & Hébergement',
    description: 'Gestion hôtelière, réservations et services',
    icon: 'hotel',
    color: '#9C27B0',
    modules: ['reservations', 'rooms', 'pos', 'housekeeping', 'customers'],
    default_config: {},
    pricing_model: { monthly_fee: 30000 },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SectorSelector: React.FC<SectorSelectorProps> = ({
  onSectorSelect,
  selectedSector
}) => {
  const [open, setOpen] = useState(false);
  const [sectors, setSectors] = useState<BusinessSector[]>([]);

  useEffect(() => {
    // En production, ceci viendrait de l'API Supabase
    setSectors(mockSectors);
  }, []);

  const handleSectorSelect = (sector: BusinessSector) => {
    onSectorSelect(sector);
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" gutterBottom>
                Secteur d'Activité
              </Typography>
              {selectedSector ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: selectedSector.color, fontSize: '1.5rem' }}>
                    {sectorEmojis[selectedSector.code]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedSector.display_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedSector.description}
                    </Typography>
                    <Box mt={1}>
                      {selectedSector.modules.map((module) => (
                        <Chip
                          key={module}
                          label={module}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sélectionnez votre secteur d'activité
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{ minWidth: 120 }}
            >
              {selectedSector ? 'Changer' : 'Sélectionner'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Choisissez votre secteur d'activité
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {sectors.map((sector) => (
              <Grid item xs={12} md={6} key={sector.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedSector?.id === sector.id ? 2 : 1,
                    borderColor: selectedSector?.id === sector.id 
                      ? sector.color 
                      : 'divider',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: sector.color
                    }
                  }}
                  onClick={() => handleSectorSelect(sector)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: sector.color, fontSize: '1.5rem' }}>
                        {sectorEmojis[sector.code]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {sector.display_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sector.pricing_model.monthly_fee?.toLocaleString()} F CFA/mois
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {sector.description}
                    </Typography>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Modules inclus:
                      </Typography>
                      <Box mt={1}>
                        {sector.modules.slice(0, 3).map((module) => (
                          <Chip
                            key={module}
                            label={module}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                        {sector.modules.length > 3 && (
                          <Chip
                            label={`+${sector.modules.length - 3} autres`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SectorSelector;
