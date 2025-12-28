// api/contacts.ts
import { Contact } from '../types/Contact';

const CONTACTS_KEY = 'abetworks-contacts';

// Mock API service for contacts
export const contactService = {
  getAll: (): Contact[] => {
    const contacts = localStorage.getItem(CONTACTS_KEY);
    return contacts ? JSON.parse(contacts) : [];
  },

  getById: (id: number): Contact | undefined => {
    const contacts = contactService.getAll();
    return contacts.find(contact => contact.id === id);
  },

  create: (contact: Omit<Contact, 'id'>): Contact => {
    const contacts = contactService.getAll();
    const newContact = { ...contact, id: Date.now() };
    contacts.push(newContact);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    return newContact;
  },

  update: (id: number, updatedContact: Partial<Contact>): Contact | undefined => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updatedContact };
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      return contacts[index];
    }
    return undefined;
  },

  delete: (id: number): boolean => {
    const contacts = contactService.getAll();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    if (filteredContacts.length !== contacts.length) {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(filteredContacts));
      return true;
    }
    return false;
  }
};