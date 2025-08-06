import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import { setupTestData, cleanupTestData, testSupabaseConnection } from '../scripts/setupTestData'

export const TestSetup: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const connectionResult = await testSupabaseConnection()
      setResult(connectionResult)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupData = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const setupResult = await setupTestData()
      setResult(setupResult)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanupData = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const cleanupResult = await cleanupTestData()
      setResult(cleanupResult)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        🧪 Configuration de Test OBS CAISSE
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Utilisez ces outils pour configurer et tester l'application OBS CAISSE
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleTestConnection}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Tester Connexion
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSetupData}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Initialiser Données
        </Button>
        
        <Button
          variant="outlined"
          color="warning"
          onClick={handleCleanupData}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Nettoyer Données
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Erreur</Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      {result && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {result.success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6">✅ Opération réussie</Typography>
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="h6">❌ Opération échouée</Typography>
                <Typography>{result.error?.message}</Typography>
              </Alert>
            )}

            {result.client && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  📊 Données créées :
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Client Entreprise" 
                      secondary={result.client.nom}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Boutiques" 
                      secondary={`${result.stores?.length || 0} boutiques créées`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Produits" 
                      secondary={`${result.products?.length || 0} produits au catalogue`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="IMEI" 
                      secondary={`${result.imeiRecords?.length || 0} enregistrements IMEI`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Ventes de test" 
                      secondary={`${result.sales?.length || 0} ventes créées`}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Instructions
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="1. Tester Connexion" 
                secondary="Vérifiez que la connexion à Supabase fonctionne"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Initialiser Données" 
                secondary="Créez les données de test (client, boutiques, produits, IMEI, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Tester l'Application" 
                secondary="Une fois les données créées, vous pouvez tester l'interface POS"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Nettoyer (Optionnel)" 
                secondary="Supprimez toutes les données de test si nécessaire"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
