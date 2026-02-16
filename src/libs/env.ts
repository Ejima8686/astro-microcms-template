/**
 * 環境変数関連のユーティリティ関数
 */

/**
 * ダミーデータを使用するかどうかを判定
 * @returns ダミーデータを使用する場合はtrue
 */
export function useDummyData(): boolean {
  const value = import.meta.env.VITE_USE_DUMMY_DATA;
  return value === 'true' || (typeof value === 'boolean' && value === true);
}
