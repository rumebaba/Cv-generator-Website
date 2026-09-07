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

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const records: ClientRecord[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const personalData = d.personalData as { fullName?: string; email?: string } | undefined;
        return {
          id: doc.id,
          name: personalData?.fullName || 'Unknown',
          email: personalData?.email || '',
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
          pdfUrl: d.pdfUrl as string | undefined,
          template: d.template as string | undefined,
        };
      });
      setClients(records);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError('Failed to load clients. Check your Firebase config and Firestore rules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clients
    .filter((c) => {
      const term = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const stats = {
    total: clients.length,
    withPdf: clients.filter((c) => c.pdfUrl).length,
    thisWeek: clients.filter((c) => {
      const diff = Date.now() - c.createdAt.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Signed in as {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="default" padding="md" className="border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Clients</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md" className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">With PDF</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.withPdf}</p>
            </div>
          </div>
        </Card>
        <Card variant="default" padding="md" className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.thisWeek}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="default" padding="md">
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <div className="relative">
              <svg
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              options={[
                { value: 'date', label: 'Latest First' },
                { value: 'name', label: 'Name (A-Z)' },
              ]}
              className="w-40"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {clients.length} clients
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <Card variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  CV PDF
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      Loading clients...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {clients.length === 0
                      ? 'No clients yet. Submissions will appear here.'
                      : 'No clients match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {client.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {client.template
                          ? client.template.charAt(0).toUpperCase() + client.template.slice(1)
                          : 'Classic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {client.pdfUrl ? (
                        <a
                          href={client.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View PDF
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400 dark:text-slate-500">No PDF</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
