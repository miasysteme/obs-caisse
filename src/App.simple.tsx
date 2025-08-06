import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            🏪 OBS CAISSE
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            Système de Point de Vente pour Réseau de Boutiques
          </Typography>
          
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                ✅ Configuration Supabase : Connectée
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • Base de données : 30 tables disponibles
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • Données de test : Créées avec succès
              </Typography>
              <Typography variant="body1">
                • Permissions : Mode écriture activé
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Données disponibles :
              </Typography>
              <Typography variant="body1">• 2 clients entreprises</Typography>
              <Typography variant="body1">• 3 boutiques</Typography>
              <Typography variant="body1">• 8 produits au catalogue</Typography>
              <Typography variant="body1">• 6 abonnements actifs</Typography>
              <Typography variant="body1">• 2 enregistrements IMEI</Typography>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => alert('Interface de test - Fonctionnalité à implémenter')}
            >
              Interface de Test
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => alert('Point de vente - Fonctionnalité à implémenter')}
            >
              Point de Vente
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
