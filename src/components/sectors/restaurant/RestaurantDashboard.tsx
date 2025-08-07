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
  Badge,
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
  Divider
} from '@mui/material';
import {
  Restaurant,
  Kitchen,
  DeliveryDining,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  LocalShipping
} from '@mui/icons-material';

interface RestaurantDashboardProps {
  establishmentId: string;
  userId: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  type: 'dine_in' | 'takeaway' | 'delivery';
  totalAmount: number;
  createdAt: string;
  estimatedTime?: number;
  deliveryAddress?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  preparationTime: number;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ establishmentId, userId }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newOrderDialog, setNewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    type: 'dine_in' as 'dine_in' | 'takeaway' | 'delivery',
    deliveryAddress: '',
    items: [] as { menuItemId: string; quantity: number; notes: string }[]
  });

  // Données de démonstration
  useEffect(() => {
    // Simulation des données de menu
    setMenuItems([
      {
        id: '1',
        name: 'Attiéké Poisson',
        description: 'Attiéké avec poisson grillé et sauce tomate',
        price: 2500,
        category: 'Plats Principaux',
        available: true,
        preparationTime: 15
      },
      {
        id: '2',
        name: 'Riz Gras',
        description: 'Riz gras avec viande et légumes',
        price: 3000,
        category: 'Plats Principaux',
        available: true,
        preparationTime: 20
      },
      {
        id: '3',
        name: 'Alloco',
        description: 'Banane plantain frite avec sauce piment',
        price: 1500,
        category: 'Accompagnements',
        available: true,
        preparationTime: 10
      },
      {
        id: '4',
        name: 'Jus de Bissap',
        description: 'Jus de bissap frais',
        price: 500,
        category: 'Boissons',
        available: true,
        preparationTime: 2
      }
    ]);

    // Simulation des commandes
    setOrders([
      {
        id: '1',
        orderNumber: 'CMD-001',
        customerName: 'Kouassi Jean',
        customerPhone: '+225 07 12 34 56',
        items: [
          { id: '1', name: 'Attiéké Poisson', quantity: 2, price: 2500 },
          { id: '4', name: 'Jus de Bissap', quantity: 2, price: 500 }
        ],
        status: 'preparing',
        type: 'dine_in',
        totalAmount: 6000,
        createdAt: new Date().toISOString(),
        estimatedTime: 15
      },
      {
        id: '2',
        orderNumber: 'CMD-002',
        customerName: 'Aya Marie',
        customerPhone: '+225 05 98 76 54',
        items: [
          { id: '2', name: 'Riz Gras', quantity: 1, price: 3000 },
          { id: '3', name: 'Alloco', quantity: 1, price: 1500 }
        ],
        status: 'pending',
        type: 'delivery',
        totalAmount: 4500,
        createdAt: new Date().toISOString(),
        deliveryAddress: 'Cocody, Riviera 2'
      }
    ]);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'delivered': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prêt';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getTypeIcon = (type: Order['type']) => {
    switch (type) {
      case 'dine_in': return <Restaurant />;
      case 'takeaway': return <Kitchen />;
      case 'delivery': return <DeliveryDining />;
      default: return <Restaurant />;
    }
  };

  const renderOrdersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Commandes du jour</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setNewOrderDialog(true)}
        >
          Nouvelle Commande
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{order.orderNumber}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(order.type)}
                    <Chip 
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Client: {order.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Téléphone: {order.customerPhone}
                </Typography>

                {order.deliveryAddress && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Adresse: {order.deliveryAddress}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <List dense>
                  {order.items.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`${item.quantity}x ${item.name}`}
                        secondary={`${item.price} F CFA`}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    Total: {order.totalAmount.toLocaleString()} F CFA
                  </Typography>
                  {order.estimatedTime && (
                    <Chip 
                      icon={<Schedule />}
                      label={`${order.estimatedTime} min`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {order.status === 'pending' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="info"
                      onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                    >
                      Commencer
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleOrderStatusChange(order.id, 'ready')}
                    >
                      Terminer
                    </Button>
                  )}
                  {order.status === 'ready' && order.type === 'delivery' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<LocalShipping />}
                      onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                    >
                      Livrer
                    </Button>
                  )}
                  {order.status === 'ready' && order.type !== 'delivery' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                    >
                      Servir
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

  const renderKitchenTab = () => {
    const activeOrders = orders.filter(order => ['pending', 'preparing'].includes(order.status));
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Interface Cuisine</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="warning.main">
                <Badge badgeContent={activeOrders.filter(o => o.status === 'pending').length} color="warning">
                  En Attente
                </Badge>
              </Typography>
              {activeOrders.filter(o => o.status === 'pending').map(order => (
                <Card key={order.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{order.orderNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.type === 'delivery' ? 'Livraison' : order.type === 'takeaway' ? 'À emporter' : 'Sur place'}
                    </Typography>
                    <List dense>
                      {order.items.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText primary={`${item.quantity}x ${item.name}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                    >
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="info.main">
                <Badge badgeContent={activeOrders.filter(o => o.status === 'preparing').length} color="info">
                  En Préparation
                </Badge>
              </Typography>
              {activeOrders.filter(o => o.status === 'preparing').map(order => (
                <Card key={order.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{order.orderNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.type === 'delivery' ? 'Livraison' : order.type === 'takeaway' ? 'À emporter' : 'Sur place'}
                    </Typography>
                    <List dense>
                      {order.items.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText primary={`${item.quantity}x ${item.name}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOrderStatusChange(order.id, 'ready')}
                    >
                      Terminer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderDeliveryTab = () => {
    const deliveryOrders = orders.filter(order => order.type === 'delivery');
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Gestion des Livraisons</Typography>
        
        <Grid container spacing={3}>
          {deliveryOrders.map(order => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{order.orderNumber}</Typography>
                    <Chip 
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                    />
                  </Box>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Client:</strong> {order.customerName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Téléphone:</strong> {order.customerPhone}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Adresse:</strong> {order.deliveryAddress}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Montant:</strong> {order.totalAmount.toLocaleString()} F CFA
                  </Typography>

                  {order.status === 'ready' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LocalShipping />}
                      onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                      sx={{ mt: 2 }}
                    >
                      Marquer comme livré
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🍽️ Gestion Restaurant
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab 
            label={
              <Badge badgeContent={orders.filter(o => ['pending', 'preparing'].includes(o.status)).length} color="primary">
                Commandes
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={orders.filter(o => o.status === 'preparing').length} color="info">
                Cuisine
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={orders.filter(o => o.type === 'delivery' && o.status === 'ready').length} color="warning">
                Livraisons
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {currentTab === 0 && renderOrdersTab()}
      {currentTab === 1 && renderKitchenTab()}
      {currentTab === 2 && renderDeliveryTab()}

      {/* Dialog pour nouvelle commande */}
      <Dialog open={newOrderDialog} onClose={() => setNewOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle Commande</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Interface de création de commande en cours de développement...
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom du client"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type de commande</InputLabel>
                <Select
                  value={newOrder.type}
                  onChange={(e) => setNewOrder({...newOrder, type: e.target.value as any})}
                >
                  <MenuItem value="dine_in">Sur place</MenuItem>
                  <MenuItem value="takeaway">À emporter</MenuItem>
                  <MenuItem value="delivery">Livraison</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newOrder.type === 'delivery' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse de livraison"
                  value={newOrder.deliveryAddress}
                  onChange={(e) => setNewOrder({...newOrder, deliveryAddress: e.target.value})}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewOrderDialog(false)}>Annuler</Button>
          <Button variant="contained" disabled>Créer (En développement)</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantDashboard;
