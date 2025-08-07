import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';

interface User {
  id: string;
  email: string;
  role: string;
  boutique_id: string | null;
}

interface Boutique {
  id: string;
  name: string;
}

const roles = ['admin_master', 'admin_central', 'manager', 'cashier'];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager');
  const [boutiqueId, setBoutiqueId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBoutiques = async () => {
    try {
      const { data, error } = await supabase.from('boutiques').select('*');
      if (error) throw error;
      setBoutiques(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des boutiques');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBoutiques();
  }, []);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditUser(user);
      setEmail(user.email);
      setRole(user.role);
      setBoutiqueId(user.boutique_id);
    } else {
      setEditUser(null);
      setEmail('');
      setRole('manager');
      setBoutiqueId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editUser) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({ role, boutique_id: boutiqueId })
          .eq('id', editUser.id);
        if (error) throw error;
      } else {
        // Create new user
        const { error } = await supabase.from('users').insert([{ email, role, boutique_id: boutiqueId }]);
        if (error) throw error;
      }
      await fetchUsers();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administration des Utilisateurs
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Ajouter un utilisateur
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Boutique</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{boutiques.find(b => b.id === user.boutique_id)?.name || '-'}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpenDialog(user)}>Modifier</Button>
                <Button size="small" color="error" onClick={() => handleDeleteUser(user.id)}>Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editUser ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            disabled={!!editUser}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rôle</InputLabel>
            <Select value={role} onChange={e => setRole(e.target.value)}>
              {roles.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Boutique</InputLabel>
            <Select value={boutiqueId || ''} onChange={e => setBoutiqueId(e.target.value || null)}>
              <MenuItem value="">Aucune</MenuItem>
              {boutiques.map(b => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveUser} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
