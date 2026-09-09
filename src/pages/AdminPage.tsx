import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Input, Select } from '../components/common/Input';

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  pdfUrl?: string;
  template?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'clients' | 'messages'>('clients');
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const fetchClients = useCallback(async () => {
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const records: ClientRecord[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const personalData = (d.personalData || d.pd || d.data) as { fullName?: string; email?: string } | undefined;
        const fullName = personalData?.fullName || (d.fullName as string | undefined) || 'Unknown';
        const email = personalData?.email || (d.email as string | undefined) || '';
        const createdAt = d.createdAt?.toDate?.() ?? new Date(d.createdAt as string);
        return {
          id: doc.id,
          name: fullName,
          email,
          createdAt,
          pdfUrl: d.pdfUrl as string | undefined,
          template: d.template as string | undefined,
        };
      });
      setClients(records);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const q = query(collection(db, 'contact-messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const records: ContactMessage[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || '',
          email: d.email || '',
          message: d.message || '',
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
        };
      });
      setMessages(records);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchClients(), fetchMessages()]);
    setLoading(false);
  }, [fetchClients, fetchMessages]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredClients = clients
    .filter((c) => {
      const term = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const filteredMessages = messages
    .filter((m) => {
      const term = searchTerm.toLowerCase();
      return m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || m.message.toLowerCase().includes(term);
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const stats = {
    totalClients: clients.length,
    totalMessages: messages.length,
    thisWeek: clients.filter((c) => Date.now() - c.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Signed in as {user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchAll}
            leftIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}>
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="default" padding="md" className="border-l-4 border-indigo-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Clients</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalClients}</p>
        </Card>
        <Card variant="default" padding="md" className="border-l-4 border-green-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">Messages</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalMessages}</p>
        </Card>
        <Card variant="default" padding="md" className="border-l-4 border-yellow-500">
          <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.thisWeek}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'clients'
              ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Clients ({clients.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'messages'
              ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Messages ({messages.length})
        </button>
      </div>

      {/* Search */}
      <Card variant="default" padding="md">
        <CardContent>
          <Input
            placeholder={activeTab === 'clients' ? 'Search by name or email...' : 'Search messages...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <Card variant="default" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Loading...</td></tr>
                ) : filteredClients.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No clients found.</td></tr>
                ) : filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{client.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {client.template ? client.template.charAt(0).toUpperCase() + client.template.slice(1) : 'Classic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {client.pdfUrl ? (
                        <a href={client.pdfUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
                          View PDF
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">No PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {loading ? (
            <Card variant="default" padding="lg"><p className="text-center text-slate-500 dark:text-slate-400">Loading...</p></Card>
          ) : filteredMessages.length === 0 ? (
            <Card variant="default" padding="lg"><p className="text-center text-slate-500 dark:text-slate-400">No messages found.</p></Card>
          ) : filteredMessages.map((msg) => (
            <Card key={msg.id} variant="default" padding="lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{msg.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{msg.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{msg.message}</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {msg.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
