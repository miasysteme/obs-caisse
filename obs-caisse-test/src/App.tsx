import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createClient } from '@supabase/supabase-js';

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

// Configuration Supabase
const supabaseUrl = 'https://vhahwekekuuntqlkvtoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh3ZWtla3V1bnRxbGt2dG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTI4NzEsImV4cCI6MjA0OTA2ODg3MX0.YSBJrVBXhJhEhKJhYJhEhKJhYJhEhKJhYJhEhKJhYJhE';

const supabase = createClient(supabaseUrl, supabaseKey);

interface TestData {
  clients: any[];
  stores: any[];
  products: any[];
  subscriptions: any[];
  imeiRecords: any[];
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData>({
    clients: [],
    stores: [],
    products: [],
    subscriptions: [],
    imeiRecords: []
  });
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('testing');

      // Test de connexion basique
      const { data: clients, error: clientsError } = await supabase
        .from('obs_clients')
        .select('*')
        .limit(10);

      if (clientsError) throw clientsError;

      const { data: stores, error: storesError } = await supabase
        .from('obs_stores')
        .select('*')
        .limit(10);

      if (storesError) throw storesError;

      const { data: products, error: productsError } = await supabase
        .from('obs_products_catalog')
        .select('*')
        .limit(10);

      if (productsError) throw productsError;

      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('obs_subscriptions')
        .select('*')
        .limit(10);

      if (subscriptionsError) throw subscriptionsError;

      const { data: imeiRecords, error: imeiError } = await supabase
        .from('obs_imei_records')
        .select('*')
        .limit(10);

      if (imeiError) throw imeiError;

      setTestData({
        clients: clients || [],
        stores: stores || [],
        products: products || [],
        subscriptions: subscriptions || [],
        imeiRecords: imeiRecords || []
      });

      setConnectionStatus('success');
      setError(null);
    } catch (err: any) {
      console.error('Erreur de connexion Supabase:', err);
      setError(err.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const createTestSale = async () => {
    try {
      const { data, error } = await supabase
        .from('obs_sales')
        .insert({
          store_id: testData.stores[0]?.id,
          montant_total: 450000,
          imei: '123456789012345',
          nom_client: 'Client Test',
          numero_facture: `FAC-${Date.now()}`,
          sale_price: 450000
        })
        .select();

      if (error) throw error;

      alert('Vente de test créée avec succès !');
      console.log('Vente créée:', data);
    } catch (err: any) {
      alert('Erreur lors de la création de la vente: ' + err.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            🏪 OBS CAISSE - TEST
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            Interface de Test du Système de Point de Vente
          </Typography>
          
          {/* Statut de connexion */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📡 Statut de Connexion Supabase
              </Typography>
              {connectionStatus === 'testing' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>Test de connexion en cours...</Typography>
                </Box>
              )}
              {connectionStatus === 'success' && (
                <Alert severity="success">
                  ✅ Connexion Supabase établie avec succès !
                </Alert>
              )}
              {connectionStatus === 'error' && (
                <Alert severity="error">
                  ❌ Erreur de connexion: {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Données de test */}
          {connectionStatus === 'success' && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Résumé des Données
                    </Typography>
                    <Typography variant="body1">• Clients: {testData.clients.length}</Typography>
                    <Typography variant="body1">• Boutiques: {testData.stores.length}</Typography>
                    <Typography variant="body1">• Produits: {testData.products.length}</Typography>
                    <Typography variant="body1">• Abonnements: {testData.subscriptions.length}</Typography>
                    <Typography variant="body1">• IMEI Records: {testData.imeiRecords.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🧪 Actions de Test
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={createTestSale}
                        disabled={testData.stores.length === 0}
                      >
                        Créer Vente Test
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={testSupabaseConnection}
                      >
                        Recharger Données
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tableau des produits */}
          {testData.products.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📱 Catalogue Produits
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell align="right">Prix Base</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testData.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.nom}</TableCell>
                          <TableCell>{product.categorie}</TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('fr-FR').format(product.prix_base)} F
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Tableau des boutiques */}
          {testData.stores.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏪 Boutiques du Réseau
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Téléphone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testData.stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>{store.nom}</TableCell>
                          <TableCell>{store.adresse}</TableCell>
                          <TableCell>{store.telephone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
