import type { AmortizationRow } from '@/lib/types';

interface Props {
  schedule: AmortizationRow[];
}

const fmt = (val: number) =>
  `¥${Math.round(val).toLocaleString('ja-JP')}`;

export default function AmortizationTable({ schedule }: Props) {
  return (
    <div className="table-section">
      <h3>返済スケジュール（全{schedule.length}回）</h3>
      <div className="table-container">
        <table className="amortization-table">
          <thead>
            <tr>
              <th>回数</th>
              <th>月々の返済額</th>
              <th>元金</th>
              <th>利息</th>
              <th>残高</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month}>
                <td>{row.month}回目</td>
                <td>{fmt(row.payment)}</td>
                <td>{fmt(row.principal)}</td>
                <td>{fmt(row.interest)}</td>
                <td>{fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
