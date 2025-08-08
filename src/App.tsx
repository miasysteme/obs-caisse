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
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Dashboard,
  Settings,
  People,
  Store
} from '@mui/icons-material';

import { useAuth } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/AdminDashboard';
import SectorSelector from './components/sectors/SectorSelector';
import RestaurantDashboard from './components/sectors/restaurant/RestaurantDashboard';
import HotelDashboard from './components/sectors/hotel/HotelDashboard';
import BarDashboard from './components/sectors/bar/BarDashboard';
import { BusinessSector } from './types/multitenant';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

const App: React.FC = () => {
  const { user, loading, signOut, isAuthenticated, isAdmin, isCentral, isManager } = useAuth();
  const [selectedSector, setSelectedSector] = useState<BusinessSector | undefined>();
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin' | 'sector'>('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleClose();
    setCurrentView('dashboard');
    setSelectedSector(undefined);
  };

  const handleSectorSelect = (sector: BusinessSector) => {
    setSelectedSector(sector);
    setCurrentView('sector');
  };

  const renderSectorInterface = () => {
    if (!selectedSector) return null;

    switch (selectedSector.code) {
      case 'restaurant':
        return <RestaurantDashboard establishmentId={user?.boutique_id || ''} userId={user?.id || ''} />;
      
      case 'hotel':
        return <HotelDashboard establishmentId={user?.boutique_id || ''} userId={user?.id || ''} />;
      
      case 'bar':
        return <BarDashboard establishmentId={user?.boutique_id || ''} userId={user?.id || ''} />;
      
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

  const renderMainContent = () => {
    if (currentView === 'admin' && (isAdmin || isCentral)) {
      return <AdminDashboard />;
    }

    if (currentView === 'sector' && selectedSector) {
      return renderSectorInterface();
    }

    // Vue tableau de bord par défaut
    return (
      <Box>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Bienvenue sur OBS SYSTEME
        </Typography>
        
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bonjour {user?.first_name} {user?.last_name}
          </Typography>
          <Chip 
            label={user?.role} 
            color="primary" 
            sx={{ mr: 2 }}
          />
          {user?.boutique_name && (
            <Chip 
              label={user.boutique_name} 
              color="secondary"
            />
          )}
        </Box>

        <SectorSelector 
          onSectorSelect={handleSectorSelect}
          selectedSector={selectedSector}
        />

        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            🎯 Secteurs Disponibles
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {[
              { emoji: '🍽️', name: 'Restaurant', desc: 'Commandes, cuisine, livraisons', code: 'restaurant' },
              { emoji: '🏨', name: 'Hôtellerie', desc: 'Réservations, chambres, services', code: 'hotel' },
              { emoji: '🍺', name: 'Bars', desc: 'Stock boissons, événements', code: 'bar' },
              { emoji: '📱', name: 'Téléphonie', desc: 'Suivi IMEI, réparations', code: 'telephony' },
              { emoji: '🛍️', name: 'Retail', desc: 'Inventaire, promotions', code: 'retail' },
              { emoji: '🏥', name: 'Santé', desc: 'Médicaments, ordonnances', code: 'health' },
              { emoji: '🎓', name: 'Éducation', desc: 'Inscriptions, cours', code: 'education' },
              { emoji: '🔧', name: 'Services', desc: 'Rendez-vous, interventions', code: 'services' }
            ].map((sector, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 1,
                  minWidth: 200,
                  textAlign: 'center',
                  cursor: ['restaurant', 'hotel', 'bar'].includes(sector.code) ? 'pointer' : 'default',
                  bgcolor: ['restaurant', 'hotel', 'bar'].includes(sector.code) ? 'action.hover' : 'background.paper',
                  '&:hover': ['restaurant', 'hotel', 'bar'].includes(sector.code) ? {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  } : {}
                }}
                onClick={() => {
                  if (['restaurant', 'hotel', 'bar'].includes(sector.code)) {
                    handleSectorSelect({
                      id: sector.code,
                      code: sector.code as 'telephony' | 'hotel' | 'bar' | 'restaurant' | 'retail' | 'health' | 'education' | 'services',
                      name: sector.name,
                      display_name: sector.name,
                      description: sector.desc,
                      icon: sector.emoji,
                      color: '#2196F3',
                      modules: [],
                      default_config: {},
                      pricing_model: {},
                      is_active: true,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });
                  }
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {sector.emoji}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {sector.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sector.desc}
                </Typography>
                {['restaurant', 'hotel', 'bar'].includes(sector.code) && (
                  <Chip 
                    label="Disponible" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom color="primary">
              🏪 OBS SYSTEME
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Plateforme Multi-Sectorielle SaaS
            </Typography>
          </Box>
          <LoginForm />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏪 OBS SYSTEME - Plateforme Multi-Sectorielle
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={() => setCurrentView('dashboard')}
              variant={currentView === 'dashboard' ? 'outlined' : 'text'}
            >
              Accueil
            </Button>
            
            {(isAdmin || isCentral) && (
              <Button
                color="inherit"
                startIcon={<Settings />}
                onClick={() => setCurrentView('admin')}
                variant={currentView === 'admin' ? 'outlined' : 'text'}
              >
                Administration
              </Button>
            )}

            {selectedSector && (
              <Chip 
                label={selectedSector.display_name}
                color="secondary"
                size="small"
              />
            )}

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.first_name?.[0] || <AccountCircle />}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Box>
                  <Typography variant="subtitle1">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rôle: {user?.role}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {renderMainContent()}
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
            © 2024 SONUTEC SARL - OBS SYSTEME v2.0 Multi-Tenant
            <br />
            Plateforme SaaS révolutionnaire pour l'Afrique
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
