// src\utils\getTodayString.ts

// Получаем сегодняшнюю дату в формате "YYYY-MM-DD" по местному времени
export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};