import dayjs from 'dayjs'

/** "直近"の日付を取得 */
export const getLatestDate = (now: Date): Date => dayjs(now).subtract(1, 'weeks').toDate()
