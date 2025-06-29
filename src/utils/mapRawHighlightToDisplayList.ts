import type { DisplayHighlight, RawHighlight } from "../types";

export function numberToDate(num: number) {
  if (num < 0 || num > 364) {
    throw new Error("Number must be between 0 and 364");
  }

  const date = new Date(2024, 0);
  date.setDate(date.getDate() + num);

  // Получаем день и месяц
  const day = date.getDate();
  const month = date.toLocaleString("ru-RU", { month: "long" });

  return `${day} ${month}`;
}

export function mapRawHighlightToDisplayList(
  raw: RawHighlight,
): DisplayHighlight[] {
  return [
    {
      value: `${raw.total_spend_galactic}`,
      label: "общие расходы в галактических кредитах",
    },
    {
      value: `${raw.less_spent_civ}`,
      label: "цивилизация с минимальными расходами",
    },
    {
      value: `${raw.rows_affected}`,
      label: "количество обработанных записей",
    },
    {
      value: `${numberToDate(raw.less_spent_at)}`,
      label: "день года с минимальными расходами",
    },
    {
      value: `${numberToDate(raw.big_spent_at)}`,
      label: "день года с максимальными расходами",
    },
    {
      value: `${raw.big_spent_value}`,
      label: "максимальная сумма расходов за день",
    },
    {
      value: `${raw.big_spent_civ}`,
      label: "цивилизация с максимальными расходами",
    },
    {
      value: `${raw.average_spend_galactic}`,
      label: "средние расходы в галактических кредитах",
    },
  ];
}
