'use client';

import { useMemo, useState } from 'react';
import transactions, { Transaction } from '@/data/transactions';

interface Filter {
  query: string;
  from: string;
  to: string;
  type: 'all' | 'income' | 'expense';
}

function filterTransactions(data: Transaction[], filter: Filter) {
  return data.filter((t) => {
    const matchQuery = t.description.toLowerCase().includes(filter.query.toLowerCase());
    const matchType = filter.type === 'all' || t.type === filter.type;
    const afterFrom = !filter.from || new Date(t.date) >= new Date(filter.from);
    const beforeTo = !filter.to || new Date(t.date) <= new Date(filter.to);
    return matchQuery && matchType && afterFrom && beforeTo;
  });
}

function aggregateByMonth(data: Transaction[]) {
  const map: Record<string, { income: number; expense: number }> = {};
  data.forEach((t) => {
    const key = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    map[key][t.type] += t.amount;
  });
  return map;
}

function aggregateByYear(data: Transaction[]) {
  const map: Record<string, { income: number; expense: number }> = {};
  data.forEach((t) => {
    const key = new Date(t.date).getFullYear().toString();
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    map[key][t.type] += t.amount;
  });
  return map;
}

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>({ query: '', from: '', to: '', type: 'all' });

  const filtered = useMemo(() => filterTransactions(transactions, filter), [filter]);
  const monthly = useMemo(() => aggregateByMonth(filtered), [filtered]);
  const yearly = useMemo(() => aggregateByYear(filtered), [filtered]);

  const months = Object.keys(monthly).sort();
  const years = Object.keys(yearly).sort();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <input
            className="border p-2"
            placeholder="Buscar..."
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
          />
          <input
            className="border p-2"
            type="date"
            value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          />
          <input
            className="border p-2"
            type="date"
            value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          />
          <select
            className="border p-2"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value as Filter['type'] })}
          >
            <option value="all">Todo</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Transacciones</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Fecha</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Categoría</th>
              <th className="border p-2 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="odd:bg-gray-100">
                <td className="border p-2">{t.date}</td>
                <td className="border p-2">{t.description}</td>
                <td className="border p-2">{t.category}</td>
                <td className="border p-2 text-right">{t.type === 'expense' ? '-' : ''}${t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Estadísticas Mensuales</h2>
        <svg viewBox={`0 0 ${months.length * 40} 200`} className="w-full">
          {months.map((m, i) => {
            const income = monthly[m]?.income || 0;
            const expense = monthly[m]?.expense || 0;
            const max = Math.max(income, expense);
            const incomeHeight = (income / max) * 100 || 0;
            const expenseHeight = (expense / max) * 100 || 0;
            const x = i * 40;
            return (
              <g key={m} transform={`translate(${x},0)`}>
                <rect x={5} y={100 - incomeHeight} width={10} height={incomeHeight} fill="#4ade80" />
                <rect x={20} y={100 - expenseHeight} width={10} height={expenseHeight} fill="#f87171" />
                <text x={15} y={115} fontSize="10" textAnchor="middle">
                  {m.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Estadísticas Anuales</h2>
        <svg viewBox={`0 0 ${years.length * 40} 200`} className="w-full">
          {years.map((y, i) => {
            const income = yearly[y]?.income || 0;
            const expense = yearly[y]?.expense || 0;
            const max = Math.max(income, expense);
            const incomeHeight = (income / max) * 100 || 0;
            const expenseHeight = (expense / max) * 100 || 0;
            const x = i * 40;
            return (
              <g key={y} transform={`translate(${x},0)`}>
                <rect x={5} y={100 - incomeHeight} width={10} height={incomeHeight} fill="#4ade80" />
                <rect x={20} y={100 - expenseHeight} width={10} height={expenseHeight} fill="#f87171" />
                <text x={15} y={115} fontSize="10" textAnchor="middle">
                  {y}
                </text>
              </g>
            );
          })}
        </svg>
      </section>
    </div>
  );
}
