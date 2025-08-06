import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material'
import {
  Dashboard,
  Store,
  Inventory,
  People,
  Assessment,
  Settings,
  ExitToApp,
  Menu
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'

const drawerWidth = 240

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Dashboard, path: '/admin' },
  { id: 'boutiques', label: 'Boutiques', icon: Store, path: '/admin/boutiques' },
  { id: 'inventory', label: 'Inventaire', icon: Inventory, path: '/admin/inventory' },
  { id: 'users', label: 'Utilisateurs', icon: People, path: '/admin/users' },
  { id: 'reports', label: 'Rapports', icon: Assessment, path: '/admin/reports' },
  { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
]

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    await signOut()
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          OBS CAISSE
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Administration
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.first_name} {user?.last_name} ({user?.role})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/boutiques" element={<BoutiquesManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

// Composants temporaires pour les différentes sections
const DashboardHome: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Tableau de bord
    </Typography>
    <Typography variant="body1">
      Bienvenue dans l'interface d'administration OBS Caisse.
    </Typography>
  </Box>
)

const BoutiquesManagement: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Gestion des boutiques
    </Typography>
    <Typography variant="body1">
      Interface de gestion des boutiques en cours de développement.
    </Typography>
  </Box>
)

const InventoryManagement: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Gestion de l'inventaire
    </Typography>
    <Typography variant="body1">
      Interface de gestion de l'inventaire en cours de développement.
    </Typography>
  </Box>
)

const UsersManagement: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Gestion des utilisateurs
    </Typography>
    <Typography variant="body1">
      Interface de gestion des utilisateurs en cours de développement.
    </Typography>
  </Box>
)

const ReportsView: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Rapports
    </Typography>
    <Typography variant="body1">
      Interface des rapports en cours de développement.
    </Typography>
  </Box>
)

const SettingsView: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Paramètres
    </Typography>
    <Typography variant="body1">
      Interface des paramètres en cours de développement.
    </Typography>
  </Box>
)
