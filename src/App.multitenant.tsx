import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Alert
} from '@mui/material';
import { BusinessSector } from './types/multitenant';
import SectorSelector from './components/sectors/SectorSelector';
import TelephonyDashboard from './components/sectors/telephony/TelephonyDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
  },
});

const App: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<BusinessSector | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSectorSelect = (sector: BusinessSector) => {
    setLoading(true);
    setSelectedSector(sector);
    
    // Simulation du chargement des données sectorielles
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const renderSectorInterface = () => {
    if (!selectedSector) return null;

    switch (selectedSector.code) {
      case 'telephony':
        return <TelephonyDashboard />;
      
      case 'restaurant':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              🍽️ Interface Restaurant
            </Typography>
            <Alert severity="info">
              Interface restaurant en cours de développement...
              <br />
              Fonctionnalités prévues : Gestion des commandes, cuisine, livraisons
            </Alert>
          </Box>
        );
      
      case 'hotel':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              🏨 Interface Hôtellerie
            </Typography>
            <Alert severity="info">
              Interface hôtellerie en cours de développement...
              <br />
              Fonctionnalités prévues : Réservations, gestion des chambres, services
            </Alert>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {selectedSector.display_name}
            </Typography>
            <Alert severity="info">
              Interface {selectedSector.name.toLowerCase()} en cours de développement...
            </Alert>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏪 OBS CAISSE - Plateforme Multi-Sectorielle
          </Typography>
          {selectedSector && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Secteur actuel:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {selectedSector.display_name}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {!selectedSector ? (
          <Box>
            <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
              Bienvenue sur OBS CAISSE
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
              Plateforme SaaS Multi-Tenant pour 8 secteurs d'activité en Afrique
            </Typography>
            
            <SectorSelector 
              onSectorSelect={handleSectorSelect}
              selectedSector={selectedSector}
            />

            <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                🎯 Secteurs Supportés
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {[
                  { emoji: '📱', name: 'Téléphonie', desc: 'Suivi IMEI, réparations' },
                  { emoji: '🍽️', name: 'Restaurant', desc: 'Commandes, livraisons' },
                  { emoji: '🏨', name: 'Hôtellerie', desc: 'Réservations, chambres' },
                  { emoji: '🍺', name: 'Bars', desc: 'Stock boissons, événements' },
                  { emoji: '🛍️', name: 'Retail', desc: 'Inventaire, promotions' },
                  { emoji: '🏥', name: 'Santé', desc: 'Médicaments, ordonnances' },
                  { emoji: '🎓', name: 'Éducation', desc: 'Inscriptions, cours' },
                  { emoji: '🔧', name: 'Services', desc: 'Rendez-vous, interventions' }
                ].map((sector, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    minWidth: 200,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {sector.emoji}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {sector.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sector.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <SectorSelector 
              onSectorSelect={handleSectorSelect}
              selectedSector={selectedSector}
            />
            
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Chargement de l'interface {selectedSector.display_name}...
                </Typography>
              </Box>
            ) : (
              renderSectorInterface()
            )}
          </Box>
        )}
      </Container>

      <Box component="footer" sx={{ 
        mt: 'auto', 
        py: 3, 
        px: 2, 
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 SONUTEC SARL - OBS CAISSE v2.0 Multi-Tenant
            <br />
            Plateforme SaaS révolutionnaire pour l'Afrique
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
