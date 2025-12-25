import { Router } from 'express';
import { createAccount, getAccountById, getAccounts, updateAccount, deleteAccount } from '../controllers/accountController';

const router: Router = Router();

// Create a new account
router.post('/', createAccount);

// Get all accounts
router.get('/', getAccounts);

// Get account by ID
router.get('/:id', getAccountById);

// Update account
router.put('/:id', updateAccount);

// Delete account
router.delete('/:id', deleteAccount);

export default router;