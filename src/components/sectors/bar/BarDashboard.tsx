
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';

interface BarDashboardProps {
  establishmentId: string;
  userId: string;
}

interface DrinkItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  supplier?: string;
}

interface Sale {
  id: string;
  saleNumber: string;
  customerName?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  servedBy: string;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Event {
  id: string;
  name: string;
  date: string;
  type: 'concert' | 'party' | 'sport' | 'private';
  expectedGuests: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  specialPricing?: { [key: string]: number };
}

const BarDashboard: React.FC<BarDashboardProps> = ({ establishmentId, userId }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [newSaleDialog, setNewSaleDialog] = useState(false);
  const [newEventDialog, setNewEventDialog] = useState(false);

  // Données de démonstration
  useEffect(() => {
    // Simulation du stock de boissons
    setDrinks([
      {
        id: '1',
        name: 'Bière Ivoire',
        category: 'Bières',
        price: 800,
        stock: 120,
        minStock: 50,
        unit: 'bouteille',
        supplier: 'SOLIBRA'
      },
      {
        id: '2',
        name: 'Whisky Black Label',
        category: 'Spiritueux',
        price: 15000,
        stock: 8,
        minStock: 5,
        unit: 'bouteille',
        supplier: 'CFAO'
      },
      {
        id: '3',
        name: 'Coca-Cola',
        category: 'Sodas',
        price: 500,
        stock: 200,
        minStock: 100,
        unit: 'canette',
        supplier: 'CCBCI'
      },
      {
        id: '4',
        name: 'Vin Rouge Bordeaux',
        category: 'Vins',
        price: 8000,
        stock: 15,
        minStock: 10,
        unit: 'bouteille',
        supplier: 'Cave du Plateau'
      },
      {
        id: '5',
        name: 'Jus d\'Orange',
        category: 'Jus',
        price: 1000,
        stock: 30,
        minStock: 20,
        unit: 'litre',
        supplier: 'Tropical'
      }
    ]);

    // Simulation des ventes
    setSales([
      {
        id: '1',
        saleNumber: 'VTE-001',
        customerName: 'Table 5',
        items: [
          { id: '1', name: 'Bière Ivoire', quantity: 4, price: 800 },
          { id: '3', name: 'Coca-Cola', quantity: 2, price: 500 }
        ],
        totalAmount: 4200,
        paymentMethod: 'Espèces',
        createdAt: new Date().toISOString(),
        servedBy: 'Kouame'
      },
      {
        id: '2',
        saleNumber: 'VTE-002',
        items: [
          { id: '2', name: 'Whisky Black Label', quantity: 1, price: 15000 },
          { id: '4', name: 'Vin Rouge Bordeaux', quantity: 1, price: 8000 }
        ],
        totalAmount: 23000,
        paymentMethod: 'Carte',
        createdAt: new Date().toISOString(),
        servedBy: 'Aya'
      }
    ]);

    // Simulation des événements
    setEvents([
      {
        id: '1',
        name: 'Soirée Coupé-Décalé',
        date: '2024-12-25',
        type: 'concert',
        expectedGuests: 200,
        status: 'planned',
        specialPricing: {
          '1': 1000, // Bière à 1000 F au lieu de 800
          '3': 600   // Coca à 600 F au lieu de 500
        }
      },
      {
        id: '2',
        name: 'Match CAN 2024',
        date: '2024-12-28',
        type: 'sport',
        expectedGuests: 150,
        status: 'planned'
      }
    ]);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStockStatus = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 100) return 'error';
    if (percentage <= 150) return 'warning';
    return 'success';
  };

  const getStockStatusText = (current: number, min: number) => {
    if (current <= min) return 'Stock critique';
    if (current <= min * 1.5) return 'Stock faible';
    return 'Stock OK';
  };

  const renderStockTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion du Stock</Typography>
        <Button variant="contained" color="primary">
          Réapprovisionner
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Prix Unitaire</TableCell>
              <TableCell align="right">Stock Actuel</TableCell>
              <TableCell align="right">Stock Min</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Fournisseur</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drinks.map((drink) => (
              <TableRow key={drink.id}>
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2">{drink.name}</Typography>
                </TableCell>
                <TableCell>{drink.category}</TableCell>
                <TableCell align="right">{drink.price.toLocaleString()} F</TableCell>
                <TableCell align="right">
                  <Box>
                    <Typography variant="body2">
                      {drink.stock} {drink.unit}(s)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((drink.stock / (drink.minStock * 2)) * 100, 100)}
                      color={getStockStatus(drink.stock, drink.minStock)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{drink.minStock} {drink.unit}(s)</TableCell>
                <TableCell>
                  <Chip
                    label={getStockStatusText(drink.stock, drink.minStock)}
                    color={getStockStatus(drink.stock, drink.minStock)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{drink.supplier}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alertes Stock
        </Typography>
        <Grid container spacing={2}>
          {drinks
            .filter(drink => drink.stock <= drink.minStock * 1.5)
            .map(drink => (
              <Grid item xs={12} sm={6} md={4} key={drink.id}>
                <Alert 
                  severity={drink.stock <= drink.minStock ? 'error' : 'warning'}
                  action={
                    <Button size="small" color="inherit">
                      Commander
                    </Button>
                  }
                >
                  <strong>{drink.name}</strong><br />
                  Stock: {drink.stock} {drink.unit}(s)
                </Alert>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );

  const renderSalesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Ventes du Jour</Typography>
        <Button
          variant="contained"
          onClick={() => setNewSaleDialog(true)}
        >
          Nouvelle Vente
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Historique des Ventes</Typography>
            {sales.map((sale) => (
              <Card key={sale.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{sale.saleNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Servi par: {sale.servedBy}
                    </Typography>
                  </Box>

                  {sale.customerName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Client: {sale.customerName}
                    </Typography>
                  )}

                  <List dense>
                    {sale.items.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${item.quantity}x ${item.name}`}
                          secondary={`${item.price.toLocaleString()} F CFA`}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {(item.quantity * item.price).toLocaleString()} F
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      Total: {sale.totalAmount.toLocaleString()} F CFA
                    </Typography>
                    <Chip 
                      label={sale.paymentMethod}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Résumé du Jour</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nombre de ventes
              </Typography>
              <Typography variant="h4" color="primary">
                {sales.length}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Chiffre d'affaires
              </Typography>
              <Typography variant="h4" color="success.main">
                {sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()} F
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Panier moyen
              </Typography>
              <Typography variant="h5">
                {sales.length > 0 
                  ? Math.round(sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length).toLocaleString()
                  : 0
                } F
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderEventsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion des Événements</Typography>
        <Button
          variant="contained"
          onClick={() => setNewEventDialog(true)}
        >
          Nouvel Événement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{event.name}</Typography>
                  <Chip 
                    label={event.status === 'planned' ? 'Planifié' : event.status}
                    color={event.status === 'planned' ? 'primary' : 'default'}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(event.date).toLocaleDateString('fr-FR')}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {event.type === 'concert' ? 'Concert' : 
                         event.type === 'party' ? 'Soirée' :
                         event.type === 'sport' ? 'Sport' : 'Privé'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Invités attendus: {event.expectedGuests}
                </Typography>

                {event.specialPricing && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="primary" gutterBottom>
                      Tarifs spéciaux:
                    </Typography>
                    {Object.entries(event.specialPricing).map(([drinkId, price]) => {
                      const drink = drinks.find(d => d.id === drinkId);
                      return drink ? (
                        <Typography key={drinkId} variant="body2" sx={{ ml: 2 }}>
                          • {drink.name}: {price.toLocaleString()} F CFA
                        </Typography>
                      ) : null;
                    })}
                  </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">
                    Modifier
                  </Button>
                  {event.status === 'planned' && (
                    <Button size="small" variant="contained" color="success">
                      Activer
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🍺 Gestion Bar
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Stock Boissons" />
          <Tab label="Ventes" />
          <Tab label="Événements" />
        </Tabs>
      </Box>

      {currentTab === 0 && renderStockTab()}
      {currentTab === 1 && renderSalesTab()}
      {currentTab === 2 && renderEventsTab()}

      {/* Dialog pour nouvelle vente */}
      <Dialog open={newSaleDialog} onClose={() => setNewSaleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle Vente</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Interface de vente en cours de développement...
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSaleDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour nouvel événement */}
      <Dialog open={newEventDialog} onClose={() => setNewEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvel Événement</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Interface de création d'événement en cours de développement...
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewEventDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BarDashboard;
