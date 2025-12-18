export function formatDate(dateString: string, lang: 'ja' | 'en') {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (lang === 'en') {
    return `${month}.${day}.${year}`;
  } else {
    return `${year}.${month}.${day}`;
  }
}
