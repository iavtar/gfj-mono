import React from 'react';

const LedgerStats = ({ ledgers }) => {
  const getStats = () => {
    console.log("Ledgers", ledgers);
    const totalTransactions = ledgers?.totalTransactions;
    const totalCredit = ledgers?.totalCredit;
    const totalCreditTransactions = ledgers?.totalCreditTransactions;
    const totalDebit = ledgers?.totalDebit;
    const totalDebitTransactions = ledgers?.totalDebitTransactions;
    const balance = ledgers?.currentBalance;

    return {
      totalTransactions,
      totalCredit,
      totalCreditTransactions,
      totalDebit,
      totalDebitTransactions,
      balance,
    };
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: '💸',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Credits',
      value: stats.totalCreditTransactions,
      icon: '💰',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Credit Value',
      value: "$ " + stats.totalCredit,
      icon: '💲',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Debits',
      value: stats.totalDebitTransactions,
      icon: '💰',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Debit Value',
      value: "$ " + stats.totalDebit,
      icon: '💲',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Balance',
      value: "$ " + stats.balance,
      icon: '💵',
      color: stats.balance >= 0 ? 'bg-green-500' : 'bg-red-500',
      textColor: stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat?.title}</p>
              <p className={`text-2xl font-bold ${stat?.textColor}`}>{stat?.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat?.color} flex items-center justify-center text-white text-xl`}>
              {stat?.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LedgerStats; 