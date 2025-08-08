# OBS SYSTEME - Spécifications API

## ENDPOINTS PRINCIPAUX

### 1. AUTHENTIFICATION

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "cashier",
    "boutique_id": "uuid",
    "boutique_name": "Boutique Yaoundé"
  }
}
```

### 2. GESTION DES VENTES

#### POST /sales
```json
{
  "customer_name": "Jean Dupont",
  "customer_phone": "+237123456789",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 1,
      "unit_price": 450000,
      "imei": "123456789012345"
    }
  ],
  "payment_method": "cash",
  "amount_received": 500000
}
```

#### GET /sales/{id}/receipt
Génère le reçu de vente pour impression

### 3. GESTION STOCK

#### GET /stock?boutique_id={id}
Liste le stock d'une boutique

#### POST /stock/adjustment
```json
{
  "product_id": "uuid",
  "boutique_id": "uuid",
  "quantity_change": -2,
  "reason": "Vente",
  "reference_id": "sale_uuid"
}
```

### 4. TRAÇABILITÉ IMEI

#### GET /imei/{imei}/history
Historique complet d'un IMEI

#### POST /imei/validate
```json
{
  "imei": "123456789012345",
  "product_id": "uuid"
}
```

### 5. TRANSFERTS

#### POST /transfers
```json
{
  "from_boutique_id": "uuid",
  "to_boutique_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 5
    }
  ],
  "notes": "Réapprovisionnement urgent"
}
```

### 6. ABONNEMENTS

#### GET /subscriptions/status/{boutique_id}
Statut d'abonnement d'une boutique

#### POST /subscriptions/payment
```json
{
  "boutique_id": "uuid",
  "amount": 20000,
  "payment_method": "bank_transfer",
  "reference": "TXN123456"
}
```

## CODES D'ERREUR

- **400**: Données invalides
- **401**: Non authentifié
- **403**: Accès refusé
- **404**: Ressource non trouvée
- **409**: Conflit (ex: IMEI déjà utilisé)
- **429**: Trop de requêtes
- **500**: Erreur serveur

## WEBHOOKS

### Notification paiement abonnement
```json
{
  "event": "subscription.paid",
  "boutique_id": "uuid",
  "amount": 20000,
  "period_start": "2024-01-01",
  "period_end": "2024-01-31"
}
```

### Alerte stock faible
```json
{
  "event": "stock.low",
  "boutique_id": "uuid",
  "product_id": "uuid",
  "current_stock": 2,
  "threshold": 5
}
