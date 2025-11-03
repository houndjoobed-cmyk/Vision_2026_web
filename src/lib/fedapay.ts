// Configuration FedaPay
export const FEDAPAY_CONFIG = {
  publicKey: import.meta.env.VITE_FEDAPAY_PUBLIC_KEY || '',
  sandboxMode: true, // Forcer le mode sandbox pour le développement
  currency: 'XOF',
};

// Avertissement si les variables d'environnement ne sont pas configurées
if (!FEDAPAY_CONFIG.publicKey) {
  console.warn(
    '⚠️ FedaPay non configuré: Ajoutez VITE_FEDAPAY_PUBLIC_KEY dans .env.local'
  );
}

// Interface pour les paramètres de donation
export interface DonationParams {
  amount: number;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  description?: string;
  customMetadata?: Record<string, any>;
}

/**
 * Crée une URL de paiement FedaPay
 * @param params Paramètres de la donation
 * @returns URL de redirection vers la page de paiement FedaPay
 */
export function createFedaPayCheckoutUrl(params: DonationParams): string {
  // Toujours utiliser l'URL sandbox pour le développement
  const baseUrl = 'https://sandbox-checkout.fedapay.com';

    // Construire l'URL avec les paramètres
  const origin = window.location.origin;
  const checkoutParams = new URLSearchParams({
    public_key: FEDAPAY_CONFIG.publicKey,
    amount: params.amount.toString(),
    currency: FEDAPAY_CONFIG.currency,
    description: params.description || `Don pour Vision 2026 - ${params.amount} FCFA`,
    // URLs de callback avec le hash pour le routage côté client
    callback_url: `${origin}/#/donation-success`,
    cancel_url: `${origin}/#/donation-cancel`,
  });  // Ajouter les informations du donateur si disponibles
  if (params.donorEmail) {
    checkoutParams.append('customer[email]', params.donorEmail);
  }
  if (params.donorName) {
    checkoutParams.append('customer[firstname]', params.donorName.split(' ')[0]);
    if (params.donorName.split(' ')[1]) {
      checkoutParams.append('customer[lastname]', params.donorName.split(' ').slice(1).join(' '));
    }
  }
  if (params.donorPhone) {
    checkoutParams.append('customer[phone_number][number]', params.donorPhone);
    checkoutParams.append('customer[phone_number][country]', 'BJ'); // Bénin
  }

  // Ajouter les métadonnées personnalisées
  if (params.customMetadata) {
    checkoutParams.append('custom_metadata', JSON.stringify(params.customMetadata));
  }

  return `${baseUrl}?${checkoutParams.toString()}`;
}

/**
 * Alternative: Utiliser FedaPay Widget (popup)
 * Cette fonction initialise le widget FedaPay pour un paiement en popup
 */
export function openFedaPayWidget(params: DonationParams) {
  // Vérifier si FedaPay SDK est chargé
  if (typeof window === 'undefined' || !(window as any).FedaPay) {
    console.error('FedaPay SDK not loaded. Add <script src="https://cdn.fedapay.com/checkout.js?v=1.1.7"></script> to your HTML');
    return;
  }

  const FedaPay = (window as any).FedaPay;

  FedaPay.init({
    public_key: 'pk_sandbox_htQkSZ-hAcDgUz_5mWXqQVMN', // Utiliser directement la clé sandbox
    transaction: {
      amount: params.amount,
      description: params.description || `Don pour Vision 2026 - ${params.amount} FCFA`,
    },
    customer: {
      email: params.donorEmail,
      firstname: params.donorName?.split(' ')[0],
      lastname: params.donorName?.split(' ').slice(1).join(' '),
      phone_number: {
        number: params.donorPhone,
        country: 'BJ',
      },
    },
    currency: {
      iso: FEDAPAY_CONFIG.currency,
    },
    custom_metadata: params.customMetadata,
    onComplete: (response: any) => {
      console.log('Payment completed:', response);
      // Rediriger vers la page de succès avec le hash
      window.location.href = `/#/donation-success?transaction_id=${response.id}`;
    },
    onCancel: () => {
      console.log('Payment cancelled');
      window.location.href = '/#/donation-cancel';
    },
  });

  FedaPay.open();
}

/**
 * Formater le montant en FCFA
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
}
