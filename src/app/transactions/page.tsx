'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  receipt?: string; // base64 image/data
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    date: '',
    description: '',
    amount: 0,
    receipt: undefined,
  });

  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleReceipt = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(prev => ({ ...prev, receipt: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm({ date: '', description: '', amount: 0, receipt: undefined });
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTransactions(prev => prev.map(t => (t.id === editingId ? { id: editingId, ...form } : t)));
    } else {
      setTransactions(prev => [...prev, { id: crypto.randomUUID(), ...form }]);
    }
    resetForm();
  };

  const handleEdit = (id: string) => {
    const t = transactions.find(tr => tr.id === id);
    if (!t) return;
    setForm({ date: t.date, description: t.description, amount: t.amount, receipt: t.receipt });
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const t = transactions.find(tr => tr.id === id);
    if (!t) return;
    setTransactions(prev => [...prev, { ...t, id: crypto.randomUUID() }]);
  };

  const exportCSV = () => {
    const header = 'date,description,amount\n';
    const rows = transactions
      .map(t => `${t.date},${t.description.replace(/,/g, ';')},${t.amount}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const entries: Transaction[] = lines.slice(1).map(line => {
        const [date, description, amount] = line.split(',');
        return { id: crypto.randomUUID(), date, description, amount: Number(amount) };
      });
      setTransactions(prev => [...prev, ...entries]);
    };
    reader.readAsText(file);
  };

  const exportExcel = () => {
    const header = ['date', 'description', 'amount'];
    const rows = transactions.map(t => [t.date, t.description, String(t.amount)]);
    const xmlRows = rows
      .map(r => '<Row>' + r.map(c => `<Cell><Data ss:Type="String">${c}</Data></Cell>`).join('') + '</Row>')
      .join('');
    const xml =
      `<?xml version="1.0"?>` +
      `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">` +
      '<Worksheet ss:Name="Sheet1"><Table>' +
      '<Row>' +
      header.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('') +
      '</Row>' +
      xmlRows +
      '</Table></Worksheet></Workbook>';
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const rowRegex = /<Row>(.*?)<\/Row>/g;
      const cellRegex = /<Cell>.*?<Data[^>]*>(.*?)<\/Data><\/Cell>/g;
      const rows: Transaction[] = [];
      const matches = text.matchAll(rowRegex);
      let first = true;
      for (const row of matches) {
        if (first) {
          first = false;
          continue; // skip header
        }
        const cells = [...row[1].matchAll(cellRegex)].map(m => m[1]);
        if (cells.length >= 3) {
          rows.push({ id: crypto.randomUUID(), date: cells[0], description: cells[1], amount: Number(cells[2]) });
        }
      }
      setTransactions(prev => [...prev, ...rows]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Transactions</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-1" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-1 w-full" required />
        <input name="amount" type="number" value={form.amount} onChange={handleChange} className="border p-1" required />
        <input name="receipt" type="file" onChange={handleReceipt} className="" />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="ml-2 px-3 py-1 border rounded">
            Cancel
          </button>
        )}
      </form>
      <div className="flex gap-2">
        <input type="file" accept=".csv" onChange={e => e.target.files && importCSV(e.target.files[0])} />
        <input type="file" accept=".xls" onChange={e => e.target.files && importExcel(e.target.files[0])} />
        <button onClick={exportCSV} className="px-3 py-1 border rounded">
          Export CSV
        </button>
        <button onClick={exportExcel} className="px-3 py-1 border rounded">
          Export Excel
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-1">Date</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Amount</th>
            <th className="border p-1">Receipt</th>
            <th className="border p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td className="border p-1">{t.date}</td>
              <td className="border p-1">{t.description}</td>
              <td className="border p-1 text-right">{t.amount.toFixed(2)}</td>
              <td className="border p-1 text-center">
                {t.receipt ? (
                  <a href={t.receipt} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    view
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="border p-1 space-x-1 text-center">
                <button onClick={() => handleEdit(t.id)} className="px-2 py-0.5 border rounded text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="px-2 py-0.5 border rounded text-sm">
                  Delete
                </button>
                <button onClick={() => handleDuplicate(t.id)} className="px-2 py-0.5 border rounded text-sm">
                  Duplicate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
