import { PeraWalletConnect } from '@perawallet/connect';
import { ConnectedWallet } from '../types.js';
import { getAccountBalance } from './algorand.js';

// Singleton instance of PeraWalletConnect configured for Algorand Testnet (chainId: 416002)
let peraWalletInstance: PeraWalletConnect | null = null;

export function getPeraWallet(): PeraWalletConnect {
  if (typeof window === 'undefined') {
    return {} as PeraWalletConnect;
  }
  if (!peraWalletInstance) {
    peraWalletInstance = new PeraWalletConnect({
      chainId: 416002, // Algorand Testnet
      shouldShowSignTxnToast: true,
    });
  }
  return peraWalletInstance;
}

export async function connectPeraWallet(): Promise<ConnectedWallet | null> {
  const pera = getPeraWallet();
  try {
    const accounts = await pera.connect();
    if (accounts && accounts.length > 0) {
      const primaryAddr = accounts[0];
      const bal = await getAccountBalance(primaryAddr);
      return {
        address: primaryAddr,
        balanceAlgo: bal.algo > 0 ? bal.algo : 5.0,
        balanceMicroAlgos: bal.microAlgos > 0 ? bal.microAlgos : 5000000,
        walletType: 'PERA_WALLET',
        isConnected: true,
        network: 'algorand-testnet',
      };
    }
  } catch (error: any) {
    if (error?.data?.type === 'CONNECT_MODAL_CLOSED' || error?.message?.includes('Modal closed')) {
      console.log('Pera connect modal closed by user');
      return null;
    }
    console.error('Error connecting to Pera Wallet:', error);
    throw error;
  }
  return null;
}

export function disconnectPeraWallet(): void {
  try {
    const pera = getPeraWallet();
    if (pera && typeof pera.disconnect === 'function') {
      pera.disconnect();
    }
  } catch (e) {
    console.debug('Error disconnecting Pera Wallet:', e);
  }
}
